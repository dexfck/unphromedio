import React from "react"
import {ArrowLeft} from "lucide-react"

export const Modal = ({isOpen, onClose, title, children, className}) => {
    if (!isOpen) return null
    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity'>
            <div
                className={`bg-zinc-900 border border-zinc-800 w-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 ${
                    className || "max-w-4xl"
                }`}>
                {/* HEADER CON BOTÓN VOLVER MÁS GRANDE EN MÓVIL */}
                <div className='p-4 md:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-2xl shrink-0'>
                    <h3 className='text-lg md:text-xl font-bold text-white font-sans pr-4'>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className='flex items-center gap-2 px-4 py-2.5 md:p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 hover:border-green-500/50 transition-all text-zinc-300 hover:text-white cursor-pointer shrink-0'>
                        <ArrowLeft className='w-5 h-5 md:w-4 md:h-4' />
                        <span className='text-sm font-medium md:hidden'>Volver</span>
                    </button>
                </div>

                <div className='p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-600 flex-1'>
                    {children}
                </div>
            </div>
        </div>
    )
}
