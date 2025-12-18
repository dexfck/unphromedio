import React, {useState} from "react"
import {useAuth} from "../context/AuthContext"

function Login() {
    const {login, loading} = useAuth()

    const [credentials, setCredentials] = useState({username: "", password: ""})
    const [errorMsg, setErrorMsg] = useState("")

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")

        if (!credentials.username || !credentials.password) {
            setErrorMsg("Por favor completa ambos campos.")
            return
        }

        const result = await login(credentials.username, credentials.password)

        if (!result.success) {
            setErrorMsg("Credenciales inválidas o error de conexión.")
        }
    }

    return (
        <div className='min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-green-500/30'>
            {/* Logo / Título Principal (MODIFICADO) */}
            <div className='mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700'>
                {/* Se eliminó el contenedor tipo botón (bg-green-900/20, border, etc.) */}
                <h1 className='text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-sans mb-3 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]'>
                    UNPHROMEDIO
                </h1>
                <p className='text-zinc-400 text-sm font-medium tracking-wider uppercase'>
                    Acceso Institucional
                </p>
            </div>

            {/* Tarjeta de Login */}
            <div className='w-full max-w-sm bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none'></div>
                <div className='relative z-10 flex flex-col gap-6'>
                    <div className='text-center'>
                        <h2 className='text-xl font-bold text-white font-sans'>Iniciar Sesión</h2>
                        <p className='text-zinc-500 text-xs mt-1'>
                            Usa tus credenciales de la UNPHU
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        {errorMsg && (
                            <div className='p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2'>
                                {errorMsg}
                            </div>
                        )}

                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider'>
                                Matrícula
                            </label>
                            <input
                                type='text'
                                name='username'
                                placeholder='Ej: ab12-3456'
                                className='w-full bg-zinc-950/50 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-zinc-700 font-mono'
                                value={credentials.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-zinc-400 ml-1 uppercase tracking-wider'>
                                Contraseña
                            </label>
                            <input
                                type='password'
                                name='password'
                                placeholder='••••••••'
                                className='w-full bg-zinc-950/50 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-zinc-700'
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className={`mt-4 w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95
                                ${
                                    loading
                                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/30 hover:shadow-green-900/50"
                                }
                            `}>
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <svg
                                        className='animate-spin h-4 w-4 text-white'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'>
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Validando...
                                </span>
                            ) : (
                                "Entrar al Sistema"
                            )}
                        </button>
                    </form>

                    {/* Disclaimer */}
                    <div className='pt-4 border-t border-zinc-800/50 text-center'>
                        <p className='text-[10px] text-zinc-500 leading-tight flex items-center justify-center gap-2'>
                            
                            <span>
                                Al iniciar sesión, tus datos no estan siendo comprometidos, ya que
                                la app está directamente conectada con el sistema de la UNPHU.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
