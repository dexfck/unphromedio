import React, {useState} from "react"
import {Icons} from "../ui/Icons"
import {ChevronDown} from "lucide-react"

export const GradesTable = ({
    isRefreshing,
    handleRefresh,
    displayedGrades,
    headers,
    selectedPeriod,
    status,
    isMobile,
}) => {
    const [expandedCard, setExpandedCard] = useState(null)

    const getLiteralStyle = (letter) => {
        const l = letter?.toUpperCase()
        if (l === "EC") return "bg-zinc-700/50 text-zinc-400 border border-zinc-600"
        if (["F", "FI", "R"].includes(l))
            return "bg-red-900/20 text-red-400 border border-red-500/30"
        if (l === "C") return "bg-yellow-900/20 text-yellow-400 border border-yellow-500/30"
        if (l === "B") return "bg-blue-900/20 text-blue-400 border border-blue-500/30"
        if (l === "A") return "bg-green-900/20 text-green-400 border border-green-500/30"
        return "text-zinc-600"
    }

    const hasActiveSubjects = displayedGrades.some((g) => g.hasGrade)

    // Función para filtrar headers con valores
    const getAvailableHeaders = (rubrics) => {
        if (!rubrics) return []
        return headers.filter((header) => {
            const val = rubrics[header]
            return val && val !== "" && val !== "NR" && val !== "-"
        })
    }

    // VERSIÓN MÓVIL CON CARDS
    if (isMobile) {
        return (
            <main className='bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden flex flex-col shadow-2xl relative z-0 h-full'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600'></div>

                {/* HEADER */}
                <div className='p-3 bg-zinc-800/90 backdrop-blur border-b border-zinc-700 flex justify-between items-center z-20 relative shrink-0'>
                    <h2 className='text-base font-bold text-gray-200 font-sans'>Calificaciones</h2>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-green-400 transition-all ${
                            isRefreshing ? "opacity-50 animate-spin" : ""
                        }`}>
                        <Icons.Refresh className='w-4 h-4' />
                    </button>
                </div>

                {/* LOADER */}
                {isRefreshing && (
                    <div className='absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-[2px]'>
                        <div className='flex items-center gap-3 text-green-400 bg-zinc-950 px-6 py-3 rounded-full border border-zinc-700 shadow-2xl'>
                            <div className='animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent'></div>
                            <span className='text-sm font-bold font-sans tracking-wide'>
                                Sincronizando...
                            </span>
                        </div>
                    </div>
                )}

                {/* CONTENIDO - CARDS EXPANDIBLES */}
                <div className='flex-1 overflow-y-auto p-2 space-y-2'>
                    {hasActiveSubjects ? (
                        displayedGrades.map((row, index) => {
                            // Obtener solo los headers que tienen valores
                            const availableHeaders = getAvailableHeaders(row.rubrics)
                            const hasRubrics = availableHeaders.length > 0

                            return (
                                <div
                                    key={index}
                                    className='bg-zinc-900/80 border border-zinc-700 rounded-lg overflow-hidden'>
                                    {/* HEADER DEL CARD (SIEMPRE VISIBLE) */}
                                    <button
                                        onClick={() =>
                                            hasRubrics &&
                                            setExpandedCard(expandedCard === index ? null : index)
                                        }
                                        className={`w-full p-3 flex items-center justify-between transition-colors ${
                                            hasRubrics
                                                ? "hover:bg-zinc-700/30 cursor-pointer"
                                                : "cursor-default"
                                        }`}
                                        disabled={!hasRubrics}>
                                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                                            <div className='shrink-0'>
                                                {row.letter ? (
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-bold font-mono inline-block min-w-8 text-center ${getLiteralStyle(
                                                            row.letter
                                                        )}`}>
                                                        {row.letter}
                                                    </span>
                                                ) : (
                                                    <span className='px-2 py-1 rounded text-xs font-mono text-zinc-700 bg-zinc-800 border border-zinc-700'>
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                            <div className='flex-1 min-w-0 text-left'>
                                                <p className='text-sm font-bold text-white truncate pr-2'>
                                                    {row.subject}
                                                </p>
                                                <p className='text-[10px] text-zinc-500 font-mono'>
                                                    {row.code} · {row.credits} Cr
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 shrink-0'>
                                            {row.nfa > 0 && (
                                                <span className='text-xs font-mono font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/30'>
                                                    {parseFloat(row.nfa).toFixed(0)}
                                                </span>
                                            )}
                                            {hasRubrics && (
                                                <ChevronDown
                                                    className={`w-5 h-5 text-zinc-400 transition-transform ${
                                                        expandedCard === index ? "rotate-180" : ""
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    </button>

                                    {/* DETALLE EXPANDIBLE - SOLO SI HAY RUBRICS */}
                                    {hasRubrics && (
                                        <div
                                            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                                expandedCard === index
                                                    ? "grid-rows-[1fr]"
                                                    : "grid-rows-[0fr]"
                                            }`}>
                                            <div className='overflow-hidden'>
                                                <div className='border-t border-zinc-700 p-3 bg-zinc-950/50 space-y-2'>
                                                    {/* SOLO MOSTRAR HEADERS CON VALORES */}
                                                    {availableHeaders.map((header) => {
                                                        const val = row.rubrics[header]
                                                        const displayVal =
                                                            val === "NR" || !val ? "-" : val
                                                        const isNumber = !isNaN(
                                                            parseFloat(displayVal)
                                                        )
                                                        return (
                                                            <div
                                                                key={header}
                                                                className='flex justify-between items-center py-1.5 border-b border-zinc-800 last:border-0'>
                                                                <span className='text-xs font-medium text-green-400/80 uppercase'>
                                                                    {header}
                                                                </span>
                                                                <span
                                                                    className={`text-sm font-mono font-bold ${
                                                                        isNumber
                                                                            ? "text-gray-300"
                                                                            : "text-zinc-600"
                                                                    }`}>
                                                                    {displayVal}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                    {/* NFA SIEMPRE AL FINAL */}
                                                    {row.nfa > 0 && (
                                                        <div className='flex justify-between items-center py-1.5 bg-zinc-900/50 px-2 rounded mt-2'>
                                                            <span className='text-xs font-medium text-zinc-400 uppercase'>
                                                                NFA
                                                            </span>
                                                            <span className='text-lg font-mono font-black text-green-400'>
                                                                {parseFloat(row.nfa).toFixed(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className='h-full flex flex-col items-center justify-center text-zinc-600 font-sans px-4 py-10'>
                            <div className='bg-zinc-800/50 p-6 rounded-full mb-4 border border-zinc-700/50'>
                                <Icons.Book className='w-10 h-10 opacity-50' />
                            </div>
                            <h3 className='text-lg font-bold text-zinc-400 mb-2 text-center'>
                                Periodo No Cursado
                            </h3>
                            <p className='text-xs max-w-xs text-center leading-relaxed'>
                                No se encontraron registros de calificaciones para el{" "}
                                <span className='text-green-500 font-bold'>
                                    Periodo {selectedPeriod}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        )
    }

    // VERSIÓN DESKTOP (ORIGINAL)
    return (
        <main className='bg-zinc-800 rounded-2xl border border-zinc-700 p-1 overflow-hidden flex flex-col shadow-2xl relative z-0 h-full row-start-2'>
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600'></div>

            <div className='p-4 bg-zinc-800/90 backdrop-blur border-b border-zinc-700 flex justify-between items-center z-20 relative shrink-0'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-lg font-bold text-gray-200 font-sans'>
                        Calificaciones Cuatrimestrales
                    </h2>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-green-400 transition-all border border-transparent hover:border-zinc-500 cursor-pointer ${
                            isRefreshing ? "opacity-50 cursor-not-allowed animate-spin" : ""
                        }`}>
                        <Icons.Refresh className='w-4 h-4' />
                    </button>
                </div>

                {hasActiveSubjects && (
                    <div className='hidden xl:flex items-center gap-4 text-[10px] text-zinc-400 bg-zinc-900/50 px-4 py-1.5 rounded-lg border border-zinc-700/50 font-mono select-none'>
                        <div className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]'></span>
                            <span>A (90-100)</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]'></span>
                            <span>B (80-89)</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]'></span>
                            <span>C (70-79)</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'></span>
                            <span>F/R</span>
                        </div>
                    </div>
                )}
            </div>

            {isRefreshing && (
                <div className='absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-[2px]'>
                    <div className='flex items-center gap-3 text-green-400 bg-zinc-950 px-6 py-3 rounded-full border border-zinc-700 shadow-2xl transform scale-110'>
                        <div className='animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent'></div>
                        <span className='text-sm font-bold font-sans tracking-wide'>
                            Sincronizando...
                        </span>
                    </div>
                </div>
            )}

            <div className='flex-1 min-h-0 overflow-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-600 p-2 relative z-0'>
                {hasActiveSubjects ? (
                    <table className='w-full text-left border-collapse relative'>
                        <thead className='sticky top-0 z-40'>
                            <tr className='text-xs text-zinc-400 bg-zinc-800 uppercase tracking-wider shadow-lg font-sans'>
                                <th className='p-3 font-medium border-b border-zinc-700 w-1/3 rounded-tl-lg'>
                                    Asignatura
                                </th>
                                <th className='p-3 font-medium border-b border-zinc-700 text-center'>
                                    Créditos
                                </th>
                                {headers.map((header) => (
                                    <th
                                        key={header}
                                        className='p-3 font-medium border-b border-zinc-700 text-center text-green-400/80'>
                                        {header}
                                    </th>
                                ))}
                                <th
                                    className='p-3 font-medium border-b border-zinc-700 text-center text-zinc-500'
                                    title='Nota Final Aproximada'>
                                    NFA
                                </th>
                                <th className='p-3 font-medium border-b border-zinc-700 text-center rounded-tr-lg'>
                                    Lit
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-sm divide-y divide-zinc-700/50'>
                            {displayedGrades.map((row, index) => (
                                <tr
                                    key={index}
                                    className='hover:bg-zinc-700/30 transition-colors group'>
                                    <td className='p-3 font-medium text-gray-200 group-hover:text-green-300 transition-colors font-sans select-text'>
                                        {row.subject}
                                    </td>
                                    <td className='p-3 text-center text-zinc-500 text-xs font-mono'>
                                        {row.credits}
                                    </td>
                                    {headers.map((header) => {
                                        const val = row.rubrics ? row.rubrics[header] : null
                                        const displayVal = val === "NR" || !val ? "-" : val
                                        const isNumber = !isNaN(parseFloat(displayVal))
                                        return (
                                            <td key={header} className='p-3 text-center'>
                                                <span
                                                    className={`text-xs font-mono ${
                                                        isNumber ? "text-gray-300" : "text-zinc-600"
                                                    }`}>
                                                    {displayVal}
                                                </span>
                                            </td>
                                        )
                                    })}
                                    <td className='p-3 text-center'>
                                        <span
                                            className={`text-xs font-mono font-bold ${
                                                row.nfa && row.nfa > 0
                                                    ? "text-green-400"
                                                    : "text-zinc-600"
                                            }`}>
                                            {row.nfa > 0 ? parseFloat(row.nfa).toFixed(0) : "0"}
                                        </span>
                                    </td>
                                    <td className='p-3 text-center'>
                                        {row.letter ? (
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] font-bold font-mono inline-block min-w-7.5 ${getLiteralStyle(
                                                    row.letter
                                                )}`}>
                                                {row.letter}
                                            </span>
                                        ) : (
                                            <span className='text-zinc-700 font-mono'>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='h-full flex flex-col items-center justify-center text-zinc-600 font-sans'>
                        <div className='bg-zinc-800/50 p-6 rounded-full mb-4 border border-zinc-700/50'>
                            <Icons.Book className='w-12 h-12 opacity-50' />
                        </div>
                        <h3 className='text-xl font-bold text-zinc-400 mb-2'>Periodo No Cursado</h3>
                        <p className='text-sm max-w-xs text-center leading-relaxed'>
                            No se encontraron registros de calificaciones para el{" "}
                            <span className='text-green-500 font-bold'>
                                Periodo {selectedPeriod}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
