// src/utils/auth.js
import {API_CONFIG} from "../services/config"

// 1. Función de Login Directo (Usuario/Pass)
export const loginWithCredentials = async (username, password) => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL_GATEWAY}${API_CONFIG.LOGIN_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Credenciales incorrectas")
        }

        // Retorna el token string
        return data.data?.token?.token
    } catch (error) {
        console.error("Error en auth:", error)
        throw error
    }
}

// 2. Decodificador JWT (Sin librerías)
export const parseJwt = (token) => {
    try {
        if (!token) return null
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join("")
        )

        return JSON.parse(jsonPayload)
    } catch (e) {
        console.error("Error al decodificar JWT:", e)
        return null
    }
}
