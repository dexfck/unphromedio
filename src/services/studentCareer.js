import {API_CONFIG, getAuthHeaders} from "./config"

export const getStudentCareer = async () => {
    try {
        const endpoint = "/legacy/get-student-careers/"
        const params = new URLSearchParams({
            IdPersona: API_CONFIG.USER_ID,
        })

        const url = `${API_CONFIG.BASE_URL_GATEWAY}${endpoint}?${params.toString()}`

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Fallo al obtener carrera del estudiante:", error)
        return null
    }
}
