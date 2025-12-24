// Color manipulation utilities
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h: number, s: number, l: number): string {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b
    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Generate a complete color palette from a base color
export function generatePalette(baseColor: string) {
    const { h, s, l } = hexToHSL(baseColor)

    return {
        50: hslToHex(h, s * 0.9, 95),
        100: hslToHex(h, s * 0.95, 90),
        200: hslToHex(h, s, 80),
        300: hslToHex(h, s, 70),
        400: hslToHex(h, s, 60),
        500: baseColor, // Base color
        600: hslToHex(h, s, 45),
        700: hslToHex(h, s, 35),
        800: hslToHex(h, s, 25),
        900: hslToHex(h, s * 0.9, 15),
    }
}

// Get complementary color
export function getComplementary(hex: string): string {
    const { h, s, l } = hexToHSL(hex)
    return hslToHex((h + 180) % 360, s, l)
}

// Get analogous colors
export function getAnalogous(hex: string): string[] {
    const { h, s, l } = hexToHSL(hex)
    return [
        hslToHex((h - 30 + 360) % 360, s, l),
        hex,
        hslToHex((h + 30) % 360, s, l)
    ]
}

// Get triadic colors
export function getTriadic(hex: string): string[] {
    const { h, s, l } = hexToHSL(hex)
    return [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
    ]
}

// Check contrast ratio for accessibility
export function getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string) => {
        const rgb = parseInt(hex.slice(1), 16)
        const r = ((rgb >> 16) & 0xff) / 255
        const g = ((rgb >> 8) & 0xff) / 255
        const b = (rgb & 0xff) / 255

        const [rs, gs, bs] = [r, g, b].map(c =>
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        )

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
}

// Preset theme palettes
export const PRESET_THEMES = {
    midnight: {
        name: 'Midnight Black',
        primary: '#ffffff',
        secondary: '#111111',
        accent: '#d4af37',
        background: '#050505',
        surface: '#0a0a0a',
        text: '#ffffff',
    },
    platinum: {
        name: 'Ice Platinum',
        primary: '#e2e8f0',
        secondary: '#1e293b',
        accent: '#38bdf8',
        background: '#020617',
        surface: '#0f172a',
        text: '#f8fafc',
    },
    emerald: {
        name: 'Emerald Night',
        primary: '#10b981',
        secondary: '#064e3b',
        accent: '#34d399',
        background: '#022c22',
        surface: '#064e3b',
        text: '#ecfdf5',
    },
    royal: {
        name: 'Royal Gold',
        primary: '#d4af37',
        secondary: '#000000',
        accent: '#f9d976',
        background: '#050505',
        surface: '#0f0f0f',
        text: '#ffffff',
    },
    cyber: {
        name: 'Cyber Neon',
        primary: '#00ff88',
        secondary: '#000000',
        accent: '#bc13fe',
        background: '#050505',
        surface: '#111111',
        text: '#00ff88',
    }
}
