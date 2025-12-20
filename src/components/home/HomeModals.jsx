import React, {useState, useEffect, useCallback, useMemo} from "react"
import {Modal} from "../ui/Modal"
import {Icons} from "../ui/Icons"
import {PeriodDropdown} from "./PeriodDropdown"
import {Github, Target, Eye, Lightbulb} from "lucide-react"

const ALL_HEADERS = ["RU", "TP", "PP1", "PP2", "EF", "Modulo1", "Modulo2", "Modulo3", "Modulo4"]

export const HomeModals = ({
    activeModal,
    setActiveModal,
    user,
    shortName,
    pensumData,
    displayedGrades,
    allGrades,
    periodInfo,
    selectedPeriod,
    onLogout,
}) => {
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
                if (
                    foundGrade &&
                    foundGrade.letter !== "EC" &&
                    passingGrades.includes(foundGrade.letter)
                ) {
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
            const getVal = (k) =>
                r[k] && r[k] !== "" && !isNaN(parseFloat(r[k])) ? parseFloat(r[k]) : null
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
    }, [
        activeModal,
        simulatedPeriod,
        pensumData,
        selectedPeriod,
        displayedGrades,
        calculateProjection,
    ])

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
            <Modal
                isOpen={activeModal === "student"}
                onClose={() => setActiveModal(null)}
                title='Perfil del Estudiante'>
                <div className='flex flex-col md:flex-row gap-4 md:gap-8 items-start'>
                    <div className='w-full md:w-1/3 flex flex-col items-center'>
                        <div className='w-32 h-32 rounded-2xl overflow-hidden border-2 border-green-500 mb-4 shadow-lg shadow-green-500/20 bg-zinc-800'>
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt='Profile'
                                    className='w-full h-full object-cover'
                                    referrerPolicy='no-referrer'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center text-4xl text-white font-bold'>
                                    {shortName.firstLetter}
                                </div>
                            )}
                        </div>
                        <span className='px-3 py-1 bg-green-900/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold font-mono'>
                            ACTIVO
                        </span>
                    </div>
                    <div className='w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4'>
                        <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                            <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>
                                Nombre Completo
                            </p>
                            <p className='text-base font-medium text-white'>
                                {user?.data?.first_name || user?.data?.names}
                            </p>
                        </div>
                        <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                            <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>
                                Matrícula
                            </p>
                            <p className='text-base font-medium font-mono text-green-400'>
                                {user?.data?.username}
                            </p>
                        </div>
                        <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                            <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>
                                Correo Institucional
                            </p>
                            <p
                                className='text-sm font-medium text-zinc-300 truncate'
                                title={user?.data?.email}>
                                {user?.data?.email}
                            </p>
                        </div>
                        <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                            <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>
                                Periodo Actual
                            </p>
                            <p className='text-base font-medium text-white'>
                                {localStorage.getItem("auth_current_year")} -{" "}
                                {localStorage.getItem("auth_current_period")}
                            </p>
                        </div>
                        <div className='col-span-1 md:col-span-2 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                            <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>
                                Carrera
                            </p>
                            <p className='text-sm font-medium text-white'>
                                {user?.data?.career_name}
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Pensum Completo */}
            <Modal
                isOpen={activeModal === "pensum"}
                onClose={() => setActiveModal(null)}
                title='Plan de Estudio Completo'
                className='max-w-7xl'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8'>
                    <div className='bg-zinc-900/80 p-5 rounded-2xl text-center border border-zinc-800 shadow-md relative overflow-hidden'>
                        <p className='text-[10px] sm:text-xs text-zinc-500 uppercase font-black tracking-wider relative z-10 mb-1'>
                            Materias Totales
                        </p>
                        <p className='text-3xl font-black text-white relative z-10'>
                            {pensumStats.total}
                        </p>
                    </div>
                    <div className='bg-zinc-900/80 p-5 rounded-2xl text-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50'></div>
                        <p className='text-[10px] sm:text-xs text-green-400 uppercase font-black tracking-wider relative z-10 mb-1'>
                            Materias Cursadas
                        </p>
                        <p className='text-3xl font-black text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] relative z-10'>
                            {pensumStats.finished}
                        </p>
                    </div>
                    <div className='bg-zinc-900/80 p-5 rounded-2xl text-center border border-zinc-800 shadow-md relative overflow-hidden'>
                        <p className='text-[10px] sm:text-xs text-zinc-500 uppercase font-black tracking-wider relative z-10 mb-1'>
                            Materias Pendientes
                        </p>
                        <p className='text-3xl font-black text-zinc-300 relative z-10'>
                            {pensumStats.pending}
                        </p>
                    </div>
                </div>

                <div className='space-y-8' style={{contentVisibility: "auto"}}>
                    {pensumData &&
                        Object.keys(pensumData)
                            .sort((a, b) => Number(a) - Number(b))
                            .map((period) => (
                                <div key={period} className='relative'>
                                    <div className='flex items-center gap-4 mb-5'>
                                        <div className='bg-green-950/30 border border-green-500/30 px-5 py-2 rounded-xl shadow-[0_0_10px_rgba(34,197,94,0.1)]'>
                                            <h4 className='font-black text-green-400 text-base tracking-wider uppercase'>
                                                Periodo {period}
                                            </h4>
                                        </div>
                                        <div className='h-[2px] flex-1 bg-gradient-to-r from-green-500/30 via-zinc-800 to-transparent rounded-full'></div>
                                    </div>

                                    <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
                                        {pensumData[period].map((sub, idx) => {
                                            const grade = checkSubjectStatus(sub)
                                            let signalClass = "bg-zinc-700"
                                            let statusTooltip = "Pendiente"

                                            if (grade) {
                                                if (grade.letter === "EC") {
                                                    signalClass =
                                                        "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"
                                                    statusTooltip = "En Curso"
                                                } else if (
                                                    ["A", "B", "C", "D", "CV", "E"].includes(
                                                        grade.letter
                                                    )
                                                ) {
                                                    signalClass =
                                                        "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                                                    statusTooltip = `Aprobada (${grade.letter})`
                                                } else {
                                                    signalClass =
                                                        "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                                                    statusTooltip = `Reprobada (${grade.letter})`
                                                }
                                            }

                                            return (
                                                <div
                                                    key={`${period}-${idx}`}
                                                    className='relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 overflow-hidden'
                                                    title={statusTooltip}>
                                                    <div
                                                        className={`absolute top-4 right-4 w-3 h-3 rounded-full ${signalClass}`}></div>

                                                    <div className='flex flex-col items-start mb-4 pr-6'>
                                                        <span className='text-sm font-mono font-bold text-zinc-300 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800 mb-3'>
                                                            {sub.code || sub.codeSubject}
                                                        </span>
                                                        <p
                                                            className='text-base font-bold text-white leading-tight line-clamp-2'
                                                            title={sub.course || sub.subject}>
                                                            {sub.course || sub.subject}
                                                        </p>
                                                    </div>

                                                    <div className='flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-lg border border-zinc-800/50 w-fit'>
                                                        <Icons.Book className='w-4 h-4 text-zinc-500' />
                                                        <span className='text-sm font-black text-zinc-300'>
                                                            {sub.credits}
                                                        </span>
                                                        <span className='text-[10px] text-zinc-500 font-bold uppercase tracking-wider'>
                                                            Créditos
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                </div>
            </Modal>

            {/* Modal Detalles */}
            <Modal
                isOpen={activeModal === "details"}
                onClose={() => setActiveModal(null)}
                title={`Detalles del Periodo ${selectedPeriod}`}>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 md:mb-6'>
                    <div className='bg-zinc-900/80 p-4 rounded-2xl text-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50'></div>
                        <p className='text-[9px] sm:text-[10px] text-green-400 uppercase font-bold tracking-wider relative z-10'>
                            Estado
                        </p>
                        <p
                            className={`text-lg sm:text-xl font-black relative z-10 ${
                                periodInfo.status.includes("Cursando")
                                    ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                                    : "text-zinc-400"
                            }`}>
                            {periodInfo.status.split(" ")[0]}
                        </p>
                    </div>
                    <div className='bg-zinc-900/80 p-4 rounded-2xl text-center border border-zinc-800 shadow-md relative overflow-hidden'>
                        <p className='text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold tracking-wider relative z-10'>
                            Materias
                        </p>
                        <p className='text-lg sm:text-xl font-black text-white relative z-10'>
                            {displayedGrades.length}
                        </p>
                    </div>
                    <div className='bg-zinc-900/80 p-4 rounded-2xl text-center border border-zinc-800 shadow-md relative overflow-hidden'>
                        <p className='text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold tracking-wider relative z-10'>
                            Créditos
                        </p>
                        <p className='text-lg sm:text-xl font-black text-white relative z-10'>
                            {periodInfo.credits}
                        </p>
                    </div>
                </div>

                <div className='space-y-3'>
                    {displayedGrades.map((g, i) => {
                        let statusText = "PENDIENTE",
                            statusStyle = "text-zinc-500 bg-zinc-950/50 border-zinc-800"
                        if (g.hasGrade) {
                            if (g.letter === "EC") {
                                statusText = "EN CURSO"
                                statusStyle =
                                    "text-blue-400 bg-blue-950/50 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                            } else if (["A", "B", "C", "D"].includes(g.letter)) {
                                statusText = "APROBADA"
                                statusStyle =
                                    "text-green-400 bg-green-950/50 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                            } else {
                                statusText = "REPROBADA"
                                statusStyle =
                                    "text-red-400 bg-red-950/50 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                            }
                        }
                        return (
                            <div
                                key={i}
                                className='flex justify-between items-center p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-green-500/30 hover:bg-zinc-900/80 transition-all group'>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded w-fit border border-zinc-800 group-hover:border-zinc-700 transition-colors'>
                                        {g.code}
                                    </span>
                                    <span className='text-sm text-zinc-200 font-bold group-hover:text-white transition-colors line-clamp-1'>
                                        {g.subject}
                                    </span>
                                </div>
                                <div className='flex items-center gap-3 shrink-0'>
                                    {g.letter && (
                                        <span
                                            className={`font-mono font-black text-sm w-8 h-8 flex items-center justify-center rounded-lg border ${getLiteralStyle(
                                                g.letter
                                            )}`}>
                                            {g.letter}
                                        </span>
                                    )}
                                    <span
                                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider ${statusStyle}`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Modal>

            {/* Calculadora */}
            <Modal
                isOpen={activeModal === "projection"}
                onClose={() => setActiveModal(null)}
                title='Calculadora de Índice'
                className='max-w-[95vw] lg:max-w-7xl'>
                <div className='flex flex-col h-full'>
                    <div className='flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 justify-between items-end mb-6 md:mb-8 bg-zinc-950/80 p-4 md:p-6 rounded-3xl border border-zinc-800/80 shadow-xl relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 opacity-50 pointer-events-none rounded-3xl'></div>

                        <div className='flex flex-col gap-3 relative z-[200] w-full md:w-auto'>
                            <span className='text-xs text-zinc-400 font-black uppercase tracking-widest flex items-center gap-2'>
                                <Icons.Book className='w-4 h-4 text-green-500' /> Periodo a
                                Proyectar
                            </span>
                            <div className='w-full md:w-56 shadow-lg relative z-[200]'>
                                <PeriodDropdown
                                    selected={simulatedPeriod}
                                    options={Array.from({length: 12}, (_, i) => i + 1)}
                                    onChange={setSimulatedPeriod}
                                />
                            </div>
                        </div>

                        <div className='text-center md:text-right relative z-10 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800/50 shadow-inner w-full md:w-auto'>
                            <p className='text-xs text-zinc-500 font-black uppercase tracking-widest mb-1'>
                                Índice Proyectado
                            </p>
                            <p
                                className={`text-5xl md:text-7xl font-black font-mono leading-none transition-all duration-300 ${
                                    projectedIndex >= 3
                                        ? "text-green-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]"
                                        : projectedIndex >= 2
                                        ? "text-yellow-400 drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]"
                                        : "text-red-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]"
                                }`}>
                                {projectedIndex.toFixed(1)}
                            </p>
                        </div>
                    </div>

                    {/* VERSIÓN MÓVIL - CARDS */}
                    <div className='lg:hidden space-y-3 mb-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900'>
                        {simulatedSubjects.map((sub, idx) => (
                            <div
                                key={idx}
                                className='bg-zinc-900 border border-zinc-800 rounded-xl p-4'>
                                <div className='flex justify-between items-start mb-3'>
                                    <div className='flex-1 pr-2'>
                                        <h4 className='text-sm font-bold text-white mb-1 line-clamp-2'>
                                            {sub.course || sub.subject}
                                        </h4>
                                        <p className='text-xs text-zinc-500 font-mono'>
                                            {sub.credits} Créditos
                                        </p>
                                    </div>
                                    {sub.nfa > 0 && (
                                        <span
                                            className={`text-xl font-black font-mono px-3 py-1 rounded-lg shrink-0 ${
                                                sub.nfa >= 90
                                                    ? "text-green-400 bg-green-950 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                                                    : sub.nfa >= 80
                                                    ? "text-blue-400 bg-blue-950 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                                    : sub.nfa >= 70
                                                    ? "text-yellow-400 bg-yellow-950 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                                                    : "text-red-400 bg-red-950 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                            }`}>
                                            {sub.nfa.toFixed(0)}
                                        </span>
                                    )}
                                </div>
                                <div className='grid grid-cols-3 gap-2'>
                                    {ALL_HEADERS.map((field) => (
                                        <div key={field} className='flex flex-col'>
                                            <label className='text-[9px] text-green-400 uppercase mb-1 font-bold'>
                                                {field}
                                            </label>
                                            <input
                                                type='number'
                                                inputMode='numeric'
                                                className='w-full bg-zinc-800 border border-zinc-700 rounded-lg text-center text-white font-mono text-sm py-2 focus:outline-none focus:border-green-400 focus:bg-zinc-900 transition-all'
                                                placeholder='-'
                                                min='0'
                                                max='100'
                                                value={sub.rubrics[field]}
                                                onChange={(e) =>
                                                    handleInputChange(idx, field, e.target.value)
                                                }
                                                onFocus={(e) => e.target.select()}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* VERSIÓN DESKTOP - TABLA */}
                    <div className='hidden lg:block flex-1 overflow-auto border border-zinc-800 rounded-3xl bg-zinc-950 shadow-inner relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
                        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-teal-500/50 z-30'></div>
                        <table className='w-full text-left border-collapse relative z-10'>
                            <thead className='bg-zinc-900/95 backdrop-blur-md text-[10px] text-zinc-400 uppercase font-sans sticky top-0 z-20 shadow-md'>
                                <tr>
                                    <th className='p-5 w-64 font-black tracking-widest border-b border-zinc-800/80'>
                                        Asignatura
                                    </th>
                                    <th className='p-5 text-center w-16 font-black tracking-widest border-b border-zinc-800/80 text-zinc-500'>
                                        CR
                                    </th>
                                    {ALL_HEADERS.map((header) => (
                                        <th
                                            key={header}
                                            className='p-5 text-center text-green-500/70 font-black tracking-widest border-b border-zinc-800/80 min-w-[70px]'>
                                            {header}
                                        </th>
                                    ))}
                                    <th className='p-5 text-center text-white font-black tracking-widest border-b border-zinc-800/80'>
                                        NFA
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='text-sm divide-y divide-zinc-800/40'>
                                {simulatedSubjects.map((sub, idx) => (
                                    <tr
                                        key={idx}
                                        className='hover:bg-zinc-900/30 transition-colors group'>
                                        <td
                                            className='p-5 text-xs font-bold text-zinc-300 truncate max-w-[220px] group-hover:text-white transition-colors'
                                            title={sub.course || sub.subject}>
                                            {sub.course || sub.subject}
                                        </td>
                                        <td className='p-5 text-center text-zinc-600 font-mono text-xs font-bold group-hover:text-zinc-400'>
                                            {sub.credits}
                                        </td>
                                        {ALL_HEADERS.map((field) => (
                                            <td key={field} className='p-3 text-center'>
                                                <input
                                                    type='number'
                                                    inputMode='numeric'
                                                    className='w-full bg-zinc-900/50 border border-zinc-800 rounded-lg text-center text-white font-mono text-base py-3 focus:outline-none focus:border-green-400 focus:bg-zinc-900 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all placeholder:text-zinc-700 font-bold hover:border-zinc-700'
                                                    placeholder='-'
                                                    min='0'
                                                    max='100'
                                                    value={sub.rubrics[field]}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            field,
                                                            e.target.value
                                                        )
                                                    }
                                                    onFocus={(e) => e.target.select()}
                                                />
                                            </td>
                                        ))}
                                        <td className='p-5 text-center font-black text-white font-mono text-base'>
                                            {sub.nfa > 0 ? (
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-lg ${
                                                        sub.nfa >= 90
                                                            ? "text-green-400 bg-green-950 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                                                            : sub.nfa >= 80
                                                            ? "text-blue-400 bg-blue-950 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                                            : sub.nfa >= 70
                                                            ? "text-yellow-400 bg-yellow-950 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                                                            : "text-red-400 bg-red-950 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                                    }`}>
                                                    {sub.nfa.toFixed(0)}
                                                </span>
                                            ) : (
                                                <span className='text-zinc-700'>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-6 md:mt-8 flex justify-end'>
                        <button
                            className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3 md:py-4 px-8 md:px-10 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center gap-3 cursor-pointer border border-green-400/20 w-full md:w-auto justify-center'
                            onClick={() => calculateProjection(simulatedSubjects)}>
                            <Icons.Calculator className='w-5 h-5' />
                            RECALCULAR PROYECCIÓN
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal MÁS INFORMACIÓN */}
            <Modal
                isOpen={activeModal === "info"}
                onClose={() => setActiveModal(null)}
                title='Más Información'
                className='max-w-2xl'>
                <div className='p-2 md:p-4 space-y-6 md:space-y-8'>
                    <section className='space-y-3'>
                        <div className='flex items-center gap-2 text-green-400 font-semibold mb-2'>
                            <Lightbulb size={20} />
                            <h3 className='uppercase tracking-wider text-xs'>
                                Inspiración del Proyecto
                            </h3>
                        </div>
                        <p className='text-zinc-300 leading-relaxed text-sm md:text-base bg-zinc-800/30 p-4 md:p-5 rounded-2xl border border-zinc-700/50 shadow-inner'>
                            Nace de la necesidad de simplificar la vida académica, ofreciendo acceso
                            inmediato al estado actual de tu índice y la capacidad de visualizar
                            escenarios futuros mediante proyecciones inteligentes y accesibles.
                        </p>
                    </section>

                    <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
                        <section className='space-y-3 bg-zinc-800/20 p-4 md:p-5 rounded-2xl border border-zinc-800'>
                            <div className='flex items-center gap-2 text-blue-400 font-semibold mb-2'>
                                <Target size={20} />
                                <h3 className='uppercase tracking-wider text-xs'>Misión</h3>
                            </div>
                            <p className='text-zinc-400 text-sm leading-relaxed'>
                                Proveer claridad y control sobre la trayectoria estudiantil mediante
                                herramientas precisas de cálculo y proyección que transforman datos
                                complejos en información accionable para la toma de decisiones.
                            </p>
                        </section>

                        <section className='space-y-3 bg-zinc-800/20 p-4 md:p-5 rounded-2xl border border-zinc-800'>
                            <div className='flex items-center gap-2 text-purple-400 font-semibold mb-2'>
                                <Eye size={20} />
                                <h3 className='uppercase tracking-wider text-xs'>Visión</h3>
                            </div>
                            <p className='text-zinc-400 text-sm leading-relaxed'>
                                Ser el compañero digital esencial para todo estudiante, donde la
                                planificación académica deja de ser una incertidumbre para
                                convertirse en una estrategia definida y alcanzable.
                            </p>
                        </section>
                    </div>

                    <div className='pt-4 md:pt-6 border-t border-zinc-800 flex flex-col items-center gap-4'>
                        <span className='text-zinc-500 text-xs'>
                            Código fuente y contribuciones
                        </span>
                        <a
                            href='https://github.com/dexfck'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-3 px-6 py-3 bg-zinc-950 hover:bg-black text-white rounded-xl transition-all hover:scale-105 border border-zinc-800 hover:border-green-500/50 group shadow-lg'>
                            <Github
                                size={20}
                                className='group-hover:text-green-500 transition-colors'
                            />
                            <span className='font-medium font-mono'>github.com/dexfck</span>
                        </a>
                    </div>
                </div>
            </Modal>

            {/* Config & Logout */}
            <Modal
                isOpen={activeModal === "settings"}
                onClose={() => setActiveModal(null)}
                title='Configuración'>
                <div className='text-center p-10 text-zinc-500'>
                    <Icons.Settings className='w-16 h-16 mx-auto mb-4 text-green-500/20' />
                    <p className='text-lg font-medium text-white mb-2'>Configuración del Sistema</p>
                    <p className='text-sm'>
                        Opciones de accesibilidad, notificaciones y tema visual.
                    </p>
                    <span className='inline-block mt-4 px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700'>
                        Próximamente
                    </span>
                </div>
            </Modal>
            <Modal
                isOpen={activeModal === "logout"}
                onClose={() => setActiveModal(null)}
                title='Confirmar Cierre de Sesión'>
                <div className='text-center p-6 md:p-8'>
                    <div className='w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <Icons.Logout className='w-8 h-8 text-red-500' />
                    </div>
                    <h4 className='text-xl font-bold text-white mb-2'>¿Estás seguro?</h4>
                    <p className='text-zinc-400 mb-8 max-w-sm mx-auto'>
                        Se borrarán los datos almacenados en este dispositivo.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <button
                            onClick={() => setActiveModal(null)}
                            className='px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors border border-zinc-700 cursor-pointer'>
                            Cancelar
                        </button>
                        <button
                            onClick={onLogout}
                            className='px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105 cursor-pointer'>
                            Sí, Cerrar Sesión
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
