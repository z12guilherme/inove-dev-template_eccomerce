'use client'
import { useEffect } from 'react'

const THEME_KEY = 'inove_theme'

export const defaultTheme = {
    primary:      '#16a34a',
    primaryLight: '#bbf7d0',
    primaryMid:   '#86efac',
    primaryDark:  '#15803d',
    accent:       '#1e293b',
}

export function applyTheme(theme) {
    const root = document.documentElement
    root.style.setProperty('--brand-primary',       theme.primary)
    root.style.setProperty('--brand-primary-light', theme.primaryLight)
    root.style.setProperty('--brand-primary-mid',   theme.primaryMid)
    root.style.setProperty('--brand-primary-dark',  theme.primaryDark)
    root.style.setProperty('--brand-accent',        theme.accent)
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
