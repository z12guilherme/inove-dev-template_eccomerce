'use client'
import { productDummyData, orderDummyData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, TagsIcon, UsersIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        customers: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { title: 'Total de Produtos', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Receita Total', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total de Pedidos', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total de Clientes', value: dashboardData.customers, icon: UsersIcon },
    ]

    const fetchDashboardData = async () => {
        // Puxa os dados do LocalStorage ou usa os de teste como fallback
        const storedProducts = JSON.parse(localStorage.getItem('inove_products')) || productDummyData
        const storedOrders = JSON.parse(localStorage.getItem('inove_orders')) || orderDummyData

        // Calcula a receita total
        const totalRevenue = storedOrders.reduce((acc, order) => acc + (order.total || 0), 0)

        // Calcula clientes únicos (baseado no e-mail do endereço do pedido)
        const uniqueCustomers = new Set(storedOrders.map(order => order.address?.email)).size

        setDashboardData({
            products: storedProducts.length,
            revenue: totalRevenue.toFixed(2),
            orders: storedOrders.length,
            customers: uniqueCustomers,
            allOrders: storedOrders.map(order => ({ createdAt: order.createdAt, total: order.total }))
        })
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Painel <span className="text-slate-800 font-medium">Administrativo</span></h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            {/* Area Chart */}
            <OrdersAreaChart allOrders={dashboardData.allOrders} />
        </div>
    )
}