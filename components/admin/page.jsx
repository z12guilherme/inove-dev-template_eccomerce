'use client'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { assets } from '@/assets/assets'

export default function StoreSettings() {
    const [settings, setSettings] = useState({
        storeName: 'INOVE-DEV',
        bannerText: 'Ganhe 20% de DESCONTO no seu primeiro pedido!',
        logo: null
    })

    useEffect(() => {
        const stored = localStorage.getItem('inove_settings')
        if (stored) setSettings(JSON.parse(stored))
    }, [])

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const base64 = await getBase64(file)
            setSettings({ ...settings, logo: base64 })
        }
    }

    const handleSave = (e) => {
        e.preventDefault()
        localStorage.setItem('inove_settings', JSON.stringify(settings))
        toast.success('Configurações salvas com sucesso!')
        // Recarrega para atualizar a logo na navbar imediatamente
        setTimeout(() => window.location.reload(), 1000)
    }

    return (
        <div className="text-slate-500 mb-28 max-w-2xl">
            <h1 className="text-2xl mb-8">Configurações da <span className="text-slate-800 font-medium">Loja</span></h1>
            
            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex flex-col gap-6">
                <div>
                    <label className="block text-sm text-slate-600 mb-2">Logo da Loja</label>
                    <div className="flex items-center gap-4">
                        <label htmlFor="logoUpload" className="cursor-pointer">
                            <Image 
                                src={settings.logo || assets.upload_area} 
                                alt="Logo" 
                                width={100} height={100} 
                                className="w-20 h-20 object-contain border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition"
                            />
                            <input type="file" id="logoUpload" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        <p className="text-xs text-slate-400 max-w-xs">Clique na imagem para enviar uma nova logo. Recomendado formato PNG transparente.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-600 mb-2">Nome da Loja</label>
                    <input type="text" value={settings.storeName} onChange={(e) => setSettings({...settings, storeName: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded outline-none focus:border-green-500 text-slate-700" required />
                </div>

                <div>
                    <label className="block text-sm text-slate-600 mb-2">Texto do Banner Promocional</label>
                    <input type="text" value={settings.bannerText} onChange={(e) => setSettings({...settings, bannerText: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded outline-none focus:border-green-500 text-slate-700" required />
                </div>

                <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition font-medium mt-4">
                    Salvar Configurações
                </button>
            </form>
        </div>
    )
}