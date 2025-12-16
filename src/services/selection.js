// src/services/selection.js
import {API_CONFIG, getAuthHeaders} from "./config"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const getSelection = async () => {
    const CACHE_KEY = "pensum_cache_v1"

    if (!API_CONFIG.PENSUM_ID) {
        return null
    }

    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
        return JSON.parse(cached)
    }

    try {
        const endpoint = "/student-service-v2/pensum/subject-detail"
        const periods = Array.from({length: 12}, (_, i) => i + 1)
        const structuredData = {}

        for (const period of periods) {
            const params = new URLSearchParams({
                pensum: API_CONFIG.PENSUM_ID,
                period: period.toString(),
            })

            try {
                const response = await fetch(
                    `${API_CONFIG.BASE_URL_GATEWAY}${endpoint}?${params.toString()}`,
                    {
                        method: "GET",
                        headers: getAuthHeaders(),
                    }
                )

                if (response.ok) {
                    const json = await response.json()
                    if (json.data && json.data.length > 0) {
                        structuredData[period] = json.data
                    }
                }
            } catch (err) {
                console.error(`Error en periodo ${period}`, err)
            }
            await delay(150)
        }

        if (Object.keys(structuredData).length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(structuredData))
            return structuredData
        }

        return null
    } catch (error) {
        return null
    }
}
