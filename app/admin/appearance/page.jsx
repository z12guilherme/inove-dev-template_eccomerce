'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
    PaletteIcon, TypeIcon, LayoutIcon, CheckIcon, RotateCcwIcon, SaveIcon,
    ChevronRightIcon, MonitorIcon
} from 'lucide-react'
import {
    getAppearance, saveAppearance, defaultAppearance,
    AVAILABLE_FONTS, applyFont
} from '@/lib/appearanceStore'
import { getStoredTheme, applyTheme, defaultTheme } from '@/lib/themeProvider'

// ── Paletas predefinidas (migrado do admin/theme) ─────────────────────────────
const PALETTES = [
    { name: 'Verde Esmeralda',  primary: '#16a34a', primaryLight: '#bbf7d0', primaryMid: '#86efac', primaryDark: '#15803d', accent: '#1e293b' },
    { name: 'Azul Oceano',      primary: '#2563eb', primaryLight: '#dbeafe', primaryMid: '#93c5fd', primaryDark: '#1d4ed8', accent: '#0f172a' },
    { name: 'Roxo Profundo',    primary: '#7c3aed', primaryLight: '#ede9fe', primaryMid: '#c4b5fd', primaryDark: '#6d28d9', accent: '#1e1b4b' },
    { name: 'Rosa Vibrante',    primary: '#db2777', primaryLight: '#fce7f3', primaryMid: '#f9a8d4', primaryDark: '#be185d', accent: '#1e293b' },
    { name: 'Laranja',          primary: '#ea580c', primaryLight: '#ffedd5', primaryMid: '#fdba74', primaryDark: '#c2410c', accent: '#1c1917' },
    { name: 'Teal Moderno',     primary: '#0d9488', primaryLight: '#ccfbf1', primaryMid: '#5eead4', primaryDark: '#0f766e', accent: '#134e4a' },
]

const TABS = [
    { id: 'hero',   label: 'Hero',       icon: LayoutIcon },
    { id: 'cores',  label: 'Cores',      icon: PaletteIcon },
    { id: 'fonte',  label: 'Tipografia', icon: TypeIcon },
]

