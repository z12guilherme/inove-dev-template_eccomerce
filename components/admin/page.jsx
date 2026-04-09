'use client'
import React, { useState, useEffect } from 'react'
import { Trash2Icon, PlusIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { categories as defaultCategories } from '@/assets/assets'

export default function ManageCategories() {
    const [categories, setCategories] = useState([])
    const [newCategory, setNewCategory] = useState('')

    useEffect(() => {
        const stored = localStorage.getItem('inove_categories')
        if (stored) {
            setCategories(JSON.parse(stored))
        } else {
            setCategories(defaultCategories)
            localStorage.setItem('inove_categories', JSON.stringify(defaultCategories))
        }
    }, [])

    const handleAdd = (e) => {
        e.preventDefault()
        if (!newCategory.trim()) return
        if (categories.includes(newCategory.trim())) {
            return toast.error("Categoria já existe!")
        }
        const updated = [...categories, newCategory.trim()]
        setCategories(updated)
        localStorage.setItem('inove_categories', JSON.stringify(updated))
        setNewCategory('')
        toast.success("Categoria adicionada!")
    }

    const handleDelete = (cat) => {
        if (confirm("Tem certeza que deseja excluir esta categoria?")) {
            const updated = categories.filter(c => c !== cat)
            setCategories(updated)
            localStorage.setItem('inove_categories', JSON.stringify(updated))
            toast.success("Categoria excluída!")
        }
    }

    return (
        <div className="text-slate-500 mb-28 max-w-3xl">
            <h1 className="text-2xl mb-8">Gerenciar <span className="text-slate-800 font-medium">Categorias</span></h1>
            
            <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nova categoria..." className="flex-1 p-2 border border-slate-200 rounded outline-none focus:border-green-500 bg-white" />
                <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 font-medium">
                    <PlusIcon size={18} /> Adicionar
                </button>
            </form>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-100">
                    {categories.map((cat, index) => (
                        <li key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                            <span className="font-medium text-slate-700">{cat}</span>
                            <button onClick={() => handleDelete(cat)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition" title="Excluir">
                                <Trash2Icon size={20} />
                            </button>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <li className="p-6 text-center text-slate-400">Nenhuma categoria cadastrada.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}