export const processGrades = (rawData) => {
    if (!rawData || !Array.isArray(rawData))
        return {processedData: [], dynamicHeaders: [], totalCredits: 0}

    const ALLOWED_RUBROS = [
        "RU",
        "TP",
        "PP1",
        "PP2",
        "EF",
        "Modulo1",
        "Modulo2",
        "Modulo3",
        "Modulo4",
    ]

    const grouped = rawData.reduce((acc, item) => {
        const key = item.codGroup

        if (!acc[key]) {
            acc[key] = {
                fullGroupCode: item.codGroup,
                subject: item.course,
                credits: item.credits,
                letter: item.letter,
                rubrics: {},
            }
        }

        const rubroKey = item.codRubro
        // Normalizar rubros: Busca si 'pp1' existe en el array ALLOWED_RUBROS (que tiene 'PP1')
        const officialKey = ALLOWED_RUBROS.find((r) => r.toLowerCase() === rubroKey.toLowerCase())

        if (officialKey) {
            if (item.assignedPoints && item.assignedPoints !== "NR") {
                // Aquí se guardará como 'PP1' aunque la API mande 'Pp1'
                acc[key].rubrics[officialKey] = item.assignedPoints
            }
        }

        return acc
    }, {})

    const processedData = Object.values(grouped).map((item) => {
        const r = item.rubrics

        // Lógica NFA
        let ppSum = 0
        let ppCount = 0
        // Ahora buscamos 'PP1' y 'PP2' (Mayúsculas)
        if (r["PP1"] && !isNaN(parseFloat(r["PP1"]))) {
            ppSum += parseFloat(r["PP1"])
            ppCount++
        }
        if (r["PP2"] && !isNaN(parseFloat(r["PP2"]))) {
            ppSum += parseFloat(r["PP2"])
            ppCount++
        }

        const promedioParciales = ppCount > 0 ? ppSum / ppCount : null

        let otherSum = 0
        let otherCount = 0
        // Usamos Keys mayúsculas en el array de búsqueda
        ;["TP", "EF", "RU", "Modulo1", "Modulo2", "Modulo3", "Modulo4"].forEach((key) => {
            if (r[key] && !isNaN(parseFloat(r[key]))) {
                otherSum += parseFloat(r[key])
                otherCount++
            }
        })

        let finalNumerator = otherSum
        let finalDenominator = otherCount

        if (promedioParciales !== null) {
            finalNumerator += promedioParciales
            finalDenominator += 1
        }

        let nfa = 0
        if (finalDenominator > 0) {
            nfa = finalNumerator / finalDenominator
        }

        // Cálculo Literal (0-4 Puntos)
        let calculatedLetter = "EC"

        if (nfa > 0) {
            const score = Math.round(nfa)
            if (score >= 90) calculatedLetter = "A"
            else if (score >= 80) calculatedLetter = "B"
            else if (score >= 70) calculatedLetter = "C"
            else if (score >= 60) calculatedLetter = "D"
            else calculatedLetter = "F"
        }

        return {
            ...item,
            nfa: nfa,
            calculatedLetter: calculatedLetter,
        }
    })

    const foundRubros = new Set()
    processedData.forEach((item) => {
        Object.keys(item.rubrics).forEach((r) => foundRubros.add(r))
    })

    const dynamicHeaders = ALLOWED_RUBROS.filter((r) => foundRubros.has(r))
    const totalCredits = processedData.reduce((sum, item) => sum + item.credits, 0)

    return {processedData, dynamicHeaders, totalCredits}
}
