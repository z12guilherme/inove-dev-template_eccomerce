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

        let shippingCost = 0
        
        try {
            // === INTEGRAÇÃO REAL ===
            const response = await fetch(`/api/frete?cep=${cep}`)
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            shippingCost = parseFloat(data.valor.replace(',', '.'))

            toast.dismiss()
            if (data.isFallback) {
                toast.error('Correios instável. Aplicando frete fixo regional.', { duration: 4000 })
            } else {
                toast.success('Frete calculado com sucesso!')
            }
        } catch (error) {
            toast.dismiss()
            console.error('Detalhes do erro na requisição de frete:', error)
            toast.error('Erro ao calcular o frete.')
            setLoading(false)
            return
        }
        
        onShippingCalculated(shippingCost)
        setLoading(false)
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