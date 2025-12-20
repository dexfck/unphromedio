import React, {useEffect, useState} from "react"
import {ArrowLeft} from "lucide-react"

export const Modal = ({isOpen, onClose, title, children, className}) => {
    // Controla si el componente existe en el DOM
    const [isRendered, setIsRendered] = useState(false)
    // Controla la clase visual (para la transición de salida)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true)
            setIsVisible(true)
        } else {
            // CIERRE ANIMADO:
            // 1. Iniciamos la transición visual hacia 'opacity-0'
            setIsVisible(false)

            // 2. Esperamos a que termine la transición (200ms) para desmontar
            const timer = setTimeout(() => setIsRendered(false), 200)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isRendered) return null

    return (
        <div className={`fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div
                className={`bg-zinc-900 border border-zinc-800 w-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col transform transition-all duration-200 ease-out ${

                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                } ${className || "max-w-4xl"}`}>
                {/* HEADER */}
                <div className='p-4 md:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-lg shrink-0'>
                    <h3 className='text-lg md:text-xl font-bold text-white font-sans pr-4'>{title}</h3>
                    <button onClick={onClose} className='flex items-center gap-2 px-4 py-2.5 md:p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 hover:border-green-500/50 transition-all text-zinc-300 hover:text-white cursor-pointer shrink-0'>
                        <ArrowLeft className='w-5 h-5 md:w-4 md:h-4' />
                        <span className='text-sm font-medium md:hidden'>Volver</span>
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className='p-4 md:p-6 flex-1 flex flex-col min-h-0 overflow-hidden relative'>{children}</div>
            </div>
        </div>
    )
}
