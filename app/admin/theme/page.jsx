'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { BUSINESS_PRESETS } from '@/lib/businessPresets'
import { applyTheme, getStoredTheme, defaultTheme, saveTheme } from '@/lib/themeProvider'
import { PaletteIcon } from 'lucide-react'

const FIELDS = [
    { key: 'primary', label: 'Cor Principal', hint: 'Botões, links e destaques principais' },
    { key: 'primaryLight', label: 'Cor Principal (Clara)', hint: 'Fundos suaves e cards de destaque' },
    { key: 'primaryMid', label: 'Cor Principal (Média)', hint: 'Badges e elementos intermediários' },
    { key: 'primaryDark', label: 'Cor Principal (Escura)', hint: 'Hover e estados ativos' },
    { key: 'accent', label: 'Cor de Destaque (Texto)', hint: 'Títulos e botões escuros' },
    { key: 'card2Bg', label: 'Fundo Banner 2', hint: 'Fundo do card secundário' },
    { key: 'card2Text', label: 'Texto Banner 2', hint: 'Cor final do gradiente no texto' },
    { key: 'card3Bg', label: 'Fundo Banner 3', hint: 'Fundo do card terciário' },
    { key: 'card3Text', label: 'Texto Banner 3', hint: 'Cor final do gradiente no texto' },
]

export default function ThemeSettings() {
    const [theme, setTheme] = useState(defaultTheme)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTheme(getStoredTheme())
        setLoading(false)
    }, [])

    const handleChange = (key, value) => {
        const next = { ...theme, [key]: value }
        setTheme(next)
        applyTheme(next) // preview ao vivo
    }

    const handlePreset = (preset) => {
        const next = { ...theme, ...preset.theme }
        setTheme(next)
        applyTheme(next) // preview ao vivo
        toast(`Paleta "${preset.label}" aplicada como prévia — clique em Salvar para confirmar.`, { icon: '🎨' })
    }

    const handleSave = () => {
        saveTheme(theme)
        toast.success('Paleta de cores salva com sucesso!')
    }

    const handleReset = () => {
        setTheme(defaultTheme)
        applyTheme(defaultTheme)
        toast('Cores restauradas para o padrão.', { icon: '🔄' })
    }

    if (loading) return <div className="text-slate-400 p-6">Carregando...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl text-slate-500">
                        Configurações de <span className="text-slate-800 font-medium">Tema</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Gerencie a paleta de cores e tipografia da sua loja</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleReset} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm">
                        Restaurar Padrão
                    </button>
                    <button onClick={handleSave} className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm text-sm">
                        Salvar Alterações
                    </button>
                </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <p className="text-sm text-amber-800">
                    <span className="font-bold">Atenção:</span> Aplicar um modelo substituirá suas cores e textos atuais. Uma confirmação será solicitada.
                </p>
            </div>

            {/* Paletas Predefinidas */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="flex items-center gap-2 text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">
                    <PaletteIcon size={15} /> Paletas Predefinidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {BUSINESS_PRESETS.map(preset => (
                        <button
                            key={preset.id}
                            onClick={() => handlePreset(preset)}
                            className="flex flex-col gap-2 border border-slate-200 hover:border-green-500 rounded-lg p-4 text-sm transition group text-left"
                        >
                            <span className="font-semibold text-slate-800">{preset.emoji} {preset.label}</span>
                            <div className="flex gap-1.5 mt-2">
                                {[preset.theme.primary, preset.theme.primaryMid, preset.theme.primaryLight, preset.theme.accent].map((c, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cores Personalizadas */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">Personalizar Cores</h2>
                <div className="space-y-5">
                    {FIELDS.map(({ key, label, hint }) => {
                        const val = theme[key] || ({ card2Bg: '#fed7aa', card2Text: '#ffad51', card3Bg: '#bfdbfe', card3Text: '#78b2ff' })[key] || '#000000';
                        return (
                            <div key={key} className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                    <input
                                        type="color"
                                        id={`color-${key}`}
                                        value={val}
                                        onChange={e => handleChange(key, e.target.value)}
                                        className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label htmlFor={`color-${key}`} className="block text-sm font-medium text-slate-700 mb-0.5 cursor-pointer">{label}</label>
                                    <p className="text-xs text-slate-400">{hint}</p>
                                </div>
                                <input
                                    type="text"
                                    value={val}
                                    onChange={e => {
                                        if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleChange(key, e.target.value)
                                    }}
                                    maxLength={7}
                                    className="w-24 p-2 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-green-500 transition text-center"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tipografia e Formato */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">Tipografia & Geometria</h2>

                {/* Fonte Principal */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Família de Fonte</label>
                    <select
                        value={theme.fontPrimary || 'Inter'}
                        onChange={e => handleChange('fontPrimary', e.target.value)}
                        className="w-full max-w-sm p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 text-sm text-slate-700"
                    >
                        <option value="Inter">Inter (Design Moderno)</option>
                        <option value="Roboto">Roboto (Clássica do Google)</option>
                        <option value="Outfit">Outfit (Tecnológica e Limpa)</option>
                        <option value="Playfair Display">Playfair Display (Luxo / Serif)</option>
                        <option value="Merriweather">Merriweather (Clássica Serif)</option>
                    </select>
                    <p className="mt-1.5 text-xs text-slate-400">Ao selecionar, a fonte é importada automaticamente do Google Fonts.</p>
                </div>

                {/* Arredondamento */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Arredondamento Padrão de Bordas</label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { label: 'Quadradas', value: '0rem' },
                            { label: 'Suaves', value: '0.25rem' },
                            { label: 'Padrão', value: '0.5rem' },
                            { label: 'Arredondadas', value: '1rem' },
                        ].map(border => {
                            const isSelected = theme.borderRadius === border.value || (!theme.borderRadius && border.value === '0.5rem')
                            return (
                                <button
                                    key={border.value}
                                    onClick={() => handleChange('borderRadius', border.value)}
                                    className={`px-5 py-3 border text-sm transition shadow-sm ${isSelected ? 'border-green-500 bg-green-50 text-green-700 font-medium ring-2 ring-green-100' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'}`}
                                    style={{ borderRadius: border.value }}
                                >
                                    {border.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h2 className="text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">Pré-visualização</h2>
                <div className="flex flex-wrap gap-3 items-center">
                    <button style={{ backgroundColor: theme.primary }} className="text-white text-sm px-5 py-2.5 rounded-lg font-medium shadow-sm">
                        Botão Principal
                    </button>
                </div>
            </div>
        </div>
    )
}