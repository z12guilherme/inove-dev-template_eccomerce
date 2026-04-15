'use client'
import React, { useState, useEffect } from 'react'
import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { TargetIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react'
import { dbAdapter } from '@/dbAdapter'

export default function About() {
    const [pageData, setPageData] = useState(null)

    useEffect(() => {
        dbAdapter.getPageContent('about').then(setPageData)
    }, [])

    if (!pageData) return <div className="min-h-screen p-12 text-center text-slate-400">Carregando história...</div>

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-[70vh] text-slate-800 pb-20">
            <PageTitle heading="Sobre Nós" text="Conheça a nossa história" linkText="Ir para a loja" path="/shop" />
            
            <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                {/* Imagem (Hero / Store) */}
                <div className="w-full lg:w-1/2 relative bg-slate-100 rounded-3xl overflow-hidden shadow-md aspect-[4/3] lg:aspect-square group">
                    <Image
                        src={assets.logo}
                        alt="Equipe INOVE-DEV"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-1">INOVE-DEV</h3>
                        <p className="text-white/90 text-sm sm:text-base">Tecnologia e Inovação que movem você.</p>
                    </div>
                </div>

                {/* Texto e Conteúdo */}
                <div className="w-full lg:w-1/2 space-y-6 text-slate-600 leading-relaxed">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-slate-800 mb-6 leading-tight whitespace-pre-wrap">
                        {pageData.title}
                    </h2>

                    {pageData.paragraphs.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={index === 0 ? "text-lg font-medium text-slate-700" : ""}>
                            {paragraph}
                        </p>
                    ))}

                    {/* Badges/Valores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 pt-8 border-t border-slate-200">
                        {[
                            { icon: TargetIcon, title: "Foco no Cliente", desc: "Sua satisfação em 1º lugar" },
                            { icon: ShieldCheckIcon, title: "Compra Segura", desc: "Dados 100% criptografados" },
                            { icon: ZapIcon, title: "Entrega Expressa", desc: "Rapidez para todo o Brasil" },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-500 p-3 rounded-xl shadow-sm border border-green-100">
                                    <item.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}