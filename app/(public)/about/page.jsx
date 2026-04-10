import React from 'react'
import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { TargetIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react'

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-[70vh] text-slate-800 pb-20">
            <PageTitle heading="Sobre Nós" text="Conheça a nossa história" linkText="Ir para a loja" path="/shop" />
            
            <div className="mt-12 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                {/* Imagem (Hero / Store) */}
                <div className="w-full lg:w-1/2 relative bg-slate-100 rounded-3xl overflow-hidden shadow-md aspect-[4/3] lg:aspect-square group">
                    <Image
                        src={assets.happy_store}
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
                    <h2 className="text-3xl sm:text-4xl font-semibold text-slate-800 mb-6 leading-tight">
                        Inovação e Tecnologia em um <span className="text-green-500">só lugar.</span>
                    </h2>

                    <p className="text-lg font-medium text-slate-700">
                        Bem-vindo à INOVE-DEV, o seu destino definitivo para os gadgets mais recentes e inteligentes do mercado.
                    </p>

                    <p>
                        Nossa missão é trazer inovações tecnológicas e produtos essenciais diretamente para você, com foco absoluto em qualidade, design moderno e preços acessíveis. De smartphones de última geração a smartwatches e acessórios para casa inteligente, reunimos o melhor do mundo tech.
                    </p>

                    <p>
                        Acreditamos que fazer compras deve ser simples, inteligente e satisfatório. Por isso, nossa plataforma foi construída pensando na melhor experiência possível, garantindo segurança extrema desde a escolha do produto até a entrega rápida na porta da sua casa.
                    </p>

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