import React from "react"

function Details({periodInfo, displayedGrades, getLiteralStyle}) {
    return (
        <div className='flex flex-col h-full w-full overflow-hidden'>
            {/* CABECERA FIJA Y HORIZONTAL */}
            <div className='shrink-0 pr-2'>
                {/* grid-cols-3: Fuerza la alineación horizontal en todas las pantallas */}
                <div className='grid grid-cols-3 gap-2 mb-4'>
                    {/* TARJETA 1: ESTADO (Highlight) */}
                    <div className='bg-zinc-900/90 p-2 md:p-4 rounded-lg text-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative overflow-hidden flex flex-col justify-center items-center h-16 md:h-24 group'>
                        <div className='absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity'></div>
                        <p className='text-[8px] md:text-[10px] text-green-400 uppercase font-black tracking-widest relative z-10 mb-0.5 leading-tight'>Estado</p>
                        <p className={`text-sm md:text-2xl font-black relative z-10 leading-none ${periodInfo.status.includes("Cursando") ? "text-white" : "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"}`}>{periodInfo.status.split(" ")[0]}</p>
                    </div>

                    {/* TARJETA 2: MATERIAS (Clean Dark) */}
                    <div className='bg-zinc-900/80 p-2 md:p-4 rounded-lg text-center border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-center items-center h-16 md:h-24'>
                        <p className='text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest relative z-10 mb-0.5 leading-tight'>Materias</p>
                        <p className='text-xl md:text-3xl font-black text-white relative z-10 leading-none'>{displayedGrades.length}</p>
                    </div>

                    {/* TARJETA 3: CRÉDITOS (Clean Dark) */}
                    <div className='bg-zinc-900/80 p-2 md:p-4 rounded-lg text-center border border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-center items-center h-16 md:h-24'>
                        <p className='text-[8px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest relative z-10 mb-0.5 leading-tight'>Créditos</p>
                        <p className='text-xl md:text-3xl font-black text-white relative z-10 leading-none'>{periodInfo.credits}</p>
                    </div>
                </div>

                <div className='my-2 border-t border-zinc-800/50 shrink-0'></div>
            </div>

            {/* LISTA SCROLLEABLE */}
            <div className='flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 pr-2 pb-4 mt-2'>
                <div className='space-y-3'>
                    {displayedGrades.map((g, i) => {
                        let statusText = "PENDIENTE",
                            statusStyle = "text-zinc-500 bg-zinc-950/50 border-zinc-800"

                        if (g.hasGrade) {
                            if (g.letter === "EC") {
                                statusText = "EN CURSO"
                                statusStyle = "text-blue-400 bg-blue-950/50 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                            } else if (["A", "B", "C", "D"].includes(g.letter)) {
                                statusText = "APROBADA"
                                statusStyle = "text-green-400 bg-green-950/50 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                            } else {
                                statusText = "REPROBADA"
                                statusStyle = "text-red-400 bg-red-950/50 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                            }
                        }

                        return (
                            <div key={i} className='flex justify-between items-center p-3 md:p-4 bg-zinc-900/40 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all group'>
                                <div className='flex flex-col gap-1 overflow-hidden mr-3'>
                                    <span className='text-[9px] md:text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded-md w-fit border border-zinc-800 group-hover:border-zinc-700 transition-colors'>{g.code}</span>
                                    <span className='text-xs md:text-sm text-zinc-300 font-bold group-hover:text-white transition-colors truncate'>{g.subject}</span>
                                </div>
                                <div className='shrink-0'>
                                    <span className={`text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-md border uppercase tracking-wider ${statusStyle}`}>{statusText}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Details
