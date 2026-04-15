'use client'
import { useEffect } from 'react'

const THEME_KEY = 'inove_theme'

export const defaultTheme = {
    primary:      '#16a34a',
    primaryLight: '#bbf7d0',
    primaryMid:   '#86efac',
    primaryDark:  '#15803d',
    accent:       '#1e293b',
    fontPrimary:  'Inter',
    borderRadius: '0.5rem',
}

export function applyTheme(theme) {
    const root = document.documentElement
    root.style.setProperty('--brand-primary',       theme.primary)
    root.style.setProperty('--brand-primary-light', theme.primaryLight)
    root.style.setProperty('--brand-primary-mid',   theme.primaryMid)
    root.style.setProperty('--brand-primary-dark',  theme.primaryDark)
    root.style.setProperty('--brand-accent',        theme.accent)
    
    if (theme.fontPrimary) {
        root.style.setProperty('--font-primary', `"${theme.fontPrimary}", sans-serif`)
        if (typeof document !== 'undefined') {
            const fontName = theme.fontPrimary.replace(/\s+/g, '+')
            const fontId = `google-font-${fontName}`
            if (!document.getElementById(fontId)) {
                const link = document.createElement('link')
                link.id = fontId
                link.rel = 'stylesheet'
                link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`
                document.head.appendChild(link)
            }
        }
    }

    if (theme.borderRadius !== undefined) {
        root.style.setProperty('--radius-global', theme.borderRadius)
    }
}

export function getStoredTheme() {
    try {
        const raw = localStorage.getItem(THEME_KEY)
        return raw ? { ...defaultTheme, ...JSON.parse(raw) } : defaultTheme
    } catch {
        return defaultTheme
    }
}

export function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme))
    applyTheme(theme)
    window.dispatchEvent(new Event('storage'))
}

export default function ThemeProvider() {
    useEffect(() => {
        applyTheme(getStoredTheme())
    }, [])

    return null
}
