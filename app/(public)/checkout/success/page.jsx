'use client'
import { CheckCircleIcon, ShoppingBagIcon, PackageIcon, MailIcon, ArrowRightIcon, ClockIcon, XCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Confetti from 'react-confetti'

// Mapeia status do Mercado Pago para informações visuais
const STATUS_CONFIG = {
    approved: {
        icon: CheckCircleIcon,
        iconBg: 'bg-green-100 text-green-500 border-green-200',
        title: (name) => name ? `Obrigado, ${name}!` : 'Pedido Concluído!',
        message: 'Seu pagamento foi aprovado e o pedido já está sendo processado. Em breve você receberá uma confirmação.',
        showConfetti: true,
    },
    pending: {
        icon: ClockIcon,
        iconBg: 'bg-amber-100 text-amber-500 border-amber-200',
        title: () => 'Pagamento em Análise',
        message: 'Seu pagamento está sendo processado pelo Mercado Pago. Isso pode levar alguns minutos. Acompanhe o status na sua conta.',
        showConfetti: false,
    },
    failure: {
        icon: XCircleIcon,
        iconBg: 'bg-red-100 text-red-500 border-red-200',
        title: () => 'Pagamento Recusado',
        message: 'Infelizmente o pagamento não foi aprovado. Por favor, tente novamente com outro método de pagamento.',
        showConfetti: false,
    },
}

export default function CheckoutSuccess() {
    const searchParams = useSearchParams()
    const [orderId, setOrderId] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(true)
    const [paymentStatus, setPaymentStatus] = useState('approved') // default: aprovado
    const [mpPaymentId, setMpPaymentId] = useState(null)

    useEffect(() => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })

        // ── Ler parâmetros do Mercado Pago (se existirem) ────────────────
        const mpStatus = searchParams.get('status')
        const mpExtRef = searchParams.get('external_reference')
        const mpPayId = searchParams.get('payment_id')
        const mpCollStatus = searchParams.get('collection_status')

        // O Mercado Pago envia: ?status=approved&payment_id=xxx&external_reference=order_123
        if (mpStatus) {
            // Mapeia 'in_process' do MP para nosso 'pending'
            const normalizedStatus = mpStatus === 'in_process' ? 'pending' : mpStatus
            setPaymentStatus(normalizedStatus in STATUS_CONFIG ? normalizedStatus : 'approved')
        } else if (mpCollStatus) {
            const normalizedStatus = mpCollStatus === 'in_process' ? 'pending' : mpCollStatus
            setPaymentStatus(normalizedStatus in STATUS_CONFIG ? normalizedStatus : 'approved')
        }

        if (mpPayId) setMpPaymentId(mpPayId)

        // ── Recupera os dados reais do pedido ────────────────────────────
        const savedId = mpExtRef || sessionStorage.getItem('last_order_id')
        const savedName = sessionStorage.getItem('last_order_customer')

        if (savedId) {
            setOrderId(savedId.slice(-8).toUpperCase())
        } else {
            setOrderId(`PED-${Math.floor(100000 + Math.random() * 900000)}`)
        }

        if (savedName) {
            setCustomerName(savedName)
        }

        // Para o confete após 5 segundos para não pesar na tela
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timer)
    }, [searchParams])

    // Formata o nome para o cumprimento (só o primeiro nome)
    const firstName = customerName ? customerName.trim().split(' ')[0] : null

    // Pega a configuração visual do status atual
    const config = STATUS_CONFIG[paymentStatus] || STATUS_CONFIG.approved
    const StatusIcon = config.icon

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-white px-6 relative overflow-hidden">

            {/* Animação de Confete — só para status approved */}
            {showConfetti && config.showConfetti && windowDimensions.width > 0 && (
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
                {/* Ícone de status */}
                <div className="flex justify-center mb-6">
                    <div className={`p-5 rounded-full shadow-inner border ${config.iconBg}`}>
                        <StatusIcon size={64} strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-3xl font-semibold text-slate-800 mb-2">
                    {config.title(firstName)}
                </h1>
                <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed">
                    {config.message}
                </p>

                {/* Número do pedido */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
                    <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wider">Número do Pedido</p>
                    <p className="text-xl font-mono font-medium text-slate-700">#{orderId}</p>
                    {mpPaymentId && (
                        <p className="text-xs text-slate-400 mt-2">
                            ID Pagamento MP: <span className="font-mono">{mpPaymentId}</span>
                        </p>
                    )}
                </div>

                {/* Linha de status */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-8">
                    <span className={`flex items-center gap-1.5 font-medium ${paymentStatus === 'approved' ? 'text-green-600' : paymentStatus === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                        <PackageIcon size={14} />
                        {paymentStatus === 'approved' ? 'Pedido Confirmado' : paymentStatus === 'pending' ? 'Aguardando Pagamento' : 'Pagamento Recusado'}
                    </span>
                    {paymentStatus === 'approved' && (
                        <>
                            <ArrowRightIcon size={12} />
                            <span>Em Separação</span>
                            <ArrowRightIcon size={12} />
                            <span>Enviado</span>
                            <ArrowRightIcon size={12} />
                            <span>Entregue</span>
                        </>
                    )}
                </div>

                {/* Nota de e-mail */}
                {customerName && paymentStatus === 'approved' && (
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-7 bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <MailIcon size={14} className="text-blue-400 shrink-0" />
                        <p>Uma confirmação seria enviada para o e-mail de cadastro.</p>
                    </div>
                )}

                {/* Aviso de pagamento pendente */}
                {paymentStatus === 'pending' && (
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-600 mb-7 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <ClockIcon size={14} className="shrink-0" />
                        <p>Pagamentos via boleto ou PIX podem levar até 24h para serem confirmados pelo Mercado Pago.</p>
                    </div>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {paymentStatus === 'failure' ? (
                        <Link
                            href="/cart"
                            className="flex-1 bg-red-500 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            Tentar Novamente
                        </Link>
                    ) : (
                        <Link
                            href="/orders"
                            className="flex-1 bg-slate-800 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <ShoppingBagIcon size={18} />
                            Meus Pedidos
                        </Link>
                    )}
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