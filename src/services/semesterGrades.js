import {API_CONFIG, getAuthHeaders} from "./config"

export const getSemesterGrades = async (selectedPeriodNumber = API_CONFIG.CURRENT_PERIOD) => {
    try {
        const userId = API_CONFIG.USER_ID
        const careerId = API_CONFIG.CAREER_ID
        const currentYear = API_CONFIG.CURRENT_YEAR
        const periodId = selectedPeriodNumber

        if (!userId || !careerId) return {data: []}

        const url = `${API_CONFIG.BASE_URL_GATEWAY}${API_CONFIG.SEMESTER_GRADES_URL}?Ano=${currentYear}&IdPersona=${userId}&IdPeriodo=${periodId}&IdCarrera=${careerId}`


        const response = await fetch(url, {
            headers: getAuthHeaders(),
        })

        if (!response.ok) throw new Error("Error fetching semester grades")

        const json = await response.json()

        return {data: json.data || []}
    } catch (error) {
        return {data: []}
    }
}
