import React from "react"
import {Icons} from "../ui/Icons.jsx"

function Calc({PeriodDropdown, simulatedSubjects, simulatedPeriod, setSimulatedPeriod, projectedIndex, ALL_HEADERS, handleInputChange}) {
    return (
        /* ESTRUCTURA PRINCIPAL: 
           - h-full: Ocupa toda la altura disponible del padre.
           - overflow-hidden: CRÍTICO. Evita que este contenedor crezca más allá de su padre, forzando el scroll interno.
           - relative: Para posicionamiento de z-index.
        */
        <div className='flex flex-col h-full w-full overflow-hidden relative'>
            {/* 1. HEADER (SECCIÓN FIJA) */}
            {/* - shrink-0: Impide que el header se encoja.
               - z-50: Asegura que esté por encima del contenido al hacer scroll.
               - relative: Necesario para que z-index funcione.
            */}
            <div className='shrink-0 z-50 p-1 pb-2 relative'>
                <div className='bg-zinc-950/95 backdrop-blur-sm p-3 rounded-lg border border-zinc-800/80 shadow-xl relative'>
                    <div className='absolute inset-0 bg-linear-to-r from-green-500/5 via-transparent to-green-500/5 opacity-50 pointer-events-none rounded-lg'></div>

                    <div className='relative z-20 flex flex-row items-end justify-between gap-4'>
                        {/* IZQUIERDA: DROPDOWN */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1.5'>
                                <Icons.Book className='w-3 h-3 text-green-500' />
                                Periodo
                            </span>
                            <div className='w-36 md:w-56 shadow-lg relative'>
                                <PeriodDropdown selected={simulatedPeriod} options={Array.from({length: 12}, (_, i) => i + 1)} onChange={setSimulatedPeriod} w={"w-full"} />
                            </div>
                        </div>

                        {/* DERECHA: ÍNDICE */}
                        <div className='text-right pb-0.5'>
                            <p className='text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-0'>Proyectado</p>
                            <p className={`text-4xl md:text-6xl font-black font-mono leading-none transition-all duration-300 ${projectedIndex >= 3 ? "text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" : projectedIndex >= 2 ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"}`}>{projectedIndex.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CONTENIDO MÓVIL (SECCIÓN SCROLLEABLE) */}
            {/* - flex-1: Ocupa todo el espacio restante.
               - overflow-y-auto: Habilita el scroll SOLO en este div.
               - min-h-0: Truco esencial de Flexbox para permitir el scroll en hijos anidados.
            */}
            <div className='lg:hidden flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 pr-1 pb-4 relative z-0'>
                <div className='space-y-3 pt-1'>
                    {simulatedSubjects.map((sub, idx) => (
                        <div key={idx} className='bg-zinc-900 border border-zinc-800 rounded-lg p-3 mx-1'>
                            <div className='flex justify-between items-start mb-2'>
                                <div className='flex-1 pr-2'>
                                    <h4 className='text-sm font-bold text-white mb-0.5 line-clamp-2'>{sub.course || sub.subject}</h4>
                                    <p className='text-[10px] text-zinc-500 font-mono uppercase tracking-wide'>{sub.credits} Créditos</p>
                                </div>
                                {sub.nfa > 0 && (
                                    <span className={`text-lg font-black font-mono px-2 py-0.5 rounded-md shrink-0 ${sub.nfa >= 90 ? "text-green-400 bg-green-950/50 border border-green-900" : sub.nfa >= 80 ? "text-blue-400 bg-blue-950/50 border border-blue-900" : sub.nfa >= 70 ? "text-yellow-400 bg-yellow-950/50 border border-yellow-900" : "text-red-400 bg-red-950/50 border border-red-900"}`}>
                                        {sub.nfa.toFixed(0)}
                                    </span>
                                )}
                            </div>
                            <div className='grid grid-cols-3 gap-2'>
                                {ALL_HEADERS.map((field) => (
                                    <div key={field} className='flex flex-col'>
                                        <label className='text-[8px] text-green-500/70 uppercase mb-1 font-bold tracking-wider text-center'>{field}</label>
                                        <input
                                            type='number'
                                            inputMode='numeric'
                                            className='w-full bg-zinc-800 border border-zinc-700 rounded-md text-center text-white font-mono text-sm py-1.5 focus:outline-none focus:border-green-400 focus:bg-zinc-900 transition-all placeholder-zinc-600'
                                            placeholder='-'
                                            min='0'
                                            max='100'
                                            value={sub.rubrics[field]}
                                            onChange={(e) => handleInputChange(idx, field, e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. CONTENIDO DESKTOP (TABLA SCROLLEABLE) */}
            {/* Mismo principio: flex-1 + overflow-auto + min-h-0 */}
            <div className='hidden lg:block flex-1 min-h-0 overflow-auto border border-zinc-800 rounded-lg bg-zinc-950 shadow-inner relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent mt-1 z-0'>
                <div className='absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500/50 via-emerald-500/50 to-teal-500/50 z-30 pointer-events-none'></div>
                <table className='w-full text-left border-collapse relative z-10'>
                    <thead className='bg-zinc-900/95 backdrop-blur-md text-[10px] text-zinc-400 uppercase font-sans sticky top-0 z-20 shadow-md'>
                        <tr>
                            <th className='p-5 w-64 font-black tracking-widest border-b border-zinc-800/80'>Asignatura</th>
                            <th className='p-5 text-center w-16 font-black tracking-widest border-b border-zinc-800/80 text-zinc-500'>CR</th>
                            {ALL_HEADERS.map((header) => (
                                <th key={header} className='p-5 text-center text-green-500/70 font-black tracking-widest border-b border-zinc-800/80 min-w-17.5'>
                                    {header}
                                </th>
                            ))}
                            <th className='p-5 text-center text-white font-black tracking-widest border-b border-zinc-800/80'>NFA</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm divide-y divide-zinc-800/40'>
                        {simulatedSubjects.map((sub, idx) => (
                            <tr key={idx} className='hover:bg-zinc-900/30 transition-colors group'>
                                <td className='p-5 text-xs font-bold text-zinc-300 truncate max-w-55 group-hover:text-white transition-colors' title={sub.course || sub.subject}>
                                    {sub.course || sub.subject}
                                </td>
                                <td className='p-5 text-center text-zinc-600 font-mono text-xs font-bold group-hover:text-zinc-400'>{sub.credits}</td>
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
                                            onChange={(e) => handleInputChange(idx, field, e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </td>
                                ))}
                                <td className='p-5 text-center font-black text-white font-mono text-base'>
                                    {sub.nfa > 0 ? (
                                        <span
                                            className={`inline-block px-3 py-1 rounded-lg ${
                                                sub.nfa >= 90 ? "text-green-400 bg-green-950 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : sub.nfa >= 80 ? "text-blue-400 bg-blue-950 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : sub.nfa >= 70 ? "text-yellow-400 bg-yellow-950 shadow-[0_0_10px_rgba(234,179,8,0.2)]" : "text-red-400 bg-red-950 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
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
        </div>
    )
}

export default Calc
