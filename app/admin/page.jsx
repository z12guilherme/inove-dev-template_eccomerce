'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { dbAdapter } from "../../dbAdapter"
import { CircleDollarSignIcon, ShoppingBasketIcon, TagsIcon, UsersIcon } from "lucide-react"
import toast from "react-hot-toast"
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
        // Agora utilizamos o nosso Adapter centralizado (Padrão Repository)
        const storedProducts = await dbAdapter.getProducts()
        const storedOrders = await dbAdapter.getOrders()

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

    const handleTestOrder = async () => {
        toast.loading('Simulando pedido...')

        // Dados de exemplo para o novo pedido
        const sampleOrderData = {
            total: 288.90,
            status: "pending",
            userId: "user_31dQbH27HVtovbs13X2cmqefddM", // ID do usuário admin
            paymentMethod: "PIX",
            isCouponUsed: false,
            orderItems: [
                { productId: "prod_1", quantity: 1, price: 99.90, product: { name: "Luminária de Mesa" } },
                { productId: "prod_2", quantity: 1, price: 189.00, product: { name: "Smart Speaker" } }
            ],
            address: {
                name: "Cliente de Teste",
                email: `teste${Date.now()}@inovedev.com`,
                street: "Rua do Teste, 123",
                city: "Cidade Teste",
            }
        };

        try {
            const newOrder = await dbAdapter.createOrder(sampleOrderData);
            toast.dismiss();
            if (newOrder) {
                toast.success(`Pedido de teste #${newOrder.id.split('_')[1]} criado!`);
                // Re-busca os dados para atualizar o painel em tempo real
                await fetchDashboardData();
            } else {
                toast.error("Falha ao criar o pedido de teste.");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Erro ao criar pedido de teste:", error);
            toast.error("Ocorreu um erro ao criar o pedido.");
        }
    };

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl">Painel <span className="text-slate-800 font-medium">Administrativo</span></h1>
                <button onClick={handleTestOrder} className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-2 px-4 rounded-lg shadow-sm">
                    Simular Novo Pedido
                </button>
            </div>

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