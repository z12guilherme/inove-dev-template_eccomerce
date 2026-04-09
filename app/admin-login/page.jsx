'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleLogin = (e) => {
        e.preventDefault()
        // Aceita qualquer credencial (Mock de demonstração)
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('isSeller', 'true') // Libera a área de vendedor também, se desejar
        router.push('/admin')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-slate-800 mb-2">Login <span className="text-green-500">Admin</span></h1>
                    <p className="text-sm text-slate-500">Insira qualquer e-mail e senha para acessar (Demonstração)</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 outline-none border border-slate-300 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" placeholder="admin@inove-dev.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2.5 outline-none border border-slate-300 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="mt-4 w-full bg-green-500 text-white font-medium py-2.5 rounded-md hover:bg-green-600 transition active:scale-95">
                        Acessar Painel
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-slate-500 hover:text-green-500 transition">
                        &larr; Voltar para a loja
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin