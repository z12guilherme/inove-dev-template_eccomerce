'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ShippingCalculator({ onShippingCalculated }) {
    const [cep, setCep] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCalculateShipping = async (e) => {
        e.preventDefault()
        if (cep.length < 8) {
            toast.error('Por favor, insira um CEP válido com 8 dígitos.')
            return
        }

        setLoading(true)
        toast.loading('Calculando frete...')
        // Simula uma chamada de API que leva 1 segundo
        await new Promise(resolve => setTimeout(resolve, 1000))

        let shippingCost = 0
        // Regra de negócio simulada e simples para o frete
        if (cep.startsWith('7')) { // Ex: Região Centro-Oeste
            shippingCost = 15.50
        } else if (cep.startsWith('2')) { // Ex: Região Sudeste (RJ)
            shippingCost = 25.80
        } else { // Outras regiões
            shippingCost = 35.00
        }
        
        onShippingCalculated(shippingCost)
        setLoading(false)
        toast.dismiss()
        toast.success('Frete calculado com sucesso!')
    }

    return (
        <form onSubmit={handleCalculateShipping} className="mt-6">
            <h3 className="text-lg font-medium text-slate-800 mb-1">Calcular Frete</h3>
            <p className="text-sm text-slate-500 mb-3">Insira seu CEP para simular o valor da entrega.</p>
            <div className="flex items-start gap-2">
                <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    placeholder="00000000"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {loading ? '...' : 'Calcular'}
                </button>
            </div>
        </form>
    )
}