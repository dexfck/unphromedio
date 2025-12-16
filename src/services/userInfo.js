// src/services/userInfo.js
import {API_CONFIG} from "./config"

export const getUserInfo = async () => {
    const storedUser = localStorage.getItem("user_display_data")

    if (storedUser) {
        return {data: JSON.parse(storedUser)}
    }

    return null
}
