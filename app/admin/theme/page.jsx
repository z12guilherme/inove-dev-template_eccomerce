'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { BUSINESS_PRESETS } from '@/lib/businessPresets'
import { applyPreset, getAppearance, saveAppearance, AVAILABLE_FONTS } from '@/lib/appearanceStore'
import { getStoredTheme } from '@/lib/themeProvider'

const PresetsTab = ({ onPresetApplied }) => {

    const handleApplyPreset = (preset) => {
        if (window.confirm(`⚠️ Aplicar o modelo "${preset.label}" substituirá suas configurações de aparência e cores. Deseja continuar?`)) {
            const { appearance, theme } = applyPreset(preset)
            onPresetApplied({ appearance, theme })
            toast.success(`Modelo "${preset.label}" aplicado com sucesso!`)
        }
    }

    return (
        <div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <p className="text-sm text-amber-800">
                    <span className="font-bold">Atenção:</span> Aplicar um modelo substituirá suas cores e textos atuais. Uma confirmação será solicitada.
                </p>
            </div>
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