import React, {useState, useEffect, useRef} from "react"
import {Icons} from "../ui/Icons"

export const PeriodDropdown = ({selected, options, onChange, w}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={` ${w ? w : "w-fit"}`} ref={dropdownRef}>
            {/* Botón Trigger */}
            <button onClick={() => setIsOpen(!isOpen)} className={`w-full bg-zinc-900 border ${isOpen ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "border-zinc-700"} text-white py-2 px-4 rounded-lg flex items-center justify-between font-bold font-sans transition-all duration-200 hover:border-green-500/50 cursor-pointer active:scale-[0.99]`}>
                <span>Periodo {selected}</span>
                <Icons.ChevronDown className={`w-4 h-4 text-green-500 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Menú Desplegable */}
            {isOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-100 origin-top divide-y divide-zinc-700/40'>
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onChange(opt)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-between group
                                ${selected === opt ? "text-green-400 bg-green-500/10" : "text-zinc-300 hover:bg-white/5 hover:text-white"}
                            `}>
                            <span>Periodo {opt}</span>
                            {selected === opt && <div className='w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]'></div>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
