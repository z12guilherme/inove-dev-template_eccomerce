'use client'
import React, { useState, useEffect } from 'react'
import { Trash2Icon, PlusIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { couponDummyData } from '@/assets/assets'

export default function ManageCoupons() {
    const [coupons, setCoupons] = useState([])
    const [newCoupon, setNewCoupon] = useState({ code: '', description: '', discount: '' })

    useEffect(() => {
        const stored = localStorage.getItem('inove_coupons')
        if (stored) {
            setCoupons(JSON.parse(stored))
        } else {
            setCoupons(couponDummyData)
            localStorage.setItem('inove_coupons', JSON.stringify(couponDummyData))
        }
    }, [])

    const handleAdd = (e) => {
        e.preventDefault()
        if (!newCoupon.code.trim() || !newCoupon.discount) return
        
        const codeUpper = newCoupon.code.trim().toUpperCase()
        
        if (coupons.some(c => c.code === codeUpper)) {
            return toast.error("Cupom já existe!")
        }
        
        const addedCoupon = {
            code: codeUpper,
            description: newCoupon.description.trim() || `Desconto de ${newCoupon.discount}%`,
            discount: Number(newCoupon.discount),
            createdAt: new Date().toISOString()
        }
        
        const updated = [addedCoupon, ...coupons]
        setCoupons(updated)
        localStorage.setItem('inove_coupons', JSON.stringify(updated))
        setNewCoupon({ code: '', description: '', discount: '' })
        toast.success("Cupom adicionado!")
    }

    const handleDelete = (code) => {
        if (confirm("Tem certeza que deseja excluir este cupom?")) {
            const updated = coupons.filter(c => c.code !== code)
            setCoupons(updated)
            localStorage.setItem('inove_coupons', JSON.stringify(updated))
            toast.success("Cupom excluído!")
        }
    }

    return (
        <div className="text-slate-500 mb-28 max-w-5xl">
            <h1 className="text-2xl mb-8">Gerenciar <span className="text-slate-800 font-medium">Cupons</span></h1>
            
            <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label className="block text-sm text-slate-600 mb-1">Código do Cupom</label>
                    <input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})} placeholder="Ex: INOVE20" className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500 uppercase" required />
                </div>
                <div className="w-full md:w-1/3">
                    <label className="block text-sm text-slate-600 mb-1">Desconto (%)</label>
                    <input type="number" min="1" max="100" value={newCoupon.discount} onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})} placeholder="Ex: 20" className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500" required />
                </div>
                <div className="w-full md:w-1/3">
                    <label className="block text-sm text-slate-600 mb-1">Descrição (opcional)</label>
                    <input type="text" value={newCoupon.description} onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})} placeholder="Ex: Cupom de Black Friday" className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500" />
                </div>
                <button type="submit" className="bg-green-500 text-white px-6 py-2.5 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 font-medium w-full md:w-auto h-[42px]">
                    <PlusIcon size={18} /> Adicionar
                </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Código</th>
                            <th className="px-6 py-4">Descrição</th>
                            <th className="px-6 py-4 text-center">Desconto</th>
                            <th className="px-6 py-4 text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {coupons.map((coupon, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-700">{coupon.code}</td>
                                <td className="px-6 py-4 text-sm">{coupon.description}</td>
                                <td className="px-6 py-4 text-center font-medium text-green-600">{coupon.discount}%</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleDelete(coupon.code)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition inline-flex justify-center items-center" title="Excluir">
                                        <Trash2Icon size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-slate-400">Nenhum cupom cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}