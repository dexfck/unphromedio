import React from "react"

export const FullScreenLoader = ({isLoading}) => (
    <div
        className={`fixed inset-0 bg-zinc-900 flex flex-col items-center justify-center font-sans transition-all duration-700 ease-in-out z-[200] ${
            isLoading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}>
        <div className='relative flex items-center justify-center'>
            <div className='absolute animate-ping h-24 w-24 rounded-full bg-green-500/20 opacity-75'></div>
            <div className='relative animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'></div>
        </div>
        <p className='mt-8 text-green-500 font-bold tracking-widest text-lg animate-pulse'>
            CARGANDO UNPHROMEDIO...
        </p>
    </div>
)
