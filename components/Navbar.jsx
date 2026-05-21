'use client'
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import CartDrawer from "./CartDrawer";
import { getAppearance, defaultAppearance } from "@/lib/appearanceStore";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const [storeName, setStoreName] = useState(defaultAppearance.storeName)
    const [logo, setLogo] = useState(null)
    const cartCount = useSelector(state => state.cart.total)
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        const load = () => {
            const appearance = getAppearance()
            setStoreName(appearance.storeName || defaultAppearance.storeName)

            // Logo ainda vem de inove_settings por compatibilidade
            const stored = localStorage.getItem('inove_settings')
            if (stored) {
                const parsed = JSON.parse(stored)
                setLogo(parsed.logo || null)
            }
        }
        load()
        window.addEventListener('storage', load)
        return () => window.removeEventListener('storage', load)
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
                        {logo ? (
                            <Image src={logo} alt={storeName} width={150} height={40} className="h-10 w-auto object-contain" />
                        ) : (
                            <span className="tracking-tight">{storeName}</span>
                        )}
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-brand">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Início</Link>
                        <Link href="/shop">Loja</Link>
                        <Link href="/about">Sobre</Link>
                        <Link href="/contact">Contato</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Buscar produtos" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 text-slate-600 hover:text-slate-800 transition outline-none cursor-pointer">
                            <ShoppingCart size={18} />
                            Carrinho
                            <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">{cartCount}</span>
                        </button>

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

                <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar