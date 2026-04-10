'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingCartIcon, PackageIcon } from "lucide-react";
import ShippingCalculator from "@/components/ShippingCalculator";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="Meu Carrinho" text="itens no seu carrinho" linkText="Adicionar mais" />

                <div className="flex items-start justify-between gap-8 max-lg:flex-col pb-20">

                    <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Produto</th>
                                    <th className="px-6 py-4 text-center">Quantidade</th>
                                    <th className="px-6 py-4 text-center">Preço Total</th>
                                    <th className="px-6 py-4 text-center max-md:hidden">Remover</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {
                                    cartArray.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5 flex gap-4 items-center">
                                                <div className="flex-shrink-0 bg-slate-100 border border-slate-200 rounded-lg shadow-sm h-16 w-16 flex items-center justify-center">
                                                    <PackageIcon className="text-slate-400" size={32} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-800 text-base max-sm:text-sm">{item.name}</span>
                                                    <span className="text-xs text-slate-400 mt-1">{item.category}</span>
                                                    <span className="text-sm font-semibold text-slate-600 mt-1.5">{currency}{item.price}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Counter productId={item.id} />
                                            </td>
                                            <td className="px-6 py-5 text-center font-medium text-slate-700 text-lg">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                            <td className="px-6 py-5 text-center max-md:hidden">
                                                <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors inline-flex justify-center items-center">
                                                    <Trash2Icon size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="w-full lg:w-[400px] flex flex-col gap-6">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <ShippingCalculator onShippingCalculated={setShippingCost} />
                        </div>
                        <OrderSummary totalPrice={totalPrice} shippingCost={shippingCost} items={cartArray} />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[70vh] mx-6 flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="bg-slate-50 p-8 rounded-full text-slate-300 mb-2 shadow-inner border border-slate-100">
                <ShoppingCartIcon size={80} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-700">Seu carrinho está vazio</h1>
            <p className="text-slate-500 text-sm max-w-sm text-center">Parece que você ainda não adicionou nenhum produto. Explore nossas categorias e encontre o que você precisa!</p>
            <Link href="/shop" className="mt-6 bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 hover:shadow-md transition-all font-medium active:scale-95">
                Ir para a Loja
            </Link>
        </div>
    )
}