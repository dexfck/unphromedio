// src/services/authSetup.js
import {API_CONFIG} from "./config"
import {loginWithCredentials, parseJwt} from "../utils/auth"

// Header temporal porque aún no se ha guardado en localStorage/config
const getTempHeaders = (token) => ({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
})

export const initializeSession = async (username, password) => {
    try {
        // 1. Obtener Token
        const token = await loginWithCredentials(username, password)
        if (!token) throw new Error("No se recibió token del servidor")

        // 2. Decodificar Token para obtener ID de Persona
        const decoded = parseJwt(token)
        const userPayload = decoded.user // id, names, career, etc.
        const userId = userPayload.id

        // 3. Obtener Información de Carrera (Necesitamos IdCarrera y IdPensum)
        const careerRes = await fetch(
            `${API_CONFIG.BASE_URL_GATEWAY}${API_CONFIG.CAREER_INFO_URL}?IdPersona=${userId}`,
            {headers: getTempHeaders(token)}
        )

        if (!careerRes.ok) throw new Error("Fallo al obtener info de carrera")

        const careerJson = await careerRes.json()
        // Tomamos la primera carrera del array (usualmente la activa)
        const activeCareer = careerJson.data?.[0]

        if (!activeCareer) throw new Error("El estudiante no tiene carrera asignada")

        // 4. Obtener Periodo Actual (Para el dashboard)
        const periodRes = await fetch(
            `${API_CONFIG.BASE_URL_GATEWAY}${API_CONFIG.CURRENT_PERIOD_URL}`,
            {headers: getTempHeaders(token)}
        )
        const periodJson = await periodRes.json()
        const currentPeriodData = periodJson.data?.[0]

        // 5. Estructurar datos de retorno
        return {
            token: token,
            userId: userId.toString(),
            studentCode: userPayload.username,
            // IDs críticos para las siguientes peticiones
            careerId: activeCareer.IdCarrera.toString(),
            pensumId: activeCareer.IdPensum.toString(),
            // Datos informativos
            currentYear: currentPeriodData?.year?.toString() || "2025",
            currentPeriod: currentPeriodData?.id?.toString() || "1",
            // Objeto de usuario visual
            userData: {
                id: userId,
                names: userPayload.names,
                username: userPayload.username,
                email: userPayload.email,
                career_name: activeCareer.Carrera,
                pensum_code: activeCareer.CodigoPensum,
                permissions: userPayload.permissions,
                picture: null,
            },
        }
    } catch (error) {
        throw error
    }
}
