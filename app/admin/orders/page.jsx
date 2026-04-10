'use client'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { dbAdapter } from '../../../dbAdapter'
import { Trash2Icon, ChevronDownIcon, ChevronUpIcon, MapPinIcon, PhoneIcon, MailIcon, TagIcon, TruckIcon, ReceiptIcon } from 'lucide-react'

const STATUS_STYLES = {
    pending:   'bg-yellow-50 border-yellow-200 text-yellow-700',
    confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
    shipped:   'bg-indigo-50 border-indigo-200 text-indigo-700',
    delivered: 'bg-green-50 border-green-200 text-green-700',
    cancelled: 'bg-red-50 border-red-200 text-red-700',
}

function OrderDetailRow({ order, currency }) {
    const addr = order.address || {}
    const subtotal = order.orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? order.total
    const shipping = order.shippingCost ?? 0
    const discount = order.discountAmount ?? 0

    return (
        <tr>
            <td colSpan={8} className="px-0 py-0 border-b border-slate-100">
                <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

                    {/* Endereço de entrega */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <MapPinIcon size={13} /> Endereço de Entrega
                        </p>
                        <p className="font-medium text-slate-800">{addr.name || '—'}</p>
                        {addr.street && <p className="text-slate-500 mt-0.5">{addr.street}</p>}
                        {(addr.city || addr.state) && (
                            <p className="text-slate-500">
                                {addr.city}{addr.state ? ` — ${addr.state}` : ''}{addr.zip ? `, CEP ${addr.zip}` : ''}
                            </p>
                        )}
                        {addr.country && <p className="text-slate-500">{addr.country}</p>}
                        {addr.phone && (
                            <p className="text-slate-400 text-xs mt-2 flex items-center gap-1.5">
                                <PhoneIcon size={11} /> {addr.phone}
                            </p>
                        )}
                        {(order.customerEmail || addr.email) && (
                            <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                                <MailIcon size={11} /> {order.customerEmail || addr.email}
                            </p>
                        )}
                    </div>

                    {/* Itens do pedido */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <ReceiptIcon size={13} /> Itens do Pedido
                        </p>
                        <div className="flex flex-col gap-2">
                            {order.orderItems?.map((item, i) => (
                                <div key={i} className="flex items-start justify-between gap-3 text-slate-600">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-700 truncate">
                                            {item.product?.name || `Produto #${item.productId?.slice(-6)}`}
                                        </p>
                                        {item.product?.category && (
                                            <p className="text-xs text-slate-400">{item.product.category}</p>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-slate-400">x{item.quantity}</p>
                                        <p className="font-medium text-slate-700">
                                            {currency}{(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumo financeiro */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <TruckIcon size={13} /> Resumo do Pedido
                        </p>
                        <div className="flex flex-col gap-1.5 text-slate-500">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-700">{currency}{subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span className="font-medium text-slate-700">
                                    {shipping > 0 ? `${currency}${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Grátis'}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">
                                        <TagIcon size={11} className="text-green-500" />
                                        {order.couponCode || 'Cupom'}
                                    </span>
                                    <span className="font-medium text-green-600">−{currency}{discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                                <span className="font-semibold text-slate-700">Total</span>
                                <span className="font-semibold text-slate-800">{currency}{Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-200">
                                <p className="text-xs">
                                    <span className="text-slate-400">Pagamento: </span>
                                    <span className="font-medium text-slate-600">{order.paymentMethod || '—'}</span>
                                </p>
                                <p className="text-xs mt-1">
                                    <span className="text-slate-400">Data: </span>
                                    <span className="font-medium text-slate-600">
                                        {new Date(order.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                </p>
                                {order.isCouponUsed && (
                                    <p className="text-xs mt-1">
                                        <span className="text-slate-400">Cupom: </span>
                                        <span className="font-semibold text-green-600">{order.couponCode}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    )
}

export default function ManageOrders() {
    const [orders, setOrders] = useState([])
    const [expandedId, setExpandedId] = useState(null)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$'

    const loadOrders = async () => {
        const data = await dbAdapter.getOrders()
        setOrders(data)
    }

    useEffect(() => {
        loadOrders()
    }, [])

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id)
    }

    const handleStatusChange = async (orderId, newStatus) => {
        await dbAdapter.updateOrderStatus(orderId, newStatus)
        await loadOrders()
        toast.success('Status do pedido atualizado!')
    }

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
            await dbAdapter.deleteOrder(orderId)
            await loadOrders()
            if (expandedId === orderId) setExpandedId(null)
            toast.success('Pedido excluído com sucesso!')
        }
    }

    return (
        <div className="text-slate-500 mb-28 max-w-6xl">
            <h1 className="text-2xl mb-8">Gerenciar <span className="text-slate-800 font-medium">Pedidos</span></h1>

            {orders.length === 0 ? (
                <p className="text-slate-400">Nenhum pedido encontrado.</p>
            ) : (
                <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-6"></th>
                                <th className="px-6 py-4">ID do Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Produtos</th>
                                <th className="px-6 py-4 text-center">Pagamento</th>
                                <th className="px-6 py-4 text-center">Data</th>
                                <th className="px-6 py-4 text-center">Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr
                                        className={`transition-colors text-sm border-b border-slate-100 ${expandedId === order.id ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                                    >
                                        {/* Botão expandir */}
                                        <td className="pl-4 pr-0 py-4">
                                            <button
                                                onClick={() => toggleExpand(order.id)}
                                                className="text-slate-400 hover:text-slate-700 transition p-1 rounded hover:bg-slate-100"
                                                title={expandedId === order.id ? 'Fechar detalhes' : 'Ver detalhes completos'}
                                            >
                                                {expandedId === order.id
                                                    ? <ChevronUpIcon size={16} />
                                                    : <ChevronDownIcon size={16} />}
                                            </button>
                                        </td>

                                        <td className="px-4 py-4 font-mono text-xs text-slate-600">
                                            <span className="bg-slate-100 px-2 py-1 rounded">
                                                #{order.id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="font-medium text-slate-800">
                                                {order.customerName || order.address?.name || '—'}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {order.customerEmail || order.address?.email || ''}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {order.address?.city}{order.address?.state ? `, ${order.address.state}` : ''}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                {order.orderItems?.map((item, index) => (
                                                    <div key={index} className="text-xs text-slate-600 bg-slate-50 px-2 py-1.5 rounded border border-slate-100 flex items-center justify-between gap-2">
                                                        <span className="truncate max-w-[140px]" title={item.product?.name}>
                                                            {item.product?.name || `Produto #${item.productId?.slice(-4)}`}
                                                        </span>
                                                        <span className="font-medium text-slate-500 bg-white px-1.5 rounded shadow-sm shrink-0">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <p className="text-xs font-medium">{order.paymentMethod || '—'}</p>
                                            {order.isCouponUsed && (
                                                <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full font-semibold mt-1 inline-block">
                                                    {order.couponCode || 'Cupom'}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-center text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                        </td>

                                        <td className="px-4 py-4 text-center font-medium text-slate-700">
                                            {currency}{Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`p-2 rounded-md outline-none border text-xs font-semibold cursor-pointer ${STATUS_STYLES[order.status] || 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                            >
                                                <option value="pending">Pendente</option>
                                                <option value="confirmed">Confirmado</option>
                                                <option value="shipped">Enviado</option>
                                                <option value="delivered">Entregue</option>
                                                <option value="cancelled">Cancelado</option>
                                            </select>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors inline-flex justify-center items-center"
                                                title="Excluir Pedido"
                                            >
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Linha de detalhes expansível */}
                                    {expandedId === order.id && (
                                        <OrderDetailRow order={order} currency={currency} />
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}