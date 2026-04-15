'use client'
import React, { useState, useEffect } from 'react'
import { dbAdapter } from '@/dbAdapter'
import toast from 'react-hot-toast'
import { SaveIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, EyeOffIcon, LayoutTemplateIcon } from 'lucide-react'

export default function HomeLayoutSettings() {
    const [layout, setLayout] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const data = await dbAdapter.getHomeLayout()
            const sorted = [...data].sort((a, b) => a.order - b.order)
            setLayout(sorted)
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        const finalLayout = layout.map((item, idx) => ({ ...item, order: idx + 1 }))
        setLayout(finalLayout)
        await dbAdapter.saveHomeLayout(finalLayout)
        toast.success('Layout da Home atualizado e salvo!')
    }

    const moveItem = (index, direction) => {
        if (direction === -1 && index === 0) return
        if (direction === 1 && index === layout.length - 1) return

        const newLayout = [...layout]
        const temp = newLayout[index]
        newLayout[index] = newLayout[index + direction]
        newLayout[index + direction] = temp
        setLayout(newLayout)
    }

    const toggleVisibility = (id) => {
        setLayout(layout.map(item => item.id === id ? { ...item, visible: !item.visible } : item))
    }

    if (loading) return <div className="p-6 text-slate-400">Carregando esquema do layout...</div>

    return (
        <div className="max-w-4xl mb-28">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
                <div>
                    <h1 className="text-2xl text-slate-800 font-medium">Layout da Home</h1>
                    <p className="text-sm text-slate-500 mt-1">Acenda, apague ou reordene os blocos da página principal da loja (clique nas setinhas).</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm pl-4 text-sm"
                >
                    <SaveIcon size={16} /> Salvar Alterações
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 pb-2">
                <div className="space-y-3 mb-4">
                    {layout.map((item, idx) => (
                        <div 
                            key={item.id} 
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.visible ? 'border-slate-200 bg-white shadow-sm' : 'border-dashed border-slate-200 bg-slate-50 opacity-70'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className="flex flex-col gap-1 text-slate-400 bg-slate-100 rounded-lg p-1">
                                    <button 
                                        disabled={idx === 0} 
                                        onClick={() => moveItem(idx, -1)}
                                        className="hover:text-green-600 hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition p-1"
                                    ><ArrowUpIcon size={16} /></button>
                                    <button 
                                        disabled={idx === layout.length - 1} 
                                        onClick={() => moveItem(idx, 1)}
                                        className="hover:text-green-600 hover:bg-white rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition p-1"
                                    ><ArrowDownIcon size={16} /></button>
                                </div>
                                <div>
                                    <h3 className={`font-medium flex items-center gap-2 ${item.visible ? 'text-slate-800' : 'text-slate-500'}`}>
                                        <LayoutTemplateIcon size={16} className={item.visible ? "text-green-500" : "text-slate-400"} />
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                        ID Interno: <span className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{item.id}</span>
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => toggleVisibility(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${item.visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                            >
                                {item.visible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                                {item.visible ? 'Bloco Visível' : 'Bloco Oculto'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <p className="mt-5 text-sm text-center text-slate-500">
                💡 O novo layout só entrará no ar para os clientes finais após clicar em <b>Salvar Alterações</b>.
            </p>
        </div>
    )
}
