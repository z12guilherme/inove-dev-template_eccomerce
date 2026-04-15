'use client'
import React, { useState, useEffect } from 'react'
import { dbAdapter } from '@/dbAdapter'
import toast from 'react-hot-toast'
import { SaveIcon, FileTextIcon, HelpCircleIcon } from 'lucide-react'

export default function PagesSettings() {
    const [activeTab, setActiveTab] = useState('about')
    const [aboutData, setAboutData] = useState({ title: '', paragraphs: '' })
    const [contactData, setContactData] = useState({ address: '', phone: '', email: '' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const ab = await dbAdapter.getPageContent('about')
            const ct = await dbAdapter.getPageContent('contact')
            if (ab) setAboutData(ab)
            if (ct) setContactData(ct)
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        if (activeTab === 'about') {
            await dbAdapter.savePageContent('about', aboutData)
        } else {
            await dbAdapter.savePageContent('contact', contactData)
        }
        toast.success('Página salva com sucesso!')
    }

    if (loading) return <div className="p-6 text-slate-400">Carregando conteúdos...</div>

    return (
        <div className="max-w-4xl mb-28">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
                <div>
                    <h1 className="text-2xl text-slate-800 font-medium">Gestão de Páginas</h1>
                    <p className="text-sm text-slate-500 mt-1">Edite os textos principais das páginas institucionais secundárias.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg transition shadow-sm text-sm"
                >
                    <SaveIcon size={16} /> Salvar Conteúdo
                </button>
            </div>

            {/* Abas */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
                <button 
                    onClick={() => setActiveTab('about')}
                    className={`flex items-center gap-2 py-2.5 px-5 text-sm font-medium border-b-2 transition ${activeTab === 'about' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <FileTextIcon size={16} /> Sobre Nós
                </button>
                <button 
                    onClick={() => setActiveTab('contact')}
                    className={`flex items-center gap-2 py-2.5 px-5 text-sm font-medium border-b-2 transition ${activeTab === 'contact' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <HelpCircleIcon size={16} /> Contato
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                {activeTab === 'about' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Título Atrativo (Headline)</label>
                            <input 
                                type="text"
                                value={aboutData.title}
                                onChange={e => setAboutData({...aboutData, title: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-green-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Conteúdo / História (Parágrafos)</label>
                            <textarea 
                                rows={8}
                                value={aboutData.paragraphs}
                                onChange={e => setAboutData({...aboutData, paragraphs: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-green-500 leading-relaxed text-sm"
                            />
                            <p className="text-xs text-slate-400 mt-2">Dica: Deixe uma linha em branco entre os textos para que novos parágrafos sejam gerados no site final.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'contact' && (
                    <div className="space-y-5 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Endereço Físico</label>
                            <input type="text" value={contactData.address} onChange={e => setContactData({...contactData, address: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-green-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Telefone Público</label>
                            <input type="text" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-green-500 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">E-mail Comercial</label>
                            <input type="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-green-500 text-sm" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
