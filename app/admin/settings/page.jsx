'use client'
import React, { useState, useEffect } from 'react'
import { dbAdapter } from '../../../dbAdapter'
import toast from 'react-hot-toast'
import {
    SaveIcon, TruckIcon, KeyIcon, PackageIcon,
    CreditCardIcon, ChevronDownIcon, ChevronUpIcon,
    CheckCircleIcon, XCircleIcon, AlertCircleIcon,
    ExternalLinkIcon, ShieldCheckIcon, EyeIcon, EyeOffIcon
} from 'lucide-react'

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
        defaultLength: 20,
        // Mercado Pago
        mercadoPagoEnabled: false,
        mercadoPagoAccessToken: '',
        mercadoPagoSandbox: true,
    })
    const [loading, setLoading] = useState(true)
    const [showTutorial, setShowTutorial] = useState(false)
    const [showToken, setShowToken] = useState(false)

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

    // Status visual do Mercado Pago
    const getMpStatus = () => {
        if (!settings.mercadoPagoEnabled) {
            return { color: 'red', icon: XCircleIcon, text: 'Pagamento online DESATIVADO', bg: 'bg-red-50', border: 'border-red-200', textColor: 'text-red-600' }
        }
        if (!settings.mercadoPagoAccessToken?.trim()) {
            return { color: 'yellow', icon: AlertCircleIcon, text: 'Token não configurado', bg: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-600' }
        }
        return { color: 'green', icon: CheckCircleIcon, text: 'Pagamento online ATIVO', bg: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-600' }
    }

    const mpStatus = getMpStatus()

    if (loading) return <div className="p-10 text-slate-400">Carregando...</div>

    return (
        <div className="text-slate-500 mb-28 max-w-2xl">
            <h1 className="text-2xl mb-8">Configurações da <span className="text-slate-800 font-medium">Loja</span></h1>

            <form onSubmit={handleSave} className="space-y-6">

                {/* ══════════════════════════════════════════════════════════
                    MERCADO PAGO — Seção principal (primeiro para destaque)
                   ══════════════════════════════════════════════════════════ */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#009ee3]/10 to-[#009ee3]/5 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCardIcon size={18} className="text-[#009ee3]" />
                            <h2 className="font-medium text-slate-700">Pagamento Online — Mercado Pago</h2>
                        </div>
                        {/* Badge de status */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${mpStatus.bg} ${mpStatus.border} ${mpStatus.textColor} border`}>
                            <mpStatus.icon size={12} />
                            {mpStatus.text}
                        </div>
                    </div>
                    <div className="p-6 space-y-5">

                        {/* Toggle Ativar/Desativar */}
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-600">Pagamento via Mercado Pago</span>
                            <select
                                value={settings.mercadoPagoEnabled ? 'true' : 'false'}
                                onChange={e => setSettings({ ...settings, mercadoPagoEnabled: e.target.value === 'true' })}
                                className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-[#009ee3] transition-colors"
                            >
                                <option value="false">❌ Desativado — Pagamento simulado</option>
                                <option value="true">✅ Ativado — Clientes pagam pelo Mercado Pago</option>
                            </select>
                            <p className="text-xs text-slate-400">
                                Quando ativado, o cliente será redirecionado para o Mercado Pago ao finalizar o pedido (PIX, Cartão, Boleto).
                            </p>
                        </label>

                        {/* Campos condicionais (só aparecem quando ativado) */}
                        {settings.mercadoPagoEnabled && (
                            <>
                                {/* Access Token */}
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-600">Access Token</span>
                                    <div className="relative">
                                        <input
                                            type={showToken ? 'text' : 'password'}
                                            value={settings.mercadoPagoAccessToken}
                                            onChange={e => setSettings({ ...settings, mercadoPagoAccessToken: e.target.value })}
                                            placeholder="APP_USR-0000000000000000-000000-00000000000000000000000000000000-000000000"
                                            className="w-full p-2.5 px-4 pr-12 outline-none border border-slate-200 rounded-lg focus:border-[#009ee3] transition-colors font-mono text-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowToken(!showToken)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                        >
                                            {showToken ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {settings.mercadoPagoSandbox ? (
                                            <>Use o token de <strong>teste</strong> para experimentar sem cobranças reais.</>
                                        ) : (
                                            <>Use o token de <strong>produção</strong> para cobranças reais.</>
                                        )}
                                    </p>
                                </label>

                                {/* Modo Sandbox */}
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-600">Ambiente</span>
                                    <select
                                        value={settings.mercadoPagoSandbox ? 'true' : 'false'}
                                        onChange={e => setSettings({ ...settings, mercadoPagoSandbox: e.target.value === 'true' })}
                                        className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg focus:border-[#009ee3] transition-colors"
                                    >
                                        <option value="true">🧪 Sandbox (Testes — nenhuma cobrança real)</option>
                                        <option value="false">🚀 Produção (Cobranças reais)</option>
                                    </select>
                                </label>

                                {/* Info de segurança */}
                                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-600">
                                    <ShieldCheckIcon size={16} className="shrink-0 mt-0.5" />
                                    <p>
                                        Seu Access Token é salvo localmente e usado <strong>apenas no servidor</strong> para criar o pagamento.
                                        O cliente nunca tem acesso ao token. O pagamento acontece no ambiente seguro do Mercado Pago.
                                    </p>
                                </div>

                                {/* Warning de produção */}
                                {!settings.mercadoPagoSandbox && (
                                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-600">
                                        <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                                        <p>
                                            <strong>Modo Produção ativo!</strong> Pagamentos serão cobrados de verdade.
                                            Certifique-se de que o token é de produção e que sua conta está verificada no Mercado Pago.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Tutorial accordion */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowTutorial(!showTutorial)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition text-left"
                            >
                                <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    📘 Como configurar o Mercado Pago
                                </span>
                                {showTutorial ? <ChevronUpIcon size={16} className="text-slate-400" /> : <ChevronDownIcon size={16} className="text-slate-400" />}
                            </button>
                            {showTutorial && (
                                <div className="px-4 py-4 space-y-4 text-sm text-slate-600 border-t border-slate-200 bg-white">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-[#009ee3] text-white flex items-center justify-center text-xs font-bold">1</span>
                                            <div>
                                                <p className="font-medium text-slate-700">Crie sua conta de desenvolvedor</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Acesse o painel de desenvolvedores do Mercado Pago e crie (ou use) uma aplicação.
                                                </p>
                                                <a
                                                    href="https://www.mercadopago.com.br/developers/panel/app"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[#009ee3] text-xs mt-1 hover:underline"
                                                >
                                                    Abrir Painel de Desenvolvedores <ExternalLinkIcon size={12} />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-[#009ee3] text-white flex items-center justify-center text-xs font-bold">2</span>
                                            <div>
                                                <p className="font-medium text-slate-700">Selecione o tipo &quot;Checkout Pro&quot;</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Ao criar a aplicação, escolha &quot;Checkout Pro&quot; como solução de pagamento.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-[#009ee3] text-white flex items-center justify-center text-xs font-bold">3</span>
                                            <div>
                                                <p className="font-medium text-slate-700">Copie o Access Token</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Vá em <strong>Credenciais de Teste</strong> (para sandbox) ou <strong>Credenciais de Produção</strong> e copie o <strong>Access Token</strong>.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-[#009ee3] text-white flex items-center justify-center text-xs font-bold">4</span>
                                            <div>
                                                <p className="font-medium text-slate-700">Cole o token aqui e salve</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Cole o token no campo acima, escolha o ambiente (Sandbox ou Produção) e clique em Salvar.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                                            <div>
                                                <p className="font-medium text-slate-700">Pronto!</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Seus clientes agora serão redirecionados para o Mercado Pago ao finalizar o pedido.
                                                    Eles poderão pagar via <strong>PIX, Cartão de Crédito, Boleto</strong> e mais.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dados de teste para sandbox */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                                        <p className="font-semibold mb-1">💡 Dica para testes (Sandbox):</p>
                                        <p>Use os <strong>cartões de teste</strong> do Mercado Pago:</p>
                                        <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                                            <li>Visa: <code className="bg-amber-100 px-1 rounded">4509 9535 6623 3704</code></li>
                                            <li>Mastercard: <code className="bg-amber-100 px-1 rounded">5031 4332 1540 6351</code></li>
                                            <li>CVV: <code className="bg-amber-100 px-1 rounded">123</code> · Vencimento: qualquer data futura</li>
                                            <li>CPF: <code className="bg-amber-100 px-1 rounded">12345678909</code></li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    LOGÍSTICA E FRETE (seção existente)
                   ══════════════════════════════════════════════════════════ */}
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
