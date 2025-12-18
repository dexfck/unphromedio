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
    // CORRECCIÓN 1: Iniciar siempre en Periodo 1 por defecto para ver el inicio de la carrera
    const [selectedPeriod, setSelectedPeriod] = useState(1)

    const [periodInfo, setPeriodInfo] = useState({credits: 0, average: "0.0", status: "Pendiente"})
    const [isFullScreenLoading, setIsFullScreenLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [activeModal, setActiveModal] = useState(null)

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

                // Cargar Datos Básicos y Pensum
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

    // 2. EFECTO AL CAMBIAR PERIODO (Cargar Notas)
    useEffect(() => {
        const fetchGrades = async () => {
            setIsRefreshing(true)
            try {
                // NOTA: Aquí hay un dilema. 'semester-grades' pide un AÑO y un ID de PERIODO ACADÉMICO (ej: 3 para Sept-Dic).
                // Si 'selectedPeriod' es el Nivel del Pensum (1, 2, 3...), no coincide con el periodo académico.
                // Para ver notas históricas (ej: Periodo 1 que cursaste el año pasado), necesitaríamos otro endpoint o lógica.

                // Por ahora, intentaremos cargar las notas generales disponibles.
                // Si la API semester-grades solo devuelve lo actual, solo veremos notas si coinciden.

                // Usamos el periodo académico actual guardado (ej: 3) para ver si hay notas recientes
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
    }, [selectedPeriod, isFullScreenLoading]) // Se ejecuta al cambiar periodo para refrescar vista

    // 3. FUSIÓN DE DATOS (Pensum + Notas + Cálculo de Índice y ESTADO)
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

        // --- CÁLCULO DEL PROMEDIO (GPA) ---
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
            calculatedGPA = Math.round(rawGPA * 10) / 10
        }

        const periodTotalCredits = mergedData.reduce((sum, item) => sum + (item.credits || 0), 0)

        // --- NUEVA LÓGICA DE ESTADO (Cursando vs Finalizado vs No Cursado) ---
        const hasGrades = mergedData.some((g) => g.hasGrade) // ¿Tiene alguna materia inscrita/con nota?
        const hasEC = mergedData.some((g) => g.letter === "EC") // ¿Hay alguna materia "En Curso"?

        let status = "No Cursado"

        if (hasGrades) {
            if (hasEC) {
                status = "Cursando" // Si tiene notas y al menos una es EC -> Cursando
            } else {
                status = "Finalizado" // Si tiene notas y NINGUNA es EC -> Finalizado
            }
        }

        setPeriodInfo({
            credits: periodTotalCredits,
            average: calculatedGPA.toFixed(1),
            status,
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
        <div className='h-screen bg-zinc-900 text-white p-4 font-sans selection:bg-green-500/30 relative select-none overflow-hidden'>
            <FullScreenLoader isLoading={isFullScreenLoading} />

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

            <div className='max-w-[1600px] mx-auto h-full grid grid-cols-[300px_1fr] grid-rows-[80px_1fr] gap-4'>
                <Header
                    user={user}
                    shortName={shortName}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                />
                <Sidebar
                    selectedPeriod={selectedPeriod}
                    periodInfo={periodInfo}
                    setActiveModal={setActiveModal}
                />
                <GradesTable
                    isRefreshing={isRefreshing}
                    handleRefresh={handleRefresh}
                    displayedGrades={displayedGrades} // Aquí pasamos los datos fusionados
                    headers={headers}
                    selectedPeriod={selectedPeriod}
                    status={periodInfo.status} // Pasamos el estado para decidir qué mostrar
                />
            </div>
        </div>
    )
}

export default Home
