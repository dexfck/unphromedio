import React from "react"
import {X, Github, Target, Eye, Lightbulb} from "lucide-react"

export const MoreInfoModal = ({isOpen, onClose}) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'>
            {/* Contenedor Modal */}
            <div className='bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200'>
                {/* Cabecera */}
                <div className='flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50'>
                    <h2 className='text-2xl font-bold text-white flex items-center gap-2 font-sans'>
                        <span className='text-green-500'>Más Información</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors'>
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido Scrollable */}
                <div className='p-8 space-y-8 overflow-y-auto max-h-[70vh]'>
                    {/* Sección Inspiración */}
                    <section className='space-y-3'>
                        <div className='flex items-center gap-2 text-green-400 font-semibold mb-2'>
                            <Lightbulb size={20} />
                            <h3 className='uppercase tracking-wider text-xs'>
                                Inspiración del Proyecto
                            </h3>
                        </div>
                        <p className='text-zinc-300 leading-relaxed text-sm md:text-base bg-zinc-800/30 p-5 rounded-2xl border border-zinc-700/50 shadow-inner'>
                            Nace de la necesidad de simplificar la vida académica, ofreciendo acceso
                            inmediato al estado actual de tu índice y la capacidad de visualizar
                            escenarios futuros mediante proyecciones inteligentes y accesibles.
                        </p>
                    </section>

                    <div className='grid md:grid-cols-2 gap-6'>
                        {/* Sección Misión */}
                        <section className='space-y-3 bg-zinc-800/20 p-5 rounded-2xl border border-zinc-800'>
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

                        {/* Sección Visión */}
                        <section className='space-y-3 bg-zinc-800/20 p-5 rounded-2xl border border-zinc-800'>
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

                    {/* Footer Github */}
                    <div className='pt-6 border-t border-zinc-800 flex flex-col items-center gap-4'>
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
            </div>
        </div>
    )
}
