import {useState, useEffect, useCallback, useMemo} from "react"
import {Modal} from "../ui/Modal"
import {PeriodDropdown} from "./PeriodDropdown"
import StudentInfo from "../submodal/StudentInfo.jsx"
import Pensum from "../submodal/Pensum.jsx"
import Details from "../submodal/Details.jsx"
import Calc from "../submodal/Calc.jsx"
import MoreInfo from "../submodal/MoreInfo.jsx"
import Logout from "../submodal/Logout.jsx"

const ALL_HEADERS = ["RU", "TP", "PP1", "PP2", "EF", "Modulo1", "Modulo2", "Modulo3", "Modulo4"]

export const HomeModals = ({activeModal, setActiveModal, user, shortName, pensumData, displayedGrades, allGrades, periodInfo, selectedPeriod, onLogout}) => {
    const [simulatedPeriod, setSimulatedPeriod] = useState(selectedPeriod)
    const [simulatedSubjects, setSimulatedSubjects] = useState([])
    const [projectedIndex, setProjectedIndex] = useState(0)

    const normalize = useCallback((str) => {
        if (!str) return ""
        return str
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "")
    }, [])

    const checkSubjectStatus = useCallback(
        (pensumSubject) => {
            if (!allGrades) return null
            return allGrades.find((grade) => {
                const gCode = normalize(grade.fullGroupCode?.split("-").slice(0, 2).join("-"))
                const pCode = normalize(pensumSubject.code || pensumSubject.codeSubject)
                const gName = normalize(grade.course || grade.subject)
                const pName = normalize(pensumSubject.course || pensumSubject.subject)
                return (gCode && pCode && gCode === pCode) || gName === pName
            })
        },
        [allGrades, normalize]
    )

    const pensumStats = useMemo(() => {
        if (!pensumData || !allGrades) return {total: 0, finished: 0, pending: 0}
        let total = 0
        let finished = 0
        const passingGrades = ["A", "B", "C", "D", "CV", "E"]
        Object.values(pensumData).forEach((periodSubjects) => {
            periodSubjects.forEach((sub) => {
                total++
                const foundGrade = checkSubjectStatus(sub)
                if (foundGrade && foundGrade.letter !== "EC" && passingGrades.includes(foundGrade.letter)) {
                    finished++
                }
            })
        })
        return {total, finished, pending: total - finished}
    }, [pensumData, allGrades, checkSubjectStatus])

    const calculateProjection = useCallback((subjects) => {
        let totalPoints = 0
        let totalCredits = 0
        subjects.forEach((sub) => {
            const r = sub.rubrics
            const getVal = (k) => (r[k] && r[k] !== "" && !isNaN(parseFloat(r[k])) ? parseFloat(r[k]) : null)
            const hasVal = (k) => getVal(k) !== null
            let ppSum = 0,
                ppCount = 0
            if (hasVal("PP1")) {
                ppSum += getVal("PP1")
                ppCount++
            }
            if (hasVal("PP2")) {
                ppSum += getVal("PP2")
                ppCount++
            }
            const promParciales = ppCount > 0 ? ppSum / ppCount : null
            let otherSum = 0,
                otherCount = 0
            Object.keys(r).forEach((key) => {
                if (!["PP1", "PP2"].includes(key) && hasVal(key)) {
                    otherSum += getVal(key)
                    otherCount++
                }
            })
            let num = otherSum,
                den = otherCount
            if (promParciales !== null) {
                num += promParciales
                den++
            }
            const nfa = den > 0 ? num / den : 0
            sub.nfa = nfa
            let points = 0
            if (nfa > 0) {
                const score = Math.round(nfa)
                if (score >= 90) points = 4
                else if (score >= 80) points = 3
                else if (score >= 70) points = 2
                else if (score >= 60) points = 1
                else points = 0
                totalPoints += points * sub.credits
                totalCredits += sub.credits
            }
        })
        const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 10) / 10 : 0
        setProjectedIndex(gpa)
    }, [])

    useEffect(() => {
        if (activeModal === "projection" && pensumData) {
            const rawSubjects = pensumData[simulatedPeriod] || []
            const subjects = rawSubjects.map((sub) => {
                let existing = null
                if (simulatedPeriod === selectedPeriod) {
                    existing = displayedGrades.find((g) => g.code === (sub.code || sub.codeSubject))
                }
                const initialRubrics = ALL_HEADERS.reduce((acc, header) => {
                    acc[header] = ""
                    return acc
                }, {})
                if (existing && existing.rubrics) {
                    Object.keys(existing.rubrics).forEach((k) => {
                        if (ALL_HEADERS.includes(k)) initialRubrics[k] = existing.rubrics[k]
                    })
                }
                return {
                    ...sub,
                    rubrics: initialRubrics,
                    credits: sub.credits,
                    nfa: existing ? existing.nfa : 0,
                }
            })
            setSimulatedSubjects(subjects)
            calculateProjection(subjects)
        }
    }, [activeModal, simulatedPeriod, pensumData, selectedPeriod, displayedGrades, calculateProjection])

    const handleInputChange = (index, rubric, value) => {
        if (value !== "" && (isNaN(value) || value < 0 || value > 100)) return
        const newSubjects = [...simulatedSubjects]
        newSubjects[index].rubrics[rubric] = value
        setSimulatedSubjects(newSubjects)
        calculateProjection(newSubjects)
    }

    const getLiteralStyle = (letter) => {
        if (["A"].includes(letter)) return "text-green-400 bg-green-900/20 border-green-500/50"
        if (["B"].includes(letter)) return "text-blue-400 bg-blue-900/20 border-blue-500/50"
        if (["C"].includes(letter)) return "text-yellow-400 bg-yellow-900/20 border-yellow-500/50"
        if (["D", "F", "R"].includes(letter)) return "text-red-400 bg-red-900/20 border-red-500/50"
        return "text-zinc-400 bg-zinc-800/50 border-zinc-700"
    }

    return (
        <>
            {/* Modal Estudiante */}
            <Modal isOpen={activeModal === "student"} onClose={() => setActiveModal(null)} title='Perfil del Estudiante'>
                <StudentInfo user={user} shortName={shortName} />
            </Modal>

            {/* Modal Pensum Completo */}
            <Modal isOpen={activeModal === "pensum"} onClose={() => setActiveModal(null)} title='Plan de Estudio Completo' className='max-w-7xl'>
                <Pensum pensumStats={pensumStats} checkSubjectStatus={checkSubjectStatus} pensumData={pensumData} />
            </Modal>

            {/* Modal Detalles */}
            <Modal isOpen={activeModal === "details"} onClose={() => setActiveModal(null)} title={`Detalles del Periodo ${selectedPeriod}`}>
                <Details periodInfo={periodInfo} getLiteralStyle={getLiteralStyle} displayedGrades={displayedGrades} />
            </Modal>

            {/* Calculadora */}
            <Modal isOpen={activeModal === "projection"} onClose={() => setActiveModal(null)} title='Calculadora de Índice' className='max-w-[95vw] lg:max-w-7xl'>
                <Calc PeriodDropdown={PeriodDropdown} simulatedSubjects={simulatedSubjects} simulatedPeriod={simulatedPeriod} setSimulatedPeriod={setSimulatedPeriod} projectedIndex={projectedIndex} ALL_HEADERS={ALL_HEADERS} />
            </Modal>

            {/* Modal MÁS INFORMACIÓN */}
            <Modal isOpen={activeModal === "info"} onClose={() => setActiveModal(null)} title='Más Información' className='max-w-2xl'>
                <MoreInfo />
            </Modal>

            {/*Logout */}

            <Modal isOpen={activeModal === "logout"} onClose={() => setActiveModal(null)} title='Confirmar Cierre de Sesión'>
                <Logout setActiveModal={setActiveModal} onLogout={onLogout} />
            </Modal>
        </>
    )
}
