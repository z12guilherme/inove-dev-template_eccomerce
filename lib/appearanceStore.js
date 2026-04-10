'use client'
import { useEffect } from 'react'
import { defaultTheme, applyTheme, getStoredTheme, saveTheme } from './themeProvider'

// ── Fontes disponíveis (pré-carregadas via Google Fonts no editor) ─────────────
export const AVAILABLE_FONTS = [
    { name: 'Outfit',     label: 'Outfit',      sample: 'Moderno e clean' },
    { name: 'Inter',      label: 'Inter',        sample: 'Neutro e legível' },
    { name: 'Poppins',    label: 'Poppins',      sample: 'Geométrico e amigável' },
    { name: 'Nunito',     label: 'Nunito',       sample: 'Arredondado e jovial' },
    { name: 'Raleway',    label: 'Raleway',      sample: 'Elegante e sofisticado' },
    { name: 'Montserrat', label: 'Montserrat',   sample: 'Forte e editorial' },
]

const APPEARANCE_KEY = 'inove_appearance'

export const defaultAppearance = {
    // Hero
    heroHeadline:     'Gadgets que você vai amar. Preços que você vai confiar.',
    heroBadgeLabel:   'NOVIDADE',
    heroBadgeText:    'Frete Grátis em Pedidos Acima de R$ 50!',
    heroStartingPrice: '99.90',
    heroButtonText:   'SAIBA MAIS',
    heroCardTitle1:   'Melhores produtos',
    heroCardTitle2:   '20% de desconto',

    // Tipografia
    fontFamily: 'Outfit',
}

// ── Leitura ───────────────────────────────────────────────────────────────────
export function getAppearance() {
    try {
        const raw = localStorage.getItem(APPEARANCE_KEY)
        return raw ? { ...defaultAppearance, ...JSON.parse(raw) } : defaultAppearance
    } catch {
        return defaultAppearance
    }
}

// ── Aplicação (sem salvar — para preview ao vivo) ─────────────────────────────
export function applyFont(fontFamily) {
    // Remove link anterior se existir
    document.getElementById('dynamic-font-link')?.remove()

    const link = document.createElement('link')
    link.id = 'dynamic-font-link'
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)

    document.body.style.fontFamily = `'${fontFamily}', sans-serif`
}

// ── Salvar tudo (aparência + tema de cores) ────────────────────────────────────
export function saveAppearance(appearance, theme) {
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearance))
    saveTheme(theme)           // cores
    applyFont(appearance.fontFamily)
    window.dispatchEvent(new Event('storage'))  // notifica outros componentes
}

// ── Provider (aplica na montagem) ─────────────────────────────────────────────
export default function AppearanceProvider() {
    useEffect(() => {
        applyTheme(getStoredTheme())
        applyFont(getAppearance().fontFamily)
    }, [])
    return null
}
