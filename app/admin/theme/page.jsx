'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { BUSINESS_PRESETS } from '@/lib/businessPresets'
import { applyPreset, getAppearance, saveAppearance, AVAILABLE_FONTS } from '@/lib/appearanceStore'
import { getStoredTheme } from '@/lib/themeProvider'

const PresetsTab = ({ onPresetApplied }) => {

<<<<<<< HEAD
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
        const next = { ...theme, ...preset.colors }
        setTheme(next)
        applyTheme(next) // preview ao vivo
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

=======
    const handleApplyPreset = (preset) => {
        if (window.confirm(`⚠️ Aplicar o modelo "${preset.label}" substituirá suas configurações de aparência e cores. Deseja continuar?`)) {
            const { appearance, theme } = applyPreset(preset)
            onPresetApplied({ appearance, theme })
            toast.success(`Modelo "${preset.label}" aplicado com sucesso!`)
        }
    }

>>>>>>> 9ac4293b5f04c3f0d36855030fe94f53feebe516
    return (
        <div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <p className="text-sm text-amber-800">
                    <span className="font-bold">Atenção:</span> Aplicar um modelo substituirá suas cores e textos atuais. Uma confirmação será solicitada.
                </p>
            </div>
<<<<<<< HEAD

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
=======
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BUSINESS_PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm transition hover:shadow-md hover:border-green-500 text-left w-full cursor-pointer group"
                    >
                        <div className="flex items-start gap-4 mb-3 w-full">
                            <span className="text-3xl mt-1">{preset.emoji}</span>
                            <div className='flex-1'>
                                <h3 className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors">{preset.label}</h3>
                                <p className="text-xs text-slate-500">{preset.description}</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-green-600 mt-auto pt-2 text-right self-end group-hover:underline">
                            Clique para aplicar →
                        </span>
>>>>>>> 9ac4293b5f04c3f0d36855030fe94f53feebe516
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function AppearanceEditorPage() {
    const [activeTab, setActiveTab] = useState('Modelo')

    // Estados para forçar a re-renderização da UI de preview (se houver)
    const [appearance, setAppearance] = useState(getAppearance())
    const [theme, setTheme] = useState(getStoredTheme())

    const handlePresetApplied = ({ appearance, theme }) => {
        setAppearance(appearance)
        setTheme(theme)
    }

    const handleSave = (e) => {
        e.preventDefault()
        saveAppearance(appearance, theme)
        toast.success("Configurações salvas com sucesso!")
    }

    const tabs = ['Modelo', 'Loja', 'Hero', 'Imagens', 'Cores', 'Tipografia']

    const renderField = (key, label, type = "text") => (
        <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
                type={type}
                value={appearance[key] || ''}
                onChange={e => setAppearance({ ...appearance, [key]: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 bg-slate-50 text-slate-700"
            />
        </div>
    )

    const renderColorField = (key, label) => (
        <div key={key} className="mb-4 flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">{theme[key]}</span>
                <input
                    type="color"
                    value={theme[key] || '#000000'}
                    onChange={e => setTheme({ ...theme, [key]: e.target.value })}
                    className="w-10 h-10 p-1 border border-slate-200 rounded cursor-pointer bg-white"
                />
            </div>
        </div>
    )

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl font-medium text-slate-800">Editor de Aparência</h1>
            <p className="text-slate-500 mb-8">Personalize o visual da sua loja em tempo real.</p>

            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Modelo' && <PresetsTab onPresetApplied={handlePresetApplied} />}

            {activeTab !== 'Modelo' && (
                <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl">

                    {activeTab === 'Loja' && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-800 mb-4">Informações Gerais</h2>
                            {renderField('storeName', 'Nome da Loja')}
                            {renderField('storeSlogan', 'Slogan da Loja')}
                        </div>
                    )}

                    {activeTab === 'Hero' && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-800 mb-4">Textos do Banner Principal (Hero)</h2>
                            {renderField('heroBadgeLabel', 'Rótulo da Badge (ex: NOVIDADE)')}
                            {renderField('heroBadgeText', 'Texto da Badge')}
                            {renderField('heroHeadline', 'Título Principal (Headline)')}
                            {renderField('heroStartingPrice', 'Preço de Destaque')}
                            {renderField('heroButtonText', 'Texto do Botão (CTA)')}
                            <hr className="my-6 border-slate-100" />
                            <h2 className="text-lg font-medium text-slate-800 mb-4">Cards Secundários</h2>
                            {renderField('heroCardTitle1', 'Título do Card 1')}
                            {renderField('heroCardTitle2', 'Título do Card 2')}
                        </div>
                    )}

                    {activeTab === 'Imagens' && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-800 mb-4">Imagens do Banner</h2>
                            {renderField('heroImage', 'URL da Imagem Principal do Hero (Deixe em branco para o padrão)')}
                            {renderField('heroCard1Image', 'URL da Imagem do Card 1 (Deixe em branco para o padrão)')}
                            {renderField('heroCard2Image', 'URL da Imagem do Card 2 (Deixe em branco para o padrão)')}
                            <p className="text-xs text-slate-400 mt-2">Dica: Cole o link de uma imagem (ex: Unsplash, Imgur) para alterar as imagens da vitrine.</p>
                        </div>
                    )}

                    {activeTab === 'Cores' && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-800 mb-4">Paleta de Cores</h2>
                            {renderColorField('primary', 'Cor Primária (Botões e destaques)')}
                            {renderColorField('primaryLight', 'Cor Primária Clara (Fundos suaves)')}
                            {renderColorField('primaryMid', 'Cor Primária Média')}
                            {renderColorField('primaryDark', 'Cor Primária Escura (Hover)')}
                            {renderColorField('accent', 'Cor de Acento (Elementos secundários)')}
                        </div>
                    )}

                    {activeTab === 'Tipografia' && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-800 mb-4">Tipografia (Fonte da Loja)</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {AVAILABLE_FONTS.map(font => (
                                    <div
                                        key={font.name}
                                        onClick={() => setAppearance({ ...appearance, fontFamily: font.name })}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all ${appearance.fontFamily === font.name ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <p className="font-semibold text-lg text-slate-800" style={{ fontFamily: font.name }}>{font.label}</p>
                                        <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: font.name }}>{font.sample}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button type="submit" className="bg-green-500 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-green-600 transition active:scale-95">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}