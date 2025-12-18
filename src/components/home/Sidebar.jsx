import React, {useState} from "react"
import {Icons} from "../ui/Icons"
import {HelpCircle} from "lucide-react"
import {MoreInfoModal} from "./MoreInfoModal"

export const Sidebar = ({selectedPeriod, periodInfo, setActiveModal}) => {
    // Estado local para el modal de información
    const [isInfoModalOpen, setInfoModalOpen] = useState(false)

    // LÓGICA DE ESTILOS SEGÚN ESTADO (MANTENIDA)
    let statusClasses = "bg-zinc-800 text-zinc-500 border-zinc-700"
    let dotClasses = "bg-zinc-600"
    let statusLabel = periodInfo.status

    if (periodInfo.status === "Cursando") {
        statusClasses =
            "bg-green-500 text-zinc-900 shadow-[0_0_15px_rgba(34,197,94,0.6)] border-green-400"
        dotClasses = "bg-zinc-900 animate-pulse"
    } else if (periodInfo.status === "Finalizado") {
        statusClasses =
            "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400"
        dotClasses = "bg-white"
    }

    return (
        <>
            <aside className='row-start-2 flex flex-col gap-4 overflow-hidden'>
                {/* TARJETA SUPERIOR (ESTILO VISUAL VERDE) */}
                <div className='bg-gradient-to-br from-green-600 to-emerald-900 rounded-2xl p-6 shadow-lg border border-green-500 relative overflow-hidden flex flex-col justify-center min-h-[180px] shrink-0'>
                    <div className='absolute top-0 right-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none'></div>
                    <div className='relative z-10 flex flex-col h-full justify-between'>
                        <div>
                            <p className='text-green-200 text-xs font-bold uppercase tracking-wider mb-1 font-sans'>
                                Visualizando
                            </p>
                            <h2 className='text-3xl font-bold text-white leading-none mb-4 font-sans'>
                                Periodo {selectedPeriod}
                            </h2>

                            <div
                                className={`inline-flex items-center px-4 py-1.5 rounded-full border border-opacity-50 font-bold tracking-wider uppercase text-[10px] transition-all duration-300 ${statusClasses}`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${dotClasses}`}></div>
                                {statusLabel}
                            </div>
                        </div>
                        <div className='flex justify-between items-end mt-4'>
                            <div>
                                <span className='text-5xl font-black text-white leading-none tracking-tighter font-mono'>
                                    {periodInfo.credits}
                                </span>
                                <span className='text-green-200 text-xs font-medium ml-1 font-sans'>
                                    Créditos
                                </span>
                            </div>
                            <div className='text-right'>
                                <span className='block text-[10px] text-green-300 uppercase font-bold tracking-wider font-sans'>
                                    Promedio Est.
                                </span>
                                <span className='text-3xl font-black text-white tracking-tight font-mono drop-shadow-md'>
                                    {periodInfo.average}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MENÚ DE NAVEGACIÓN */}
                <div className='bg-zinc-800 rounded-2xl flex-1 min-h-0 border border-zinc-700 p-4 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-600'>
                    <h3 className='text-zinc-500 text-xs font-bold uppercase mb-4 text-center font-sans shrink-0'>
                        Menú Rápido
                    </h3>

                    <button
                        onClick={() => setActiveModal("student")}
                        className='w-full py-3 px-4 bg-zinc-700/30 hover:bg-zinc-700 hover:border-green-500/50 border border-transparent rounded-xl mb-3 text-sm font-medium transition-all text-left flex items-center gap-3 group cursor-pointer shrink-0'>
                        <Icons.User className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white font-sans flex-1'>
                            Info. Estudiante
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveModal("pensum")}
                        className='w-full py-3 px-4 bg-zinc-700/30 hover:bg-zinc-700 hover:border-green-500/50 border border-transparent rounded-xl mb-3 text-sm font-medium transition-all text-left flex items-center gap-3 group cursor-pointer shrink-0'>
                        <Icons.Book className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white font-sans flex-1'>
                            Ver Pensum Completo
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveModal("details")}
                        className='w-full py-3 px-4 bg-zinc-700/30 hover:bg-zinc-700 hover:border-green-500/50 border border-transparent rounded-xl mb-3 text-sm font-medium transition-all text-left flex items-center gap-3 group cursor-pointer shrink-0'>
                        <Icons.Info className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white font-sans flex-1'>
                            Detalles del Periodo
                        </span>
                    </button>

                    <div className='my-2 border-t border-zinc-700/50 shrink-0'></div>

                    <button
                        onClick={() => setActiveModal("projection")}
                        className='w-full py-3 px-4 bg-zinc-700/30 hover:bg-zinc-700 hover:border-green-500/50 border border-transparent rounded-xl mb-3 text-sm font-medium transition-all text-left flex items-center gap-3 group cursor-pointer shrink-0'>
                        <Icons.Calculator className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white font-sans flex-1'>
                            Proyección de Índice
                        </span>
                    </button>

                    {/* Espaciador */}
                    <div className='mt-auto shrink-0'></div>
                    <div className='my-2 border-t border-zinc-700/50 shrink-0'></div>

                    {/* BOTÓN MÁS INFORMACIÓN (SUSTITUYE A CONFIGURACIÓN) */}
                    <button
                        onClick={() => setInfoModalOpen(true)}
                        className='w-full py-3 px-4 bg-zinc-700/30 hover:bg-zinc-700 hover:border-green-500/50 border border-transparent rounded-xl mb-2 text-sm font-medium transition-all text-left flex items-center gap-3 group cursor-pointer shrink-0'>
                        <HelpCircle className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white font-sans flex-1'>
                            Más Información
                        </span>
                    </button>

                    {/* BOTÓN CERRAR SESIÓN */}
                    <button
                        onClick={() => setActiveModal("logout")}
                        className='w-full py-3 px-4 bg-red-900/10 hover:bg-red-900/30 hover:border-red-500/30 border border-transparent rounded-xl mb-1 text-sm font-medium transition-all text-left flex items-center gap-3 group cursor-pointer shrink-0'>
                        <Icons.Logout className='w-5 h-5 text-red-500/70 group-hover:text-red-400' />
                        <span className='text-red-300/80 group-hover:text-red-200 font-sans flex-1'>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </aside>

            {/* MODAL INTEGRADO */}
            <MoreInfoModal isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} />
        </>
    )
}
