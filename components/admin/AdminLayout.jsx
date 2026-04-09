'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        const hasAdminAccess = localStorage.getItem('isAdmin') === 'true'
        setIsAdmin(hasAdminAccess)
        setLoading(false)
    }

    useEffect(() => {
        fetchIsAdmin()
    }, [])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">Você não tem permissão para acessar esta página</h1>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/admin-login" className="bg-green-500 text-white flex items-center justify-center gap-2 p-2 px-6 max-sm:text-sm rounded-full hover:bg-green-600 transition">
                    Fazer Login <ArrowRightIcon size={18} />
                </Link>
                <Link href="/" className="bg-slate-700 text-white flex items-center justify-center gap-2 p-2 px-6 max-sm:text-sm rounded-full hover:bg-slate-800 transition">
                    Voltar ao início
                </Link>
            </div>
        </div>
    )
}

export default AdminLayout