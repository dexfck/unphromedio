import {Eye, Github, Lightbulb, Target} from "lucide-react"
import React from "react"

function MoreInfo() {
    return (
        <div className='h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 pr-2'>
            <div className='p-2 md:p-4 space-y-6 md:space-y-8'>
                <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
                    <section className='space-y-3 bg-zinc-800/20 p-4 md:p-5 rounded-lg border border-zinc-800'>
                        <div className='flex items-center gap-2 text-green-400 font-semibold mb-2'>
                            <Lightbulb size={20} />
                            <h3 className='uppercase tracking-wider text-xs'>Inspiración del Proyecto</h3>
                        </div>
                        <p className='text-zinc-300 text-sm leading-relaxed'>Nace de la necesidad de simplificar la vida académica, ofreciendo acceso inmediato al estado actual de tu índice y la capacidad de visualizar escenarios futuros mediante proyecciones inteligentes y accesibles.</p>
                    </section>

                    <section className='space-y-3 bg-zinc-800/20 p-4 md:p-5 rounded-lg border border-zinc-800'>
                        <div className='flex items-center gap-2 text-blue-400 font-semibold mb-2'>
                            <Target size={20} />
                            <h3 className='uppercase tracking-wider text-xs'>Misión</h3>
                        </div>
                        <p className='text-zinc-300 text-sm leading-relaxed'>Proveer claridad y control sobre la trayectoria estudiantil mediante herramientas precisas de cálculo y proyección que transforman datos complejos en información accionable para la toma de decisiones.</p>
                    </section>

                    <section className='space-y-3 bg-zinc-800/20 p-4 md:p-5 rounded-lg border border-zinc-800'>
                        <div className='flex items-center gap-2 text-purple-400 font-semibold mb-2'>
                            <Eye size={20} />
                            <h3 className='uppercase tracking-wider text-xs'>Visión</h3>
                        </div>
                        <p className='text-zinc-300 text-sm leading-relaxed'>Ser el compañero digital esencial para todo estudiante, donde la planificación académica deja de ser una incertidumbre para convertirse en una estrategia definida y alcanzable.</p>
                    </section>
                </div>

                <div className='pt-4 md:pt-6 border-t border-zinc-800 flex flex-col items-center gap-4 pb-6'>
                    <span className='text-zinc-500 text-xs'>Contacto del creador</span>
                    <a href='https://github.com/dexfck' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 px-6 py-3 bg-zinc-950 hover:bg-black text-white rounded-lg transition-all hover:scale-105 border border-zinc-800 hover:border-green-500/50 group shadow-lg'>
                        <Github size={20} className='group-hover:text-green-500 transition-colors' />
                        <span className='font-medium font-mono'>github.com/dexfck</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default MoreInfo
