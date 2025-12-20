import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {getUserInfo} from "../services/userInfo"
import {getSemesterGrades} from "../services/semesterGrades.js"
import {getSelection} from "../services/selection.js"
import {processGrades} from "../utils/gradeHelpers.js"

// Componentes
import {FullScreenLoader} from "../components/ui/FullScreenLoader"
import {Header} from "../components/home/Header"
import {Sidebar} from "../components/home/Sidebar"
import {GradesTable} from "../components/home/GradesTable"
import {HomeModals} from "../components/home/HomeModals"
import {MobileMenu} from "../components/home/MobileMenu"

function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [shortName, setShortName] = useState({splitted: "Estudiante", firstLetter: "U"})

    // Datos
    const [pensumData, setPensumData] = useState(null)
    const [currentGrades, setCurrentGrades] = useState([])
    const [displayedGrades, setDisplayedGrades] = useState([])
    const [headers, setHeaders] = useState([])

    // Estados de Control
    const [selectedPeriod, setSelectedPeriod] = useState(1)
    const [periodInfo, setPeriodInfo] = useState({credits: 0, average: "0.0", status: "Pendiente"})
    const [isFullScreenLoading, setIsFullScreenLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [activeModal, setActiveModal] = useState(null)

    // Estados para móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // 1. CARGA INICIAL
    useEffect(() => {
        const token = localStorage.getItem("auth_token")
        const localUserData = localStorage.getItem("user_display_data")

        if (!token) {
            window.location.href = "/login"
            return
        }

        if (localUserData) {
            try {
                const parsedData = JSON.parse(localUserData)
                setUser({data: parsedData, picture: parsedData.picture})
                const rawNames = parsedData.first_name || parsedData.names || ""
                const formattedName = rawNames.split(" ")[0] || "Estudiante"
                setShortName({splitted: formattedName, firstLetter: formattedName.charAt(0)})
            } catch (e) {
                console.error(e)
            }
        }

        const initApp = async () => {
            try {
                await new Promise((r) => setTimeout(r, 500))
                const [userData, selectionData] = await Promise.all([getUserInfo(), getSelection()])

                if (userData?.data) {
                    setUser((prev) => ({
                        ...prev,
                        ...userData,
                        picture: userData.data.picture || prev?.picture,
                    }))
                }
                if (selectionData) setPensumData(selectionData)

                setIsFullScreenLoading(false)
            } catch (error) {
                console.error("Error inicializando:", error)
                setIsFullScreenLoading(false)
            }
        }
        initApp()
    }, [navigate])

    // 2. EFECTO AL CAMBIAR PERIODO
    useEffect(() => {
        const fetchGrades = async () => {
            setIsRefreshing(true)
            try {
                const academicPeriod = localStorage.getItem("auth_current_period") || "3"
                const gradesRes = await getSemesterGrades(academicPeriod)
                const {processedData, dynamicHeaders} = processGrades(gradesRes?.data || [])
                setCurrentGrades(processedData)
                setHeaders(dynamicHeaders)
            } catch (error) {
                console.error("Error fetching grades:", error)
                setCurrentGrades([])
            } finally {
                setIsRefreshing(false)
            }
        }

        if (!isFullScreenLoading) {
            fetchGrades()
        }
    }, [selectedPeriod, isFullScreenLoading])

    // 3. FUSIÓN DE DATOS
    useEffect(() => {
        if (!pensumData) return

        const subjectsInPeriod = pensumData[selectedPeriod] || []

        const mergedData = subjectsInPeriod.map((pensumSubject) => {
            const foundGrade = currentGrades.find((grade) => {
                const gradeCode = grade.fullGroupCode?.split("-").slice(0, 2).join("-")
                const pensumCode = pensumSubject.code || pensumSubject.codeSubject

                if (gradeCode === pensumCode) return true

                const gradeName = (grade.course || grade.subject || "").toLowerCase()
                const pensumName = (
                    pensumSubject.course ||
                    pensumSubject.subject ||
                    ""
                ).toLowerCase()
                if (gradeName === pensumName) return true

                if (gradeCode && pensumName.includes(gradeCode.toLowerCase())) return true

                return false
            })

            return {
                subject: pensumSubject.course || pensumSubject.subject,
                code: pensumSubject.code || pensumSubject.codeSubject,
                credits: pensumSubject.credits,
                rubrics: foundGrade ? foundGrade.rubrics : {},
                letter: foundGrade ? foundGrade.calculatedLetter || foundGrade.letter : null,
                hasGrade: !!foundGrade,
                nfa: foundGrade ? foundGrade.nfa : 0,
            }
        })

        setDisplayedGrades(mergedData)

        let totalQualityPoints = 0
        let totalAttemptedCredits = 0

        mergedData.forEach((subject) => {
            if (
                subject.hasGrade &&
                subject.letter &&
                subject.letter !== "EC" &&
                subject.letter !== "CV" &&
                subject.letter !== "R"
            ) {
                let points = 0
                switch (subject.letter) {
                    case "A":
                        points = 4
                        break
                    case "B":
                        points = 3
                        break
                    case "C":
                        points = 2
                        break
                    case "D":
                        points = 1
                        break
                    case "F":
                        points = 0
                        break
                    default:
                        points = 0
                }
                totalQualityPoints += points * subject.credits
                totalAttemptedCredits += subject.credits
            }
        })

        let calculatedGPA = 0
        if (totalAttemptedCredits > 0) {
            const rawGPA = totalQualityPoints / totalAttemptedCredits
            calculatedGPA = Math.round(rawGPA * 100) / 100
        }

        const periodTotalCredits = mergedData.reduce((sum, item) => sum + (item.credits || 0), 0)
        const hasGrades = mergedData.some((g) => g.hasGrade)
        const hasEC = mergedData.some((g) => g.letter === "EC")

        let status = "No Cursado"
        if (hasGrades) {
            if (hasEC) {
                status = "Cursando"
            } else {
                status = "Finalizado"
            }
        }

        setPeriodInfo({
            credits: periodTotalCredits,
            average: calculatedGPA.toFixed(2),
            status,
            period: selectedPeriod,
        })
    }, [selectedPeriod, pensumData, currentGrades])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        const academicPeriod = localStorage.getItem("auth_current_period") || "3"
        const gradesRes = await getSemesterGrades(academicPeriod)
        const {processedData, dynamicHeaders} = processGrades(gradesRes?.data || [])
        setCurrentGrades(processedData)
        setHeaders(dynamicHeaders)
        setIsRefreshing(false)
    }

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = "/login"
    }

    return (
        <div className='h-screen bg-zinc-900 text-white font-sans selection:bg-green-500/30 relative select-none overflow-hidden'>
            <FullScreenLoader isLoading={isFullScreenLoading} />

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                periodInfo={periodInfo}
                setActiveModal={setActiveModal}
            />

            <HomeModals
                activeModal={activeModal}
                setActiveModal={setActiveModal}
                user={user}
                shortName={shortName}
                pensumData={pensumData}
                allGrades={currentGrades}
                displayedGrades={displayedGrades}
                periodInfo={periodInfo}
                selectedPeriod={selectedPeriod}
                onLogout={handleLogout}
            />

            <div className='max-w-400 mx-auto h-full'>
                {/* MOBILE LAYOUT con espaciado correcto */}
                <div className='lg:hidden flex flex-col h-full p-3 pt-safe gap-3'>
                    <Header
                        user={user}
                        shortName={shortName}
                        selectedPeriod={selectedPeriod}
                        setSelectedPeriod={setSelectedPeriod}
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        isMobile={true}
                    />

                    {/* Contenedor con padding bottom para el summary card */}
                    <div className='flex-1 overflow-hidden pb-41.25'>
                        <GradesTable
                            isRefreshing={isRefreshing}
                            handleRefresh={handleRefresh}
                            displayedGrades={displayedGrades}
                            headers={headers}
                            selectedPeriod={selectedPeriod}
                            status={periodInfo.status}
                            isMobile={true}
                        />
                    </div>

                    {/* SUMMARY CARD FIJO EN LA PARTE INFERIOR */}
                    <div className='fixed bottom-0 left-0 right-0 p-3 pb-safe bg-zinc-900/95 backdrop-blur-md border-t border-zinc-700 z-40 lg:hidden'>
                        <div className='bg-linear-to-br from-green-600 to-emerald-900 rounded-lg p-4 shadow-lg border border-green-500 relative overflow-hidden'>
                            <div className='absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none' />
                            <div className='relative z-10'>
                                <div className='flex justify-between items-start mb-2'>
                                    <div>
                                        <p className='text-green-200 text-[10px] font-bold uppercase tracking-wider'>
                                            Periodo {selectedPeriod}
                                        </p>
                                        <div
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full border font-bold uppercase text-[9px] mt-1 ${
                                                periodInfo.status === "Cursando"
                                                    ? "bg-green-500 text-zinc-900 border-green-400"
                                                    : periodInfo.status === "Finalizado"
                                                    ? "bg-blue-500 text-white border-blue-400"
                                                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                                            }`}>
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                                    periodInfo.status === "Cursando"
                                                        ? "bg-zinc-900 animate-pulse"
                                                        : periodInfo.status === "Finalizado"
                                                        ? "bg-white"
                                                        : "bg-zinc-600"
                                                }`}
                                            />
                                            {periodInfo.status}
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <span className='block text-[9px] text-green-300 uppercase font-bold tracking-wider'>
                                            Promedio
                                        </span>
                                        <span className='text-3xl font-black text-white font-mono'>
                                            {periodInfo.average}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center mt-2 pt-2 border-t border-green-400/20'>
                                    <span className='text-green-200 text-xs font-medium'>
                                        Total Créditos
                                    </span>
                                    <span className='text-2xl font-black text-white font-mono'>
                                        {periodInfo.credits}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESKTOP LAYOUT */}
                <div className='hidden lg:grid h-screen grid-cols-[300px_1fr] grid-rows-[80px_1fr] gap-4 p-4'>
                    <Header
                        user={user}
                        shortName={shortName}
                        selectedPeriod={selectedPeriod}
                        setSelectedPeriod={setSelectedPeriod}
                        isMobile={false}
                    />
                    <Sidebar
                        selectedPeriod={selectedPeriod}
                        periodInfo={periodInfo}
                        setActiveModal={setActiveModal}
                    />
                    <GradesTable
                        isRefreshing={isRefreshing}
                        handleRefresh={handleRefresh}
                        displayedGrades={displayedGrades}
                        headers={headers}
                        selectedPeriod={selectedPeriod}
                        status={periodInfo.status}
                        isMobile={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home
