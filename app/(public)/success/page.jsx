'use client'
import { CheckCircleIcon, ShoppingBagIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

export default function CheckoutSuccess() {
    const [orderNumber, setOrderNumber] = useState('')
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        // Pega as dimensões da janela para a animação de confete cobrir a tela
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
        
        // Gera um número de pedido aleatório para a simulação
        setOrderNumber(`PED-${Math.floor(100000 + Math.random() * 900000)}`)
    }, [])

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-white px-6 relative overflow-hidden">
            
            {/* Animação de Confete Mágica! */}
            {windowDimensions.width > 0 && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    <Confetti 
                        width={windowDimensions.width} 
                        height={windowDimensions.height} 
                        recycle={false} 
                        numberOfPieces={500} 
                        gravity={0.15} 
                    />
                </div>
            )}

            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-slate-100 w-full max-w-lg text-center z-10 relative">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 text-green-500 p-5 rounded-full shadow-inner border border-green-200">
                        <CheckCircleIcon size={64} strokeWidth={1.5} />
                    </div>
                </div>
                
                <h1 className="text-3xl font-semibold text-slate-800 mb-3">Pedido Concluído!</h1>
                <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed">
                    Obrigado por comprar na INOVE-DEV. Seu pagamento foi aprovado e o seu pedido já está sendo processado.
                </p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
                    <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wider">Número do Pedido</p>
                    <p className="text-xl font-mono font-medium text-slate-700">{orderNumber}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/orders" className="flex-1 bg-slate-800 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <ShoppingBagIcon size={18} />
                        Meus Pedidos
                    </Link>
                    <Link href="/shop" className="flex-1 bg-white text-slate-700 border border-slate-300 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-50 active:scale-95 transition-all">
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        </div>
    )
}