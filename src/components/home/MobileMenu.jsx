import React from "react"
import {Icons} from "../ui/Icons"
import Button from "../ui/Button.jsx"
import {HelpCircle, ChevronLeft} from "lucide-react"

export const MobileMenu = ({isOpen, onClose, setActiveModal}) => {
    const menuBtnClass = `
        w-full py-3 px-4 rounded-lg text-sm font-medium text-left flex items-center gap-3 
        bg-gradient-to-r from-zinc-800/40 to-zinc-900/60 
        border border-zinc-700/50 
        transition-all duration-200 
        hover:border-zinc-600 hover:from-zinc-800/60 hover:to-zinc-900/80 hover:shadow-lg hover:shadow-black/20
        active:bg-green-500 active:border-green-400 active:scale-[0.98] active:shadow-[0_0_20px_rgba(34,197,94,0.4)]
        group select-none
    `

    // ESTILO ESPECÍFICO PARA LOGOUT (Rojo)
    const logoutBtnClass = `
        w-full py-3 px-4 rounded-lg text-sm font-medium text-left flex items-center gap-3 
        bg-gradient-to-r from-red-500/10 to-red-900/10 
        border border-red-500/20 
        transition-all duration-200 
        hover:border-red-500/50 hover:from-red-500/20 hover:to-red-900/20
        active:bg-red-500 active:border-red-400 active:scale-[0.98] active:shadow-[0_0_20px_rgba(239,68,68,0.4)]
        group select-none
    `

    return (
        <>
            {/* Overlay */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-90 transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose} />

            {/* Drawer lateral */}
            <aside className={`fixed top-0 left-0 h-full flex flex-col w-72 bg-zinc-900 rounded-tr-xl rounded-br-xl border-r border-zinc-700/50 shadow-2xl shadow-black z-100 transition-transform duration-300 ease-out lg:hidden overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {/* Header del Drawer */}
                <div className='sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 p-5 flex justify-between items-center z-10'>
                    <h2 className='text-lg font-black text-green-500 font-sans tracking-wide'>MENÚ</h2>
                    <button onClick={onClose} className='p-2 hover:bg-zinc-800 active:bg-zinc-700 rounded-lg transition-colors border border-transparent hover:border-zinc-700'>
                        <ChevronLeft className='w-5 h-5 text-zinc-400' />
                    </button>
                </div>

                {/* Contenido del Drawer */}
                <div className='p-4 space-y-2 flex flex-col justify-between h-full'>
                    <div className='grid gap-3'>
                        <h4 className='text-zinc-500 text-xs font-bold uppercase mb-2 pl-1 tracking-wider'>Navegación</h4>

                        <Button onClick={() => setActiveModal("student")} classText={menuBtnClass}>
                            <Icons.User className='w-5 h-5 text-zinc-500 group-active:text-black transition-colors' />
                            <span className='text-gray-300 group-active:text-black group-active:font-bold flex-1 transition-colors'>Info. Estudiante</span>
                        </Button>

                        <Button onClick={() => setActiveModal("pensum")} classText={menuBtnClass}>
                            <Icons.Book className='w-5 h-5 text-zinc-500 group-active:text-black transition-colors' />
                            <span className='text-gray-300 group-active:text-black group-active:font-bold flex-1 transition-colors'>Ver Pensum Completo</span>
                        </Button>

                        <Button onClick={() => setActiveModal("details")} classText={menuBtnClass}>
                            <Icons.Info className='w-5 h-5 text-zinc-500 group-active:text-black transition-colors' />
                            <span className='text-gray-300 group-active:text-black group-active:font-bold flex-1 transition-colors'>Detalles del Periodo</span>
                        </Button>

                        <Button onClick={() => setActiveModal("projection")} classText={menuBtnClass}>
                            <Icons.Calculator className='w-5 h-5 text-zinc-500 group-active:text-black transition-colors' />
                            <span className='text-gray-300 group-active:text-black group-active:font-bold flex-1 transition-colors'>Proyección de Índice</span>
                        </Button>

                        <Button onClick={() => setActiveModal("info")} classText={menuBtnClass}>
                            <HelpCircle className='w-5 h-5 text-zinc-500 group-active:text-black transition-colors' />
                            <span className='text-gray-300 group-active:text-black group-active:font-bold flex-1 transition-colors'>Más Información</span>
                        </Button>
                    </div>

                    <div className='pt-4 border-t border-zinc-800/50'>
                        <Button
                            onClick={() => {
                                setActiveModal("logout")
                                onClose()
                            }}
                            classText={logoutBtnClass}>
                            <Icons.Logout className='w-5 h-5 text-red-500/70 group-active:text-black transition-colors' />
                            <span className='text-red-300/80 group-active:text-black group-active:font-bold flex-1 transition-colors'>Cerrar Sesión</span>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}
