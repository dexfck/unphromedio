import React from "react"
import {Icons} from "./Icons"

export const Modal = ({isOpen, onClose, title, children, className}) => {
    if (!isOpen) return null
    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity'>
            <div
                className={`bg-zinc-900 border border-zinc-800 w-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 ${
                    className || "max-w-4xl"
                }`}>
                <div className='p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-2xl'>
                    <h3 className='text-xl font-bold text-white font-sans'>{title}</h3>
                    <button
                        onClick={onClose}
                        className='text-zinc-400 hover:text-white transition-colors cursor-pointer'>
                        <Icons.Close className='w-6 h-6' />
                    </button>
                </div>

                <div className='p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-600 flex-1'>
                    {children}
                </div>
            </div>
        </div>
    )
}
