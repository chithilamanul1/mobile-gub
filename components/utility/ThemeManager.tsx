"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ThemeManager() {
    const pathname = usePathname()

    useEffect(() => {
        const checkSeason = () => {
            const today = new Date()
            const month = today.getMonth() + 1 // 1-12
            const day = today.getDate()

            const root = document.documentElement

            // Remove existing theme classes
            root.classList.remove("theme-christmas", "theme-avurudu")

            // Christmas: Dec 1 - Dec 31
            if (month === 12) {
                root.classList.add("theme-christmas")
                console.log("Applying Christmas Theme")
            }

            // Sinhala Avurudu: April 1 - April 20
            if (month === 4 && day <= 20) {
                root.classList.add("theme-avurudu")
                console.log("Applying Avurudu Theme")
            }
        }

        checkSeason()
    }, [pathname])

    return null
}
