'use client'
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [settings, setSettings] = useState({ storeName: 'INOVE-DEV', logo: null })
    const cartCount = useSelector(state => state.cart.total)

    useEffect(() => {
        const stored = localStorage.getItem('inove_settings')
        if (stored) {
            setSettings(JSON.parse(stored))
        }
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative flex items-center gap-2 text-3xl sm:text-4xl font-semibold text-slate-700">
                        {settings.logo ? (
                            <Image src={settings.logo} alt={settings.storeName} width={150} height={40} className="h-10 w-auto object-contain" />
                        ) : (
                            <span className="tracking-tight">{settings.storeName}</span>
                        )}
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                    <Link href="/">Início</Link>
                    <Link href="/shop">Loja</Link>
                    <Link href="/">Sobre</Link>
                    <Link href="/">Contato</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                        <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Buscar produtos" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                        Carrinho
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        <button onClick={() => router.push('/admin-login')} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                        Entrar
                        </button>

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        <button onClick={() => router.push('/admin-login')} className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                        Entrar
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar