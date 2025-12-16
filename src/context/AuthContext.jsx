// src/context/AuthContext.js
import React, {createContext, useContext, useState, useEffect} from "react"
import {initializeSession} from "../services/authSetup"
import {useNavigate} from "react-router-dom"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user_display_data")
        const token = localStorage.getItem("auth_token")

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Error parseando usuario local", e)
                localStorage.clear()
            }
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        setLoading(true)
        try {
            // Llamamos al AuthSetup que hace toda la cadena de peticiones
            const sessionData = await initializeSession(username, password)

            // Guardamos TODAS las claves necesarias para config.js
            localStorage.setItem("auth_token", sessionData.token)
            localStorage.setItem("auth_user_id", sessionData.userId)
            localStorage.setItem("auth_student_code", sessionData.studentCode)
            localStorage.setItem("auth_career_id", sessionData.careerId)
            localStorage.setItem("auth_pensum_id", sessionData.pensumId)
            localStorage.setItem("auth_current_year", sessionData.currentYear)
            localStorage.setItem("auth_current_period", sessionData.currentPeriod)

            // Guardamos datos visuales para la UI
            localStorage.setItem("user_display_data", JSON.stringify(sessionData.userData))

            setUser(sessionData.userData)
            navigate("/")
            return {success: true}
        } catch (error) {
            console.error("Login Error:", error)
            localStorage.clear()
            return {success: false, message: error.message}
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.clear()
        sessionStorage.clear()
        setUser(null)
        navigate("/login")
    }

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
