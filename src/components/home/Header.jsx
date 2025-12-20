import React from "react"
import {PeriodDropdown} from "./PeriodDropdown"
import {Menu} from "lucide-react"

export const Header = ({user, shortName, selectedPeriod, setSelectedPeriod, onMenuClick, isMobile}) => {
    if (isMobile) {
        // VERSIÓN MÓVIL con dropdown centrado
        return (
            <header className='bg-zinc-800 rounded-lg flex items-center justify-between px-4 py-3 border border-zinc-700 shadow-xl relative shrink-0'>
                <button onClick={onMenuClick} className='p-2 bg-zinc-900 border border-zinc-700  rounded-lg z-10'>
                    <Menu className='w-6 h-6  text-green-500' />
                </button>

                {/* Dropdown centrado con z-index alto */}
                <div className='z-60 '>
                    <PeriodDropdown selected={selectedPeriod} options={Array.from({length: 12}, (_, i) => i + 1)} onChange={setSelectedPeriod} />
                </div>
            </header>
        )
    }

    // VERSIÓN DESKTOP
    return (
        <header className='col-span-2 bg-zinc-800 rounded-lg flex items-center justify-between px-8 border border-zinc-700 shadow-xl z-50 relative'>
            <div>
                <h1 className='text-2xl font-black tracking-widest text-green-500 font-sans select-none'>UNPHROMEDIO</h1>
            </div>

            <div className='absolute left-1/2 transform -translate-x-1/2 z-50'>
                <PeriodDropdown selected={selectedPeriod} options={Array.from({length: 12}, (_, i) => i + 1)} onChange={setSelectedPeriod} />
            </div>

            <div className='flex items-center gap-4 bg-zinc-900/50 pr-6 pl-2 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors cursor-default'>
                <div className='h-10 w-10 rounded-lg flex items-center justify-center border border-green-500 bg-zinc-800 text-green-500 font-bold overflow-hidden font-mono'>{user?.picture && !user.picture.includes("googleusercontent") ? <img src={user.picture} alt='User' className='w-full h-full object-cover' /> : shortName.firstLetter}</div>
                <div className='flex flex-col'>
                    <span className='text-sm font-bold text-white leading-none capitalize font-sans'>{shortName.splitted?.toLowerCase()}</span>
                    <span className='text-[10px] text-zinc-400 mt-0.5 font-sans'>Estudiante</span>
                </div>
            </div>
        </header>
    )
}
