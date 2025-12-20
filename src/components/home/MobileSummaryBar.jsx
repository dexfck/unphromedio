import React from "react"

export const MobileSummaryBar = ({periodInfo}) => {
    const isCursando = periodInfo.status === "Cursando"

    // Estilos dinámicos basados en el estado
    const containerClasses = isCursando
        ? "border-green-500/30 shadow-[0_-4px_20px_-5px_rgba(34,197,94,0.2)]"
        : "border-zinc-700 shadow-lg"

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 bg-[#121214]/95 backdrop-blur-xl ${containerClasses} p-4 z-50 lg:hidden pb-safe`}>
            <div className='flex items-center justify-between max-w-md mx-auto'>
                {/* Izquierda: Periodo y Estado */}
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2 mb-1'>
                        <span className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest'>
                            Periodo {periodInfo.period}
                        </span>
                        <div
                            className={`px-2 py-0.5 rounded-lg-lg text-[9px] font-black uppercase tracking-wider ${
                                isCursando ? "bg-green-500 text-black" : "bg-blue-600 text-white"
                            }`}>
                            {periodInfo.status}
                        </div>
                    </div>
                    <div className='flex items-baseline gap-1'>
                        <span className='text-2xl font-black text-white leading-none'>
                            {periodInfo.credits}
                        </span>
                        <span className='text-[10px] text-zinc-400 font-medium'>Créditos</span>
                    </div>
                </div>

                {/* Derecha: Promedio (Tarjeta Verde) */}
                <div className='bg-linear-to-br from-green-600 to-emerald-800 px-5 py-2 roundex-lg border border-green-500/50 shadow-lg flex flex-col items-center min-w-[100px]'>
                    <span className='text-[9px] font-bold text-green-100 uppercase tracking-widest mb-0.5'>
                        Promedio
                    </span>
                    <span className='text-3xl font-black text-white leading-none tracking-tight font-mono drop-shadow-md'>
                        {periodInfo.average}
                    </span>
                </div>
            </div>
        </div>
    )
}
