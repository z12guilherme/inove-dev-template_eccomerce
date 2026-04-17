'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { dbAdapter } from '../dbAdapter'
import { TruckIcon, PackageOpenIcon } from 'lucide-react'

export default function ShippingCalculator({ onShippingCalculated, items = [] }) {
    const [cep, setCep] = useState('')
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState([])
    const [selectedId, setSelectedId] = useState(null)

    const handleCalculateShipping = async (e) => {
        e.preventDefault()
        if (cep.length < 8) {
            toast.error('Por favor, insira um CEP válido.')
            return
        }

        setLoading(true)
        const toastId = toast.loading('Calculando frete com SuperFrete...')

        try {
            // 1. Buscar configurações da loja (CEP Origem e Token)
            const settings = await dbAdapter.getStoreSettings()

            if (!settings.superfreteToken) {
                console.warn('Token SuperFrete não configurado no admin.')
            }

            // 2. Chamar API com payload completo
            const response = await fetch('/api/frete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cep,
                    originZip: settings.shippingOriginZip,
                    token: settings.superfreteToken,
                    items,
                    defaultDimensions: {
                        weight: settings.defaultWeight,
                        height: settings.defaultHeight,
                        width: settings.defaultWidth,
                        length: settings.defaultLength
                    },
                    sandbox: settings.superfreteSandbox,
                    services: settings.superfreteServices,
                    userAgent: settings.superfreteUserAgent
                })
            })

            const data = await response.json()
            
            toast.dismiss(toastId)
            
            if (data.options && data.options.length > 0) {
                setOptions(data.options)
                setSelectedId(null) // Reseta seleção
                toast.success('Opções de frete atualizadas!')
            } else {
                throw new Error('Nenhuma opção de frete retornada.')
            }

            if (data.isFallback) {
                toast.error('Usando cálculo de contingência (Jadlog/Loggi).', { duration: 4000 })
            }

        } catch (error) {
            toast.dismiss(toastId)
            console.error('Erro no cálculo:', error)
            toast.error('Erro ao calcular frete.')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectOption = (option) => {
        setSelectedId(option.id)
        const val = parseFloat(option.price.replace(',', '.'))
        onShippingCalculated(val)
    }

    return (
        <div className="mt-2">
            <form onSubmit={handleCalculateShipping} className="">
                <h3 className="text-lg font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <TruckIcon size={20} className="text-blue-500" /> Calcular Frete
                </h3>
                <p className="text-xs text-slate-500 mb-3">Selecione transportadoras como Jadlog ou Loggi.</p>
                
                <div className="flex items-start gap-2">
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                        maxLength={8}
                        placeholder="Seu CEP"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-400 text-sm font-medium"
                    >
                        {loading ? '...' : 'Calcular'}
                    </button>
                </div>
            </form>

            {options.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Opções Disponíveis:</p>
                    {options.map((opt) => (
                        <div 
                            key={opt.id}
                            onClick={() => handleSelectOption(opt)}
                            className={`p-3 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${selectedId === opt.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${selectedId === opt.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <PackageOpenIcon size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{opt.name}</p>
                                    <p className="text-xs text-slate-400">Prazo: {opt.delivery_time} dias úteis</p>
                                </div>
                            </div>
                            <p className="font-bold text-slate-800 text-sm">R$ {opt.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}