
export const API_CONFIG = {
    // URL Base
    BASE_URL_GATEWAY:
        import.meta.env.API_URL || "https://client-api-gateway.unphusist.unphu.edu.do",

    // Endpoints
    LOGIN_URL: "/student-login/login",
    CAREER_INFO_URL: "/legacy/get-student-careers/",
    PENDING_GRADES_URL: "/legacy/pending-grades-students/",
    CURRENT_PERIOD_URL: "/legacy/get-current-period",
    SEMESTER_GRADES_URL: "/legacy/semester-grades/",

    // Getters dinámicos
    get TOKEN() {
        return localStorage.getItem("auth_token") || ""
    },
    get USER_ID() {
        return localStorage.getItem("auth_user_id") || ""
    },
    get CAREER_ID() {
        return localStorage.getItem("auth_career_id") || ""
    },
    get PENSUM_ID() {
        return localStorage.getItem("auth_pensum_id") || ""
    },
    get STUDENT_CODE() {
        return localStorage.getItem("auth_student_code") || ""
    },
    get CURRENT_YEAR() {
        return localStorage.getItem("auth_current_year") || ""
    },
    get CURRENT_PERIOD() {
        return localStorage.getItem("auth_current_period") || ""
    },
}

export const getAuthHeaders = () => {
    const rawToken = API_CONFIG.TOKEN
    const token = rawToken ? (rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`) : ""
    return {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: token,
    }
}
