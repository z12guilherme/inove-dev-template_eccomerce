'use client'
import { XIcon, Trash2Icon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Counter from "./Counter";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";

export default function CartDrawer({ isOpen, setIsOpen }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$';
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (products.length > 0) {
            let total = 0;
            const arr = [];
            for (const [key, value] of Object.entries(cartItems)) {
                const [productId, variantKey] = key.split('|');
                const product = products.find(p => p.id === productId);
                if (product) {
                    let currentVariant = null;
                    if (variantKey && product.variants) {
                        currentVariant = product.variants.find(v => v.stringKey === variantKey);
                    }
                    const price = currentVariant ? currentVariant.price : product.price;
                    arr.push({
                        ...product,
                        cartItemId: key,
                        variantKey: variantKey || null,
                        price: price,
                        quantity: value,
                    });
                    total += price * value;
                }
            }
            setCartArray(arr);
            setTotalPrice(total);
        } else {
            setCartArray([]);
            setTotalPrice(0);
        }
    }, [cartItems, products]);

    const handleDelete = (id) => {
        dispatch(deleteItemFromCart({ productId: id }));
    };

    return (
        <>
            {/* Backdrop Escurecido */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer Lateral */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Cabeçalho */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Seu Carrinho</h2>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition bg-slate-100 p-2 rounded-full">
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Lista de Itens */}
                <div className="flex-1 overflow-y-auto p-5">
                    {cartArray.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <div className="bg-slate-50 p-6 rounded-full border border-slate-100">
                                <ShoppingCartIcon size={40} className="text-slate-300" />
                            </div>
                            <p className="font-medium text-slate-600">Seu carrinho está vazio</p>
                            <button onClick={() => setIsOpen(false)} className="mt-2 text-green-500 font-medium hover:underline">Explorar produtos</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {cartArray.map((item) => (
                                <div key={item.cartItemId} className="flex gap-4">
                                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 border border-slate-200 p-2 flex items-center justify-center">
                                        <Image src={item.images[0]} alt={item.name} width={80} height={80} className="object-contain max-h-full" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="text-sm font-medium text-slate-800 line-clamp-1" title={item.name}>{item.name}</p>
                                        {item.variantKey && (
                                            <p className="text-xs text-slate-500 mt-0.5 bg-slate-50 border border-slate-200 w-fit px-1.5 rounded">{item.variantKey}</p>
                                        )}
                                        <p className="text-sm font-semibold text-slate-600 mt-1">{currency}{item.price.toFixed(2)}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <Counter productId={item.cartItemId} />
                                            <button onClick={() => handleDelete(item.cartItemId)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded transition">
                                                <Trash2Icon size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rodapé (Finalizar) */}
                {cartArray.length > 0 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50">
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-slate-500 font-medium">Subtotal</p>
                            <p className="text-2xl font-semibold text-slate-800">{currency}{totalPrice.toFixed(2)}</p>
                        </div>
                        <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full bg-green-500 text-white py-3.5 rounded-lg font-medium hover:bg-green-600 transition active:scale-95 mb-3 shadow-sm">
                            Finalizar Pedido
                        </Link>
                        <button onClick={() => setIsOpen(false)} className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700 transition">
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}