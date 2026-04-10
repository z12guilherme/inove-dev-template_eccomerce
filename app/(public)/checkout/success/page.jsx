'use client'
import { CheckCircleIcon, ShoppingBagIcon, PackageIcon, MailIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

export default function CheckoutSuccess() {
    const [orderId, setOrderId] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(true)

    useEffect(() => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })

        // Recupera os dados reais do pedido salvo pelo OrderSummary
        const savedId = sessionStorage.getItem('last_order_id')
        const savedName = sessionStorage.getItem('last_order_customer')

        if (savedId) {
            setOrderId(savedId.slice(-8).toUpperCase())
        } else {
            // Fallback caso o usuário acesse diretamente a URL
            setOrderId(`PED-${Math.floor(100000 + Math.random() * 900000)}`)
        }

        if (savedName) {
            setCustomerName(savedName)
        }

        // Para o confete após 5 segundos para não pesar na tela
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timer)
    }, [])

    // Formata o nome para o cumprimento (só o primeiro nome)
    const firstName = customerName ? customerName.trim().split(' ')[0] : null

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-white px-6 relative overflow-hidden">

            {/* Animação de Confete */}
            {showConfetti && windowDimensions.width > 0 && (
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
                {/* Ícone de sucesso */}
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 text-green-500 p-5 rounded-full shadow-inner border border-green-200">
                        <CheckCircleIcon size={64} strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-3xl font-semibold text-slate-800 mb-2">
                    {firstName ? `Obrigado, ${firstName}!` : 'Pedido Concluído!'}
                </h1>
                <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed">
                    Seu pagamento foi aprovado e o pedido já está sendo processado. Em breve você receberá uma confirmação.
                </p>

                {/* Número do pedido */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
                    <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wider">Número do Pedido</p>
                    <p className="text-xl font-mono font-medium text-slate-700">#{orderId}</p>
                </div>

                {/* Linha de status */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-8">
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                        <PackageIcon size={14} /> Pedido Confirmado
                    </span>
                    <ArrowRightIcon size={12} />
                    <span>Em Separação</span>
                    <ArrowRightIcon size={12} />
                    <span>Enviado</span>
                    <ArrowRightIcon size={12} />
                    <span>Entregue</span>
                </div>

                {/* Nota de e-mail */}
                {customerName && (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-7 bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <MailIcon size={14} className="text-blue-400 shrink-0" />
                        <p>Uma confirmação seria enviada para o e-mail de cadastro.</p>
                    </div>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/orders"
                        className="flex-1 bg-slate-800 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <ShoppingBagIcon size={18} />
                        Meus Pedidos
                    </Link>
                    <Link
                        href="/shop"
                        className="flex-1 bg-white text-slate-700 border border-slate-300 px-6 py-3.5 rounded-xl font-medium hover:bg-slate-50 active:scale-95 transition-all"
                    >
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        </div>
    )
}