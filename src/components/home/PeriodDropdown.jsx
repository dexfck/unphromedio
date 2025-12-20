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
        <div className={`relative ${w ? w : 'w-64'} z-60`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-zinc-900 border ${
                    isOpen ? "border-green-500" : "border-zinc-700"
                } text-white py-2 px-4 rounded-lg flex items-center justify-between font-bold font-sans transition-all hover:border-green-500/50 cursor-pointer`}>
                <span>Periodo {selected}</span>
                <Icons.ChevronDown
                    className={`w-4 h-4 text-green-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 hover:scrollbar-thumb-zinc-600 animate-in slide-in-from-top-2 duration-150 z-[100]'>
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onChange(opt)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-zinc-800 cursor-pointer
                                ${
                                    selected === opt
                                        ? "text-green-400 bg-zinc-800/50"
                                        : "text-zinc-300"
                                }
                            `}>
                            Periodo {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