// ── Preview ao vivo do Hero ───────────────────────────────────────────────────
function HeroPreview({ appearance, theme }) {
    return (
        <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
                <MonitorIcon size={13} className="text-slate-400" />
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-slate-400 ml-1">Preview — Página Inicial</span>
            </div>

            {/* mini hero */}
            <div
                className="p-6 relative"
                style={{ backgroundColor: theme.primaryLight, fontFamily: `'${appearance.fontFamily}', sans-serif` }}
            >
                {/* badge */}
                <div className="inline-flex items-center gap-2 pr-3 p-0.5 rounded-full text-[10px] mb-3"
                    style={{ backgroundColor: theme.primaryMid, color: theme.primaryDark }}>
                    <span className="px-2 py-0.5 rounded-full text-white text-[10px]"
                        style={{ backgroundColor: theme.primary }}>
                        {appearance.heroBadgeLabel || 'NOVIDADE'}
                    </span>
                    {appearance.heroBadgeText}
                    <ChevronRightIcon size={10} />
                </div>

                {/* headline */}
                <h3 className="font-semibold leading-tight mb-3 max-w-[260px] text-sm"
                    style={{ color: theme.primaryDark }}>
                    {appearance.heroHeadline}
                </h3>

                {/* price */}
                <p className="text-[10px] text-slate-500">A partir de</p>
                <p className="font-bold text-lg" style={{ color: theme.primaryDark }}>
                    R${appearance.heroStartingPrice}
                </p>

                {/* button */}
                <button className="mt-3 text-[11px] px-4 py-2 rounded-md text-white font-medium transition"
                    style={{ backgroundColor: theme.accent }}>
                    {appearance.heroButtonText}
                </button>

                {/* cards preview */}
                <div className="mt-4 flex gap-2">
                    <div className="flex-1 rounded-xl p-3 bg-orange-200 text-[10px] font-semibold text-orange-900">
                        {appearance.heroCardTitle1}
                    </div>
                    <div className="flex-1 rounded-xl p-3 bg-blue-200 text-[10px] font-semibold text-blue-900">
                        {appearance.heroCardTitle2}
                    </div>
                </div>
            </div>

            {/* paleta de bolinha */}
            <div className="bg-white px-4 py-3 flex items-center gap-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">Paleta:</span>
                {[theme.primary, theme.primaryMid, theme.primaryLight, theme.accent].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm ring-1 ring-slate-200" style={{ backgroundColor: c }} />
                ))}
                <span className="ml-auto text-xs text-slate-400" style={{ fontFamily: `'${appearance.fontFamily}', sans-serif` }}>
                    Fonte: {appearance.fontFamily}
                </span>
            </div>
        </div>
    )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function AppearancePage() {
    const [activeTab, setActiveTab] = useState('hero')
    const [appearance, setAppearance] = useState(defaultAppearance)
    const [theme, setTheme] = useState(defaultTheme)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        setAppearance(getAppearance())
        setTheme(getStoredTheme())
    }, [])

    // atualiza preview ao vivo
    const updateAppearance = useCallback((key, value) => {
        setAppearance(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }, [])

    const updateTheme = useCallback((updates) => {
        const next = { ...theme, ...updates }
        setTheme(next)
        applyTheme(next)     // preview ao vivo nos CSS vars
        setHasChanges(true)
    }, [theme])

    const handleFontPreview = (fontName) => {
        updateAppearance('fontFamily', fontName)
        applyFont(fontName)
    }

    const handleSave = () => {
        saveAppearance(appearance, theme)
        setHasChanges(false)
        toast.success('Aparência salva com sucesso!')
    }

    const handleReset = () => {
        setAppearance(defaultAppearance)
        setTheme(defaultTheme)
        applyTheme(defaultTheme)
        applyFont(defaultAppearance.fontFamily)
        setHasChanges(true)
        toast('Configurações restauradas para o padrão.', { icon: 'ℹ️' })
    }

    return (
        <div className="text-slate-600 mb-28">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl text-slate-500">
                        Editor de <span className="text-slate-800 font-medium">Aparência</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Personalize o visual da sua loja em tempo real</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm transition"
                    >
                        <RotateCcwIcon size={14} /> Restaurar
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium transition ${hasChanges ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-slate-300 cursor-not-allowed'}`}
                        disabled={!hasChanges}
                    >
                        <SaveIcon size={14} />
                        {hasChanges ? 'Salvar Alterações' : 'Sem alterações'}
                    </button>
                </div>
            </div>

            {/* Layout: editor + preview */}
            <div className="flex gap-6 items-start">

                {/* ─ Painel Esquerdo: Editor ─ */}
                <div className="w-full max-w-sm shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${activeTab === tab.id
                                    ? 'text-green-600 border-b-2 border-green-500 bg-green-50/50'
                                    : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-5 flex flex-col gap-5 max-h-[700px] overflow-y-auto">

                        {/* ── TAB: HERO ────────────────────────────────── */}
                        {activeTab === 'hero' && (
                            <>
                                <Section title="Badge de destaque">
                                    <Field label="Rótulo (ex: NOVIDADE)">
                                        <input
                                            value={appearance.heroBadgeLabel}
                                            onChange={e => updateAppearance('heroBadgeLabel', e.target.value)}
                                            className="input-field"
                                            placeholder="NOVIDADE"
                                        />
                                    </Field>
                                    <Field label="Texto do badge">
                                        <input
                                            value={appearance.heroBadgeText}
                                            onChange={e => updateAppearance('heroBadgeText', e.target.value)}
                                            className="input-field"
                                            placeholder="Frete Grátis em Pedidos..."
                                        />
                                    </Field>
                                </Section>

                                <Section title="Headline principal">
                                    <textarea
                                        value={appearance.heroHeadline}
                                        onChange={e => updateAppearance('heroHeadline', e.target.value)}
                                        rows={3}
                                        className="input-field resize-none"
                                        placeholder="Seu headline aqui..."
                                    />
                                </Section>

                                <Section title="Preço de entrada">
                                    <Field label="A partir de (R$)">
                                        <input
                                            type="number"
                                            value={appearance.heroStartingPrice}
                                            onChange={e => updateAppearance('heroStartingPrice', e.target.value)}
                                            className="input-field"
                                            step="0.01"
                                        />
                                    </Field>
                                </Section>

                                <Section title="Botão CTA">
                                    <Field label="Texto do botão">
                                        <input
                                            value={appearance.heroButtonText}
                                            onChange={e => updateAppearance('heroButtonText', e.target.value)}
                                            className="input-field"
                                            placeholder="SAIBA MAIS"
                                        />
                                    </Field>
                                </Section>

                                <Section title="Cards secundários">
                                    <Field label="Card 1 (laranja)">
                                        <input
                                            value={appearance.heroCardTitle1}
                                            onChange={e => updateAppearance('heroCardTitle1', e.target.value)}
                                            className="input-field"
                                        />
                                    </Field>
                                    <Field label="Card 2 (azul)">
                                        <input
                                            value={appearance.heroCardTitle2}
                                            onChange={e => updateAppearance('heroCardTitle2', e.target.value)}
                                            className="input-field"
                                        />
                                    </Field>
                                </Section>
                            </>
                        )}

                        {/* ── TAB: CORES ───────────────────────────────── */}
                        {activeTab === 'cores' && (
                            <>
                                <Section title="Paletas predefinidas">
                                    <div className="grid grid-cols-2 gap-2">
                                        {PALETTES.map(palette => (
                                            <button
                                                key={palette.name}
                                                onClick={() => updateTheme(palette)}
                                                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${theme.primary === palette.primary
                                                    ? 'border-green-500 bg-green-50 shadow-sm'
                                                    : 'border-slate-200 hover:border-slate-300'}`}
                                            >
                                                <div className="flex gap-1 shrink-0">
                                                    {[palette.primary, palette.primaryMid, palette.primaryLight].map((c, i) => (
                                                        <div key={i} className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c }} />
                                                    ))}
                                                </div>
                                                <span className="text-slate-600 leading-tight">{palette.name}</span>
                                                {theme.primary === palette.primary && <CheckIcon size={12} className="text-green-500 ml-auto shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </Section>

                                <Section title="Cores individuais">
                                    {[
                                        { key: 'primary',      label: 'Cor principal' },
                                        { key: 'primaryLight', label: 'Tom claro' },
                                        { key: 'primaryMid',   label: 'Tom médio' },
                                        { key: 'primaryDark',  label: 'Tom escuro' },
                                        { key: 'accent',       label: 'Cor de contraste (botões)' },
                                    ].map(({ key, label }) => (
                                        <Field key={key} label={label}>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={theme[key]}
                                                    onChange={e => updateTheme({ [key]: e.target.value })}
                                                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={theme[key]}
                                                    onChange={e => {
                                                        if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
                                                            updateTheme({ [key]: e.target.value })
                                                    }}
                                                    className="input-field font-mono text-xs flex-1"
                                                    maxLength={7}
                                                />
                                            </div>
                                        </Field>
                                    ))}
                                </Section>
                            </>
                        )}

                        {/* ── TAB: TIPOGRAFIA ──────────────────────────── */}
                        {activeTab === 'fonte' && (
                            <Section title="Escolha a fonte da loja">
                                <div className="flex flex-col gap-2">
                                    {AVAILABLE_FONTS.map(font => (
                                        <button
                                            key={font.name}
                                            onClick={() => handleFontPreview(font.name)}
                                            className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${appearance.fontFamily === font.name
                                                ? 'border-green-500 bg-green-50 shadow-sm'
                                                : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: `'${font.name}', sans-serif` }}>
                                                    {font.label}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: `'${font.name}', sans-serif` }}>
                                                    {font.sample}
                                                </p>
                                            </div>
                                            {appearance.fontFamily === font.name && (
                                                <CheckIcon size={16} className="text-green-500 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 text-center mt-2">
                                    A fonte é aplicada em toda a loja ao salvar.
                                </p>
                            </Section>
                        )}
                    </div>
                </div>

                {/* ─ Painel Direito: Preview ─ */}
                <div className="flex-1 flex flex-col gap-4 sticky top-6">
                    <HeroPreview appearance={appearance} theme={theme} />

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 flex items-start gap-2">
                        <span className="text-amber-500 text-base leading-none mt-0.5">💡</span>
                        <div>
                            <p className="font-semibold mb-0.5">Preview ao vivo</p>
                            <p>As cores já estão sendo aplicadas na loja enquanto você edita. Clique em <strong>Salvar Alterações</strong> para tornar permanente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Componentes auxiliares ────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{title}</p>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    )
}

function Field({ label, children }) {
    return (
        <div>
            <p className="text-xs text-slate-500 mb-1.5">{label}</p>
            {children}
        </div>
    )
}
