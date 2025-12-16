import React, {useState, useEffect, useCallback} from "react"
import {Modal} from "../ui/Modal"
import {Icons} from "../ui/Icons"
import {PeriodDropdown} from "./PeriodDropdown"

// Definimos todos los encabezados posibles para la calculadora (MAYÚSCULAS)
const ALL_HEADERS = ["RU", "TP", "PP1", "PP2", "EF", "Modulo1", "Modulo2", "Modulo3", "Modulo4"]

export const HomeModals = ({
    activeModal,
    setActiveModal,
    user,
    shortName,
    pensumData,
    displayedGrades,
    periodInfo,
    selectedPeriod,
    onLogout,
}) => {
    // --- ESTADO PARA LA PROYECCIÓN DE ÍNDICE ---
    const [simulatedPeriod, setSimulatedPeriod] = useState(selectedPeriod)
    const [simulatedSubjects, setSimulatedSubjects] = useState([])
    const [projectedIndex, setProjectedIndex] = useState(0)

    // Función de cálculo
    const calculateProjection = useCallback((subjects) => {
        let totalPoints = 0
        let totalCredits = 0

        const calculated = subjects.map((sub) => {
            const r = sub.rubrics
            const getVal = (k) =>
                r[k] && r[k] !== "" && !isNaN(parseFloat(r[k])) ? parseFloat(r[k]) : null
            const hasVal = (k) => getVal(k) !== null

            // 1. Lógica Promedio Parciales
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

            // 2. Lógica Suma Resto
            let otherSum = 0,
                otherCount = 0
            Object.keys(r).forEach((key) => {
                if (!["PP1", "PP2"].includes(key) && hasVal(key)) {
                    otherSum += getVal(key)
                    otherCount++
                }
            })

            // 3. Cálculo NFA
            let num = otherSum
            let den = otherCount
            if (promParciales !== null) {
                num += promParciales
                den++
            }
            const nfa = den > 0 ? num / den : 0

            // 4. Literal y Puntos
            let points = 0
            if (nfa > 0) {
                const score = Math.round(nfa)
                if (score >= 90) points = 4
                else if (score >= 80) points = 3
                else if (score >= 70) points = 2
                else if (score >= 60) points = 1
                else points = 0
            }

            if (nfa > 0) {
                totalPoints += points * sub.credits
                totalCredits += sub.credits
            }

            return {...sub, nfa}
        })

        const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 10) / 10 : 0
        setProjectedIndex(gpa)
    }, [])

    // Inicializar simulación
    useEffect(() => {
        if (activeModal === "projection" && pensumData) {
            const rawSubjects = pensumData[simulatedPeriod] || []

            const subjects = rawSubjects.map((sub) => {
                let existing = null
                if (simulatedPeriod === selectedPeriod) {
                    existing = displayedGrades.find((g) => g.code === (sub.code || sub.codeSubject))
                }

                // Inicializar rubros vacíos
                const initialRubrics = ALL_HEADERS.reduce((acc, header) => {
                    acc[header] = ""
                    return acc
                }, {})

                // Fusionar con existentes (Ahora keys coinciden PP1 -> PP1)
                if (existing && existing.rubrics) {
                    Object.keys(existing.rubrics).forEach((k) => {
                        // Solo copiamos si existe en ALL_HEADERS para evitar basura
                        if (ALL_HEADERS.includes(k)) {
                            initialRubrics[k] = existing.rubrics[k]
                        }
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
        newSubjects[index] = {...newSubjects[index], rubrics: {...newSubjects[index].rubrics}}
        newSubjects[index].rubrics[rubric] = value
        setSimulatedSubjects(newSubjects)
        calculateProjection(newSubjects)
    }

    return (
        <>
            {/* Modal Perfil (Se mantiene igual) */}
            <Modal
                isOpen={activeModal === "student"}
                onClose={() => setActiveModal(null)}
                title='Perfil del Estudiante'>
                <div className='flex flex-col md:flex-row gap-8 items-start'>
                    <div className='w-full md:w-1/3 flex flex-col items-center'>
                        <div className='w-32 h-32 rounded-2xl overflow-hidden border-2 border-green-500 mb-4 shadow-lg shadow-green-500/20 bg-zinc-800 relative'>
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

            {/* Modal Pensum (Igual) */}
            <Modal
                isOpen={activeModal === "pensum"}
                onClose={() => setActiveModal(null)}
                title='Plan de Estudio Completo'
                className='max-w-6xl'>
                <div className='space-y-4' style={{contentVisibility: "auto"}}>
                    {pensumData &&
                        Object.keys(pensumData)
                            .sort((a, b) => Number(a) - Number(b))
                            .map((period) => (
                                <div
                                    key={period}
                                    className='bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden'>
                                    <div className='bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center'>
                                        <h4 className='font-bold text-zinc-300 text-sm'>
                                            Periodo {period}
                                        </h4>
                                        <span className='text-[10px] text-zinc-500 font-mono'>
                                            {pensumData[period].length} materias
                                        </span>
                                    </div>
                                    <div className='p-2 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                                        {pensumData[period].map((sub, idx) => (
                                            <div
                                                key={`${period}-${idx}`}
                                                className='flex flex-col p-2 bg-zinc-900 rounded border border-zinc-800 hover:border-zinc-700'>
                                                <div className='flex justify-between items-center mb-1'>
                                                    <span className='text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1 rounded border border-zinc-800'>
                                                        {sub.code || sub.codeSubject}
                                                    </span>
                                                    <span className='text-[9px] font-bold text-zinc-400'>
                                                        {sub.credits} Cr
                                                    </span>
                                                </div>
                                                <p
                                                    className='text-xs text-zinc-400 line-clamp-2'
                                                    title={sub.course || sub.subject}>
                                                    {sub.course || sub.subject}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                </div>
            </Modal>

            {/* Modal Detalles (Igual) */}
            <Modal
                isOpen={activeModal === "details"}
                onClose={() => setActiveModal(null)}
                title={`Detalles del Periodo ${selectedPeriod}`}>
                <div className='grid grid-cols-3 gap-2 mb-4'>
                    <div className='bg-zinc-800 p-3 rounded-lg text-center border border-zinc-700'>
                        <p className='text-[10px] text-zinc-500 uppercase font-bold'>Estado</p>
                        <p
                            className={`text-lg font-bold ${
                                periodInfo.status.includes("Cursando")
                                    ? "text-green-400"
                                    : "text-zinc-400"
                            }`}>
                            {periodInfo.status.split(" ")[0]}
                        </p>
                    </div>
                    <div className='bg-zinc-800 p-3 rounded-lg text-center border border-zinc-700'>
                        <p className='text-[10px] text-zinc-500 uppercase font-bold'>Materias</p>
                        <p className='text-lg font-bold text-white'>{displayedGrades.length}</p>
                    </div>
                    <div className='bg-zinc-800 p-3 rounded-lg text-center border border-zinc-700'>
                        <p className='text-[10px] text-zinc-500 uppercase font-bold'>Créditos</p>
                        <p className='text-lg font-bold text-white'>{periodInfo.credits}</p>
                    </div>
                </div>
                <div className='space-y-2'>
                    {displayedGrades.map((g, i) => {
                        let statusText = "PENDIENTE"
                        let statusColor = "text-zinc-500 bg-zinc-800"
                        if (g.hasGrade) {
                            if (g.letter && ["A", "B", "C", "D"].includes(g.letter)) {
                                statusText = "APROBADA"
                                statusColor =
                                    "text-green-400 bg-green-900/20 border border-green-900/50"
                            } else if (g.letter === "EC") {
                                statusText = "EN CURSO"
                                statusColor =
                                    "text-blue-400 bg-blue-900/20 border border-blue-900/50"
                            } else {
                                statusText = "REPROBADA"
                                statusColor = "text-red-400 bg-red-900/20 border border-red-900/50"
                            }
                        }
                        return (
                            <div
                                key={i}
                                className='flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg border border-zinc-800 hover:bg-zinc-800/50 transition-colors'>
                                <div className='flex flex-col'>
                                    <span className='text-xs font-mono text-zinc-500 mb-0.5'>
                                        {g.code}
                                    </span>
                                    <span className='text-sm text-zinc-200 font-medium'>
                                        {g.subject}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {g.letter && (
                                        <span className='font-mono font-bold text-white text-sm'>
                                            {g.letter}
                                        </span>
                                    )}
                                    <span
                                        className={`text-[10px] font-bold px-2 py-1 rounded ${statusColor}`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Modal>

            {/* 4. Modal Proyección (CORREGIDO LAYOUT Y BUTTON TEXT) */}
            <Modal
                isOpen={activeModal === "projection"}
                onClose={() => setActiveModal(null)}
                title='Calculadora de Índice'
                className='max-w-[95vw] lg:max-w-7xl'>
                <div className='flex flex-col h-full'>
                    {/* Header: Dropdown y Resultado */}
                    <div className='flex flex-wrap gap-6 justify-between items-end mb-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 z-50 relative'>
                        {/* Periodo a Proyectar encima del Dropdown */}
                        <div className='flex flex-col gap-2'>
                            <span className='text-[10px] text-zinc-400 font-bold uppercase tracking-widest'>
                                Periodo a Proyectar
                            </span>
                            <div className='w-48'>
                                <PeriodDropdown
                                    selected={simulatedPeriod}
                                    options={Array.from({length: 12}, (_, i) => i + 1)}
                                    onChange={setSimulatedPeriod}
                                />
                            </div>
                        </div>

                        {/* Resultado Índice */}
                        <div className='text-right'>
                            <p className='text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1'>
                                Índice Proyectado
                            </p>
                            <p
                                className={`text-6xl font-black font-mono leading-none ${
                                    projectedIndex >= 3
                                        ? "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                        : projectedIndex >= 2
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                }`}>
                                {projectedIndex.toFixed(1)}
                            </p>
                        </div>
                    </div>

                    {/* Tabla de Inputs */}
                    <div className='flex-1 overflow-auto border border-zinc-800 rounded-2xl bg-zinc-950/50 shadow-inner relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
                        <table className='w-full text-left border-collapse relative z-10'>
                            <thead className='bg-zinc-900/95 backdrop-blur text-[10px] text-zinc-500 uppercase font-sans sticky top-0 z-20 shadow-sm'>
                                <tr>
                                    <th className='p-4 w-64 font-bold tracking-wider border-b border-zinc-800'>
                                        Asignatura
                                    </th>
                                    <th className='p-4 text-center w-12 font-bold tracking-wider border-b border-zinc-800'>
                                        CR
                                    </th>
                                    {ALL_HEADERS.map((header) => (
                                        <th
                                            key={header}
                                            className='p-4 text-center text-zinc-400 font-bold tracking-wider border-b border-zinc-800 min-w-[60px]'>
                                            {header}
                                        </th>
                                    ))}
                                    <th className='p-4 text-center text-green-500 font-bold tracking-wider border-b border-zinc-800'>
                                        NFA
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='text-sm divide-y divide-zinc-800/50'>
                                {simulatedSubjects.map((sub, idx) => (
                                    <tr
                                        key={idx}
                                        className='hover:bg-zinc-900/40 transition-colors'>
                                        <td
                                            className='p-4 text-xs font-medium text-zinc-300 truncate max-w-[200px]'
                                            title={sub.course || sub.subject}>
                                            {sub.course || sub.subject}
                                        </td>
                                        <td className='p-4 text-center text-zinc-500 font-mono text-xs font-bold'>
                                            {sub.credits}
                                        </td>

                                        {/* Inputs Limpios */}
                                        {ALL_HEADERS.map((field) => (
                                            <td key={field} className='p-2 text-center'>
                                                <input
                                                    type='number'
                                                    inputMode='numeric'
                                                    className='w-full bg-transparent border border-zinc-800 rounded text-center text-white font-mono text-sm py-2 focus:outline-none focus:border-green-500 focus:bg-green-900/10 focus:ring-0 transition-all placeholder:text-zinc-800 hover:border-zinc-700'
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

                                        <td className='p-4 text-center font-black text-white font-mono text-sm'>
                                            {sub.nfa > 0 ? (
                                                <span
                                                    className={
                                                        sub.nfa >= 90
                                                            ? "text-green-400"
                                                            : sub.nfa >= 80
                                                            ? "text-blue-400"
                                                            : sub.nfa >= 70
                                                            ? "text-yellow-400"
                                                            : "text-red-400"
                                                    }>
                                                    {sub.nfa.toFixed(0)}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón RECALCULAR */}
                    <div className='mt-6 flex justify-end'>
                        <button
                            className='bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-900/20 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer'
                            onClick={() => calculateProjection(simulatedSubjects)}>
                            <Icons.Calculator className='w-4 h-4' />
                            RECALCULAR
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modals Settings y Logout (Iguales) */}
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
                <div className='text-center p-8'>
                    <div className='w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <Icons.Logout className='w-8 h-8 text-red-500' />
                    </div>
                    <h4 className='text-xl font-bold text-white mb-2'>¿Estás seguro?</h4>
                    <p className='text-zinc-400 mb-8 max-w-sm mx-auto'>
                        Se borrarán los datos almacenados en este dispositivo.
                    </p>
                    <div className='flex gap-4 justify-center'>
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
