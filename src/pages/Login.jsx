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
            <div className='mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700'>
                <div className='inline-block bg-green-900/20 px-8 py-3 rounded-2xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)] mb-6'>
                    <h1 className='text-3xl font-black tracking-widest text-green-500 font-sans'>
                        UNPHROMEDIO
                    </h1>
                </div>
                <p className='text-zinc-400 text-sm font-medium'>Acceso Institucional</p>
            </div>

            <div className='w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden'>
                <div className='relative z-10 flex flex-col gap-6'>
                    <div className='text-center'>
                        <h2 className='text-xl font-bold text-white font-sans'>Iniciar Sesión</h2>
                        <p className='text-zinc-500 text-xs mt-1'>
                            Usa tus credenciales de la UNPHU
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        {errorMsg && (
                            <div className='p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-medium'>
                                {errorMsg}
                            </div>
                        )}

                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-zinc-400 ml-1'>
                                Matrícula
                            </label>
                            <input
                                type='text'
                                name='username'
                                placeholder='Ej: ab12-3456'
                                className='w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-zinc-700'
                                value={credentials.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-zinc-400 ml-1'>
                                Contraseña
                            </label>
                            <input
                                type='password'
                                name='password'
                                placeholder='••••••••'
                                className='w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-zinc-700'
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className={`mt-2 w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg
                                ${
                                    loading
                                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20 hover:scale-[1.02]"
                                }
                            `}>
                            {loading ? "Validando..." : "Entrar"}
                        </button>
                    </form>

                    {/* DISCLAIMER SOLICITADO */}
                    <div className='pt-2 border-t border-zinc-800/50 text-center'>
                        <p className='text-[10px] text-zinc-600 leading-tight'>
                            Todos los datos de registro se envían directamente a la UNPHU, sus datos
                            están resguardados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
