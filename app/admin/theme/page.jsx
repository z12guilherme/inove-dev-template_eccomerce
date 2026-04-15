'use client'
import React, { useState, useEffect } from 'react'
import { SaveIcon, RotateCcwIcon, PaletteIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { defaultTheme, getStoredTheme, saveTheme, applyTheme } from '@/lib/themeProvider'

const PRESETS = [
    {
        name: 'Verde (Padrão)',
        colors: { primary: '#16a34a', primaryLight: '#bbf7d0', primaryMid: '#86efac', primaryDark: '#15803d', accent: '#1e293b' },
    },
    {
        name: 'Azul Royal',
        colors: { primary: '#2563eb', primaryLight: '#dbeafe', primaryMid: '#93c5fd', primaryDark: '#1d4ed8', accent: '#1e293b' },
    },
    {
        name: 'Roxo',
        colors: { primary: '#7c3aed', primaryLight: '#ede9fe', primaryMid: '#c4b5fd', primaryDark: '#6d28d9', accent: '#1e293b' },
    },
    {
        name: 'Rosa',
        colors: { primary: '#db2777', primaryLight: '#fce7f3', primaryMid: '#f9a8d4', primaryDark: '#be185d', accent: '#1e293b' },
    },
    {
        name: 'Laranja',
        colors: { primary: '#ea580c', primaryLight: '#ffedd5', primaryMid: '#fdba74', primaryDark: '#c2410c', accent: '#1e293b' },
    },
    {
        name: 'Teal',
        colors: { primary: '#0d9488', primaryLight: '#ccfbf1', primaryMid: '#5eead4', primaryDark: '#0f766e', accent: '#1e293b' },
    },
]

const FIELDS = [
    { key: 'primary',      label: 'Cor Principal',          hint: 'Botões, links e destaques principais' },
    { key: 'primaryLight', label: 'Cor Principal (Clara)',   hint: 'Fundos suaves e cards de destaque' },
    { key: 'primaryMid',   label: 'Cor Principal (Média)',   hint: 'Badges e elementos intermediários' },
    { key: 'primaryDark',  label: 'Cor Principal (Escura)',  hint: 'Hover e estados ativos' },
    { key: 'accent',       label: 'Cor de Destaque (Texto)', hint: 'Títulos e botões escuros' },
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
        setTheme(preset.colors)
        applyTheme(preset.colors) // preview ao vivo
        toast(`Paleta "${preset.name}" aplicada como prévia — clique em Salvar para confirmar.`, { icon: '🎨' })
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
        <div className="text-slate-500 mb-28 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
                <h1 className="text-2xl">Paleta de <span className="text-slate-800 font-medium">Cores</span></h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-medium py-2 px-4 rounded-lg transition text-sm"
                    >
                        <RotateCcwIcon size={15} /> Restaurar Padrão
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-5 rounded-lg transition shadow-sm text-sm"
                    >
                        <SaveIcon size={15} /> Salvar
                    </button>
                </div>
            </div>

            {/* Paletas Predefinidas */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="flex items-center gap-2 text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">
                    <PaletteIcon size={15} /> Paletas Predefinidas
                </h2>
                <div className="flex flex-wrap gap-3">
                    {PRESETS.map(preset => (
                        <button
                            key={preset.name}
                            onClick={() => handlePreset(preset)}
                            className="flex items-center gap-2 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-2 text-sm transition group"
                        >
                            <span
                                className="w-5 h-5 rounded-full border border-white shadow-sm shrink-0"
                                style={{ backgroundColor: preset.colors.primary }}
                            />
                            <span className="text-slate-600 group-hover:text-slate-800">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cores Personalizadas */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">Personalizar Cores</h2>
                <div className="space-y-5">
                    {FIELDS.map(({ key, label, hint }) => (
                        <div key={key} className="flex items-center gap-4">
                            <div className="relative shrink-0">
                                <input
                                    type="color"
                                    id={`color-${key}`}
                                    value={theme[key]}
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
                                value={theme[key]}
                                onChange={e => {
                                    if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleChange(key, e.target.value)
                                }}
                                maxLength={7}
                                className="w-24 p-2 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-green-500 transition text-center"
                            />
                        </div>
                    ))}
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
                    <button style={{ backgroundColor: theme.accent }} className="text-white text-sm px-5 py-2.5 rounded-lg font-medium shadow-sm">
                        Botão Destaque
                    </button>
                    <span style={{ backgroundColor: theme.primaryLight, color: theme.primaryDark }} className="text-xs font-semibold px-3 py-1 rounded-full">
                        Badge
                    </span>
                    <span style={{ backgroundColor: theme.primaryMid, color: theme.primaryDark }} className="text-xs font-semibold px-3 py-1 rounded-full">
                        Novidade
                    </span>
                    <span style={{ color: theme.primary }} className="text-sm font-medium underline cursor-pointer">
                        Link da loja
                    </span>
                </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
                💡 As alterações são aplicadas em tempo real como prévia. Clique em <b>Salvar</b> para persistir.
            </p>
        </div>
    )
}
