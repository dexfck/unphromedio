import React from "react"

function StudentInfo({user, shortName}) {
    return (
        /* Habilitar scroll interno */
        <div className='h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 pr-2'>
            <div className='flex flex-col md:flex-row gap-4 md:gap-8 items-start pb-4'>
                <div className='w-full md:w-1/3 flex flex-col items-center'>
                    <div className='w-32 h-32 rounded-lg overflow-hidden border-2 border-green-500 mb-4 shadow-lg shadow-green-500/20 bg-zinc-800 shrink-0'>
                        {user?.picture ? <img src={user.picture} alt='Profile' className='w-full h-full object-cover' referrerPolicy='no-referrer' /> : <div className='w-full h-full flex items-center justify-center text-4xl text-white font-bold'>{shortName.firstLetter}</div>}
                    </div>
                    <span className='px-3 py-1 bg-green-900/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold font-mono'>ACTIVO</span>
                </div>
                <div className='w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4'>
                    <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                        <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>Nombre Completo</p>
                        <p className='text-base font-medium text-white'>{user?.data?.first_name || user?.data?.names}</p>
                    </div>
                    <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                        <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>Matrícula</p>
                        <p className='text-base font-medium font-mono text-green-400'>{user?.data?.username}</p>
                    </div>
                    <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                        <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>Correo Institucional</p>
                        <p className='text-sm font-medium text-zinc-300 truncate' title={user?.data?.email}>
                            {user?.data?.email}
                        </p>
                    </div>
                    <div className='bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                        <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>Periodo Actual</p>
                        <p className='text-base font-medium text-white'>
                            {localStorage.getItem("auth_current_year")} - {localStorage.getItem("auth_current_period")}
                        </p>
                    </div>
                    <div className='col-span-1 md:col-span-2 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50'>
                        <p className='text-zinc-500 text-[10px] uppercase font-bold mb-1'>Carrera</p>
                        <p className='text-sm font-medium text-white'>{user?.data?.career_name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentInfo
