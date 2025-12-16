import {API_CONFIG, getAuthHeaders} from "./config"

export const getCurrentPeriod = async () => {
    try {
        const url = `${API_CONFIG.BASE_URL_GATEWAY}/legacy/get-current-period`

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Fallo al obtener el periodo actual:", error)
        return null
    }
}
