import React from "react"
import {Icons} from "../ui/Icons.jsx"

function Pensum({pensumStats, pensumData, checkSubjectStatus}) {
    return (
        <div className='flex flex-col h-full w-full overflow-hidden'>
            {/* ESTADÍSTICAS COMPACTAS Y HORIZONTALES */}
            {/* grid-cols-3: Fuerza 3 columnas siempre, incluso en móvil.
                gap-2: Espaciado reducido.
                p-2: Padding interno de tarjetas reducido.
            */}
            <div className='shrink-0 grid grid-cols-3 gap-2 mb-2 pr-2'>
                {/* TARJETA 1: TOTALES */}
                <div className='bg-zinc-900/80 p-2 rounded-lg text-center border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-center items-center h-16 md:h-auto'>
                    <p className='text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-wider relative z-10 leading-tight mb-0.5'>Totales</p>
                    <p className='text-xl md:text-2xl font-black text-white relative z-10 leading-none'>{pensumStats.total}</p>
                </div>

                {/* TARJETA 2: CURSADAS (Destacada) */}
                <div className='bg-zinc-900/80 p-2 rounded-lg text-center border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)] relative overflow-hidden flex flex-col justify-center items-center h-16 md:h-auto'>
                    <div className='absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent opacity-50'></div>
                    <p className='text-[8px] md:text-[10px] text-green-400 uppercase font-black tracking-wider relative z-10 leading-tight mb-0.5'>Cursadas</p>
                    <p className='text-xl md:text-2xl font-black text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] relative z-10 leading-none'>{pensumStats.finished}</p>
                </div>

                {/* TARJETA 3: PENDIENTES */}
                <div className='bg-zinc-900/80 p-2 rounded-lg text-center border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-center items-center h-16 md:h-auto'>
                    <p className='text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-wider relative z-10 leading-tight mb-0.5'>Pendientes</p>
                    <p className='text-xl md:text-2xl font-black text-zinc-300 relative z-10 leading-none'>{pensumStats.pending}</p>
                </div>
            </div>

            {/* LISTA SCROLLEABLE */}
            <div className='flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 pr-2 pb-4'>
                <div className='space-y-6' style={{contentVisibility: "auto"}}>
                    {pensumData &&
                        Object.keys(pensumData)
                            .sort((a, b) => Number(a) - Number(b))
                            .map((period) => (
                                <div key={period} className='relative'>
                                    {/* Header de Periodo Sticky más compacto */}
                                    <div className='flex items-center gap-3 mb-3 sticky top-0 bg-zinc-900/95 backdrop-blur-sm z-10 py-2'>
                                        <div className='bg-green-950/30 border border-green-500/30 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(34,197,94,0.1)]'>
                                            <h4 className='font-black text-green-400 text-xs md:text-sm tracking-wider uppercase'>Periodo {period}</h4>
                                        </div>
                                        <div className='h-0.5 flex-1 bg-linear-to-r from-green-500/30 via-zinc-800 to-transparent rounded-full'></div>
                                    </div>

                                    <div className='grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
                                        {pensumData[period].map((sub, idx) => {
                                            const grade = checkSubjectStatus(sub)
                                            let signalClass = "bg-zinc-700"
                                            let statusTooltip = "Pendiente"

                                            if (grade) {
                                                if (grade.letter === "EC") {
                                                    signalClass = "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"
                                                    statusTooltip = "En Curso"
                                                } else if (["A", "B", "C", "D", "CV", "E"].includes(grade.letter)) {
                                                    signalClass = "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                                                    statusTooltip = `Aprobada (${grade.letter})`
                                                } else {
                                                    signalClass = "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                                                    statusTooltip = `Reprobada (${grade.letter})`
                                                }
                                            }

                                            return (
                                                <div key={`${period}-${idx}`} className='relative bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 overflow-hidden group hover:border-zinc-700 transition-colors' title={statusTooltip}>
                                                    <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${signalClass}`}></div>

                                                    <div className='flex flex-col items-start mb-3 pr-4'>
                                                        <span className='text-[10px] font-mono font-bold text-zinc-400 bg-zinc-950/80 px-2 py-1 rounded border border-zinc-800 mb-2'>{sub.code || sub.codeSubject}</span>
                                                        <p className='text-sm font-bold text-zinc-100 leading-tight line-clamp-2' title={sub.course || sub.subject}>
                                                            {sub.course || sub.subject}
                                                        </p>
                                                    </div>

                                                    <div className='flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800/50 w-fit'>
                                                        <Icons.Book className='w-3 h-3 text-zinc-500' />
                                                        <span className='text-xs font-black text-zinc-300'>{sub.credits}</span>
                                                        <span className='text-[8px] text-zinc-600 font-bold uppercase tracking-wider'>CR</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
        </div>
    )
}

export default Pensum
