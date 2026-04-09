'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { Trash2Icon } from 'lucide-react'
import { deleteProduct } from '@/lib/features/product/productSlice'
import toast from 'react-hot-toast'

export default function ManageProducts() {
    const products = useSelector(state => state.product.list)
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$'

    const handleDelete = (id) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            dispatch(deleteProduct(id))
            toast.success("Produto excluído com sucesso!")
        }
    }

    return (
        <div className="text-slate-500 mb-28 max-w-5xl">
            <h1 className="text-2xl mb-8">Gerenciar <span className="text-slate-800 font-medium">Produtos</span></h1>
            
            {products.length === 0 ? (
                <p className="text-slate-400">Nenhum produto cadastrado no momento.</p>
            ) : (
                <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4 text-center">Categoria</th>
                                <th className="px-6 py-4 text-center">Preço</th>
                                <th className="px-6 py-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 flex gap-4 items-center">
                                        <div className="flex-shrink-0 bg-white border border-slate-100 p-1.5 rounded-lg shadow-sm">
                                            <Image src={product.images[0]} className="h-12 w-12 object-contain" alt={product.name} width={48} height={48} />
                                        </div>
                                        <span className="font-medium text-slate-800">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">{product.category}</td>
                                    <td className="px-6 py-4 text-center font-medium text-slate-700">{currency}{product.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors inline-flex justify-center items-center" title="Excluir Produto">
                                            <Trash2Icon size={20} />
                                        </button>
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