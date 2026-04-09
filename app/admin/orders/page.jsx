'use client'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { orderDummyData } from '@/assets/assets'

export default function ManageOrders() {
    const [orders, setOrders] = useState([])
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$'

    useEffect(() => {
        const stored = localStorage.getItem('inove_orders')
        if (stored) {
            setOrders(JSON.parse(stored))
        } else {
            // Normaliza o status 'DELIVERED' para 'delivered' para padronização
            const normalizedData = orderDummyData.map(o => ({ ...o, status: o.status.toLowerCase() }))
            setOrders(normalizedData)
            localStorage.setItem('inove_orders', JSON.stringify(normalizedData))
        }
    }, [])

    const handleStatusChange = (orderId, newStatus) => {
        const updated = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        )
        setOrders(updated)
        localStorage.setItem('inove_orders', JSON.stringify(updated))
        toast.success('Status do pedido atualizado!')
    }

    return (
        <div className="text-slate-500 mb-28 max-w-6xl">
            <h1 className="text-2xl mb-8">Gerenciar <span className="text-slate-800 font-medium">Pedidos</span></h1>

            {orders.length === 0 ? (
                <p className="text-slate-400">Nenhum pedido encontrado.</p>
            ) : (
                <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">ID do Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4 text-center">Data</th>
                                <th className="px-6 py-4 text-center">Total</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                                    <td className="px-6 py-4 font-medium text-slate-700">{order.id.slice(-8).toUpperCase()}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-800">{order.address.name}</p>
                                        <p className="text-xs text-slate-400">{order.address.city}, {order.address.state}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center font-medium text-slate-700">{currency}{order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-center">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`p-2 rounded-md outline-none border text-xs font-semibold cursor-pointer
                                                ${order.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                    order.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                        order.status === 'shipped' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                                                            order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                                                                'bg-red-50 border-red-200 text-red-700'}`}
                                        >
                                            <option value="pending">Pendente</option>
                                            <option value="confirmed">Confirmado</option>
                                            <option value="shipped">Enviado</option>
                                            <option value="delivered">Entregue</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}