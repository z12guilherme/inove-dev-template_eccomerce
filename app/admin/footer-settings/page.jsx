'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, Trash2Icon, SaveIcon, GlobeIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { dbAdapter } from '@/dbAdapter'

const DEFAULT_SETTINGS = {
    socialLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
    },
    contact: {
        phone: '',
        email: '',
        address: '',
    },
    productsLinks: [],
    navigationLinks: [],
}

export default function FooterSettings() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [loading, setLoading] = useState(true)
    const [newProductLink, setNewProductLink] = useState({ text: '', path: '/' })
    const [newNavLink, setNewNavLink] = useState({ text: '', path: '/' })

    useEffect(() => {
        dbAdapter.getFooterSettings().then(data => {
            setSettings(data)
            setLoading(false)
        })
    }, [])

    const handleSave = async () => {
        await dbAdapter.saveFooterSettings(settings)
        // Dispara evento para o Footer na aba pública atualizar
        window.dispatchEvent(new Event('storage'))
        toast.success('Configurações do rodapé salvas!')
    }

    const handleSocialChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [key]: value }
        }))
    }

    const handleContactChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            contact: { ...prev.contact, [key]: value }
        }))
    }

    const handleAddProductLink = (e) => {
        e.preventDefault()
        if (!newProductLink.text.trim()) return
        setSettings(prev => ({
            ...prev,
            productsLinks: [...prev.productsLinks, { ...newProductLink }]
        }))
        setNewProductLink({ text: '', path: '/' })
    }

    const handleRemoveProductLink = (index) => {
        setSettings(prev => ({
            ...prev,
            productsLinks: prev.productsLinks.filter((_, i) => i !== index)
        }))
    }

    const handleAddNavLink = (e) => {
        e.preventDefault()
        if (!newNavLink.text.trim()) return
        setSettings(prev => ({
            ...prev,
            navigationLinks: [...prev.navigationLinks, { ...newNavLink }]
        }))
        setNewNavLink({ text: '', path: '/' })
    }

    const handleRemoveNavLink = (index) => {
        setSettings(prev => ({
            ...prev,
            navigationLinks: prev.navigationLinks.filter((_, i) => i !== index)
        }))
    }

    if (loading) return <div className="text-slate-400 p-6">Carregando...</div>

    return (
        <div className="text-slate-500 mb-28 max-w-4xl">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
                <h1 className="text-2xl">Configurar <span className="text-slate-800 font-medium">Rodapé</span></h1>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-5 rounded-lg transition shadow-sm text-sm"
                >
                    <SaveIcon size={16} /> Salvar Alterações
                </button>
            </div>

            {/* Redes Sociais */}
            <Section title="Redes Sociais" icon={<GlobeIcon size={16} />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { key: 'facebook', label: 'Facebook' },
                        { key: 'instagram', label: 'Instagram' },
                        { key: 'twitter', label: 'Twitter / X' },
                        { key: 'linkedin', label: 'LinkedIn' },
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <label className="block text-xs text-slate-500 mb-1">{label}</label>
                            <input
                                type="url"
                                value={settings.socialLinks[key]}
                                onChange={e => handleSocialChange(key, e.target.value)}
                                placeholder={`https://www.${key}.com/sua-pagina`}
                                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                            />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Contato */}
            <Section title="Informações de Contato">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Telefone</label>
                        <input
                            type="text"
                            value={settings.contact.phone}
                            onChange={e => handleContactChange('phone', e.target.value)}
                            placeholder="+55 11 99999-9999"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={settings.contact.email}
                            onChange={e => handleContactChange('email', e.target.value)}
                            placeholder="contato@suaempresa.com"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-slate-500 mb-1">Endereço</label>
                        <input
                            type="text"
                            value={settings.contact.address}
                            onChange={e => handleContactChange('address', e.target.value)}
                            placeholder="Rua da Inovação, 123 - São Paulo, SP"
                            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                        />
                    </div>
                </div>
            </Section>

            {/* Links de Produtos */}
            <Section title="Links — Seção &quot;Produtos&quot;">
                <LinkManager
                    links={settings.productsLinks}
                    newLink={newProductLink}
                    onNewLinkChange={setNewProductLink}
                    onAdd={handleAddProductLink}
                    onRemove={handleRemoveProductLink}
                />
            </Section>

            {/* Links de Navegação */}
            <Section title="Links — Seção &quot;Navegação&quot;">
                <LinkManager
                    links={settings.navigationLinks}
                    newLink={newNavLink}
                    onNewLinkChange={setNewNavLink}
                    onAdd={handleAddNavLink}
                    onRemove={handleRemoveNavLink}
                />
            </Section>
        </div>
    )
}

// ─── Componente auxiliar: seção com card ────────────────────────────────────
function Section({ title, icon, children }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="flex items-center gap-2 text-slate-700 font-medium mb-5 text-sm uppercase tracking-wider">
                {icon}
                {title}
            </h2>
            {children}
        </div>
    )
}

// ─── Componente auxiliar: gerenciador de links ──────────────────────────────
function LinkManager({ links, newLink, onNewLinkChange, onAdd, onRemove }) {
    return (
        <>
            <form onSubmit={onAdd} className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                    type="text"
                    value={newLink.text}
                    onChange={e => onNewLinkChange({ ...newLink, text: e.target.value })}
                    placeholder="Texto do link"
                    className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                    required
                />
                <input
                    type="text"
                    value={newLink.path}
                    onChange={e => onNewLinkChange({ ...newLink, path: e.target.value })}
                    placeholder="Caminho (ex: /produtos)"
                    className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                />
                <button
                    type="submit"
                    className="flex items-center gap-1 justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium"
                >
                    <PlusIcon size={16} /> Adicionar
                </button>
            </form>

            {links.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Nenhum link cadastrado.</p>
            ) : (
                <ul className="divide-y divide-slate-100">
                    {links.map((link, i) => (
                        <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                            <div>
                                <span className="text-slate-700 font-medium">{link.text}</span>
                                <span className="ml-3 text-slate-400 text-xs">{link.path}</span>
                            </div>
                            <button
                                onClick={() => onRemove(i)}
                                className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition"
                                title="Remover"
                            >
                                <Trash2Icon size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
