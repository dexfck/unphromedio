import React from "react"
import {Icons} from "../ui/Icons.jsx"

function Logout({setActiveModal, onLogout}) {
    return (
        <div className='text-center p-6 md:p-8'>
            <div className='w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Icons.Logout className='w-8 h-8 text-red-500' />
            </div>
            <h4 className='text-xl font-bold text-white mb-2'>¿Estás seguro?</h4>
            <p className='text-zinc-400 mb-8 max-w-sm mx-auto'>
                Se borrarán los datos almacenados en este dispositivo.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                    onClick={() => setActiveModal(null)}
                    className='px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors border border-zinc-700 cursor-pointer'>
                    Cancelar
                </button>
                <button
                    onClick={onLogout}
                    className='px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105 cursor-pointer'>
                    Sí, Cerrar Sesión
                </button>
            </div>
        </div>
    )
}

export default Logout
