'use client'
import React from 'react'
import PageTitle from '@/components/PageTitle'
import toast from 'react-hot-toast'
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react'
import { dbAdapter } from '@/dbAdapter'

export default function Contact() {
    const [pageData, setPageData] = useState(null)

    useEffect(() => {
        dbAdapter.getPageContent('contact').then(setPageData)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success('Mensagem enviada com sucesso! Retornaremos em breve.')
        e.target.reset() // Limpa o formulário após o "envio"
    }

    if (!pageData) return <div className="min-h-screen p-12 text-center text-slate-400">Carregando contatos...</div>

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-[60vh]">
            <PageTitle heading="Contato" text="Fale com a nossa equipe" linkText="Voltar à Loja" path="/shop" />
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Informações */}
                <div>
                    <h3 className="text-xl font-medium text-slate-800 mb-6">Informações de Contato</h3>
                    <div className="space-y-6 text-slate-600">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-full text-green-600"><MapPinIcon size={24} /></div>
                            <p>{pageData.address}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-full text-green-600"><PhoneIcon size={24} /></div>
                            <p>{pageData.phone}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-full text-green-600"><MailIcon size={24} /></div>
                            <p>{pageData.email}</p>
                        </div>
                    </div>
                </div>
                
                {/* Formulário */}
                <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
                    <h3 className="text-xl font-medium text-slate-800 mb-6">Envie uma Mensagem</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nome Completo" required className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition-shadow" />
                            <input type="email" placeholder="E-mail" required className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition-shadow" />
                        </div>
                        <textarea placeholder="Como podemos te ajudar?" required rows="4" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition-shadow"></textarea>
                        <button className="w-full bg-slate-800 text-white font-medium py-3.5 rounded-lg hover:bg-slate-900 active:scale-95 transition-all">Enviar Mensagem</button>
                    </form>
                </div>
            </div>
        </div>
    )
}