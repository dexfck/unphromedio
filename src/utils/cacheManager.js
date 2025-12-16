// src/utils/cacheManager.js

const CACHE_PREFIX = "unphromedio_v1_"

export const cacheManager = {
    // Guardar datos
    set: (key, data) => {
        try {
            const item = {
                data: data,
                timestamp: Date.now(),
            }
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item))
        } catch (error) {
            console.error("Error guardando en caché:", error)
        }
    },

    // Obtener datos
    get: (key) => {
        try {
            const stored = localStorage.getItem(CACHE_PREFIX + key)
            if (!stored) return null

            const item = JSON.parse(stored)
            // Aquí podrías agregar lógica de expiración (ej: 24 horas) si quisieras
            // Por ahora es permanente hasta que se refresque manual
            return item.data
        } catch (error) {
            return null
        }
    },

    // Borrar una key específica (para el botón de actualizar)
    remove: (key) => {
        localStorage.removeItem(CACHE_PREFIX + key)
    },

    // Borrar todo (opcional para logout)
    clearAll: () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key)
            }
        })
    },
}
