'use client'
import React, { useState, useEffect } from 'react'
import { dbAdapter } from '../../../dbAdapter'
import toast from 'react-hot-toast'
import { SaveIcon, TruckIcon, KeyIcon, PackageIcon } from 'lucide-react'

export default function StoreSettings() {
    const [settings, setSettings] = useState({
        shippingOriginZip: '',
        superfreteToken: '',
        superfreteUserAgent: '',
        superfreteServices: '',
        superfreteSandbox: true,
        defaultWeight: 1,
        defaultHeight: 20,
        defaultWidth: 20,
        defaultLength: 20
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadSettings = async () => {
            const data = await dbAdapter.getStoreSettings()
            if (data) setSettings(data)
            setLoading(false)
        }
        loadSettings()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            await dbAdapter.saveStoreSettings(settings)
            toast.success('Configurações salvas com sucesso!')
        } catch (error) {
            toast.error('Erro ao salvar configurações.')
        }
    }

    if (loading) return <div className="p-10 text-slate-400">Carregando...</div>

    return (
        <div className="text-slate-500 mb-28 max-w-2xl">
            <h1 className="text-2xl mb-8">Configurações da <span className="text-slate-800 font-medium">Loja</span></h1>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Logística */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <TruckIcon size={18} className="text-slate-400" />
                        <h2 className="font-medium text-slate-700">Logística e Frete</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-600">CEP de Origem (Envio)</span>
                            <input 
                                type="text" 
                                maxLength={8}
                                value={settings.shippingOriginZip}
                                onChange={e => setSettings({...settings, shippingOriginZip: e.target.value.replace(/\D/g, '')})}
                                placeholder="00000000"
                                className="p-2 px-4 outline-none border border-slate-200 rounded focus:border-green-500 transition-colors"
                            />
                            <p className="text-xs text-slate-400">Este CEP será usado como ponto de partida para o cálculo do frete.</p>
                        </label>
                    </div>
                </div>

                {/* API SuperFrete */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <KeyIcon size={18} className="text-slate-400" />
                        <h2 className="font-medium text-slate-700">Integração SuperFrete</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-600">Token de API (Bearer)</span>
                            <input 
                                type="password"
                                value={settings.superfreteToken}
                                onChange={e => setSettings({...settings, superfreteToken: e.target.value})}
                                placeholder="Insira seu token da SuperFrete"
                                className="p-2 px-4 outline-none border border-slate-200 rounded focus:border-green-500 transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                {settings.superfreteSandbox ? (
                                    <>Obtenha seu token de <strong>Sandbox</strong> em: <a href="https://sandbox.superfrete.com/#/integrations" target="_blank" className="text-blue-500 hover:underline">sandbox.superfrete.com</a></>
                                ) : (
                                    <>Obtenha seu token de <strong>Produção</strong> em: <a href="https://web.superfrete.com/#/integrations" target="_blank" className="text-blue-500 hover:underline">web.superfrete.com</a></>
                                )}
                            </p>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-slate-600">Modo Sandbox</span>
                                <select 
                                    value={settings.superfreteSandbox} 
                                    onChange={e => setSettings({...settings, superfreteSandbox: e.target.value === 'true'})}
                                    className="p-2 px-4 outline-none border border-slate-200 rounded focus:border-green-500 transition-colors"
                                >
                                    <option value="true">Ativado (Testes)</option>
                                    <option value="false">Desativado (Produção)</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-slate-600">Serviços (IDs)</span>
                                <input 
                                    type="text"
                                    value={settings.superfreteServices}
                                    onChange={e => setSettings({...settings, superfreteServices: e.target.value})}
                                    placeholder="1,2,17,3,31"
                                    className="p-2 px-4 outline-none border border-slate-200 rounded focus:border-green-500 transition-colors"
                                />
                            </label>
                        </div>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-600">User-Agent (Email p/ Contato Técnico)</span>
                            <input 
                                type="text"
                                value={settings.superfreteUserAgent}
                                onChange={e => setSettings({...settings, superfreteUserAgent: e.target.value})}
                                placeholder="exemplo@email.com"
                                className="p-2 px-4 outline-none border border-slate-200 rounded focus:border-green-500 transition-colors"
                            />
                            <p className="text-xs text-slate-400">Recomendado pela SuperFrete para identificação da sua aplicação.</p>
                        </label>
                    </div>
                </div>

                {/* Dimensões Padrão */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <PackageIcon size={18} className="text-slate-400" />
                        <h2 className="font-medium text-slate-700">Dimensões Padrão da Caixa</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2 text-sm">
                            Peso Padrão (kg)
                            <input type="number" step="0.01" value={settings.defaultWeight} onChange={e => setSettings({...settings, defaultWeight: e.target.value})} className="p-2 border border-slate-200 rounded outline-none" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            Altura Padrão (cm)
                            <input type="number" value={settings.defaultHeight} onChange={e => setSettings({...settings, defaultHeight: e.target.value})} className="p-2 border border-slate-200 rounded outline-none" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            Largura Padrão (cm)
                            <input type="number" value={settings.defaultWidth} onChange={e => setSettings({...settings, defaultWidth: e.target.value})} className="p-2 border border-slate-200 rounded outline-none" />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            Comprimento Padrão (cm)
                            <input type="number" value={settings.defaultLength} onChange={e => setSettings({...settings, defaultLength: e.target.value})} className="p-2 border border-slate-200 rounded outline-none" />
                        </label>
                        <p className="col-span-2 text-xs text-slate-400 mt-2">Valores usados caso o produto não tenha dimensões cadastradas.</p>
                    </div>
                </div>

                <button type="submit" className="flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-lg hover:bg-slate-900 transition active:scale-95 font-medium shadow-md">
                    <SaveIcon size={18} /> Salvar Configurações
                </button>

            </form>
        </div>
    )
}
