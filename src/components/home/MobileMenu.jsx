import React from "react"
import {Icons} from "../ui/Icons"
import {HelpCircle, X} from "lucide-react"

export const MobileMenu = ({isOpen, onClose, periodInfo, setActiveModal}) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] transition-opacity duration-300 lg:hidden ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            {/* Drawer lateral */}
            <aside
                className={`fixed top-0 left-0 h-full w-[280px] bg-zinc-900 border-r border-zinc-700 z-[100] transition-transform duration-300 ease-out lg:hidden overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                {/* Header del Drawer */}
                <div className='sticky top-0 bg-zinc-900 border-b border-zinc-700 p-4 flex justify-between items-center z-10'>
                    <h2 className='text-lg font-black text-green-500 font-sans'>MENÚ</h2>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-zinc-800 rounded-lg transition-colors'>
                        <X className='w-5 h-5 text-zinc-400' />
                    </button>
                </div>

                {/* Contenido del Drawer - SIN SUMMARY CARD */}
                <div className='p-4 space-y-2'>
                    <h4 className='text-zinc-500 text-xs font-bold uppercase mb-3 text-center'>
                        Menú Rápido
                    </h4>

                    <button
                        onClick={() => {
                            setActiveModal("student")
                        }}
                        className='w-full py-3 px-4 bg-zinc-800/50 hover:bg-zinc-800 hover:border-green-500/50 border border-transparent rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group'>
                        <Icons.User className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white flex-1'>
                            Info. Estudiante
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveModal("pensum")
                        }}
                        className='w-full py-3 px-4 bg-zinc-800/50 hover:bg-zinc-800 hover:border-green-500/50 border border-transparent rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group'>
                        <Icons.Book className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white flex-1'>
                            Ver Pensum Completo
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveModal("details")
                        }}
                        className='w-full py-3 px-4 bg-zinc-800/50 hover:bg-zinc-800 hover:border-green-500/50 border border-transparent rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group'>
                        <Icons.Info className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white flex-1'>
                            Detalles del Periodo
                        </span>
                    </button>


                    <button
                        onClick={() => {
                            setActiveModal("projection")
                        }}
                        className='w-full py-3 px-4 bg-zinc-800/50 hover:bg-zinc-800 hover:border-green-500/50 border border-transparent rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group'>
                        <Icons.Calculator className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white flex-1'>
                            Proyección de Índice
                        </span>
                    </button>


                    <button
                        onClick={() => {
                            setActiveModal("info")
                        }}
                        className='w-full py-3 px-4 bg-zinc-800/50 hover:bg-zinc-800 hover:border-green-500/50 border border-transparent rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group'>
                        <HelpCircle className='w-5 h-5 text-zinc-500 group-hover:text-green-400' />
                        <span className='text-gray-300 group-hover:text-white flex-1'>
                            Más Información
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveModal("logout")
                            onClose()
                        }}
                        className='w-full py-3 px-4 bg-red-900/10 hover:bg-red-900/30 hover:border-red-500/30 border border-transparent rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 group'>
                        <Icons.Logout className='w-5 h-5 text-red-500/70 group-hover:text-red-400' />
                        <span className='text-red-300/80 group-hover:text-red-200 flex-1'>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </aside>
        </>
    )
}
