import React from "react"
import {PeriodDropdown} from "./PeriodDropdown"

export const Header = ({user, shortName, selectedPeriod, setSelectedPeriod}) => {
    return (
        <header className='col-span-2 bg-zinc-800 rounded-2xl flex items-center justify-between px-8 border border-zinc-700 shadow-xl z-50 relative'>
            <div className='bg-green-900/20 px-6 py-2 rounded-2xl border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]'>
                <h1 className='text-xl font-black tracking-widest text-green-500 font-sans'>
                    UNPHROMEDIO
                </h1>
            </div>

            <div className='absolute left-1/2 transform -translate-x-1/2 z-50'>
                <PeriodDropdown
                    selected={selectedPeriod}
                    options={Array.from({length: 12}, (_, i) => i + 1)}
                    onChange={setSelectedPeriod}
                />
            </div>

            <div className='flex items-center gap-4 bg-zinc-900/50 pr-6 pl-2 py-2 rounded-2xl border border-zinc-700 hover:border-zinc-600 transition-colors cursor-default'>
                <div className='h-10 w-10 rounded-xl flex items-center justify-center border-2 border-green-500 bg-zinc-800 text-green-500 font-bold overflow-hidden font-mono'>
                    {user?.picture && !user.picture.includes("googleusercontent") ? (
                        <img src={user.picture} alt='User' className='w-full h-full object-cover' />
                    ) : (
                        shortName.firstLetter
                    )}
                </div>
                <div className='flex flex-col'>
                    <span className='text-sm font-bold text-white leading-none capitalize font-sans'>
                        {shortName.splitted?.toLowerCase()}
                    </span>
                    <span className='text-[10px] text-zinc-400 mt-0.5 font-sans'>Estudiante</span>
                </div>
            </div>
        </header>
    )
}
