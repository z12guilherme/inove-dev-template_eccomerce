'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);

    // === Sistema de Variantes ===

    // Deduplicador de segurança para opções corrompidas (mesmo nome repetido)
    const uniqueOptions = [];
    if (product.hasVariants && product.variantOptions) {
        const optionMap = new Map();
        product.variantOptions.forEach(opt => {
            if (opt.name && !optionMap.has(opt.name)) {
                optionMap.set(opt.name, true);
                uniqueOptions.push({
                    ...opt,
                    // Garante que os valores (ex: P, M, G) não venham duplicados
                    values: [...new Set(opt.values)]
                });
            }
        });
    }

    const [selectedOptions, setSelectedOptions] = useState(() => {
        const initial = {}
        uniqueOptions.forEach(opt => {
            if (opt.values && opt.values.length > 0) {
                initial[opt.name] = opt.values[0] // auto-select
            }
        })
        return initial
    })

    const currentVariant = product.hasVariants ? product.variants?.find(v => {
        return Object.keys(v.combination).every(key => v.combination[key] === selectedOptions[key])
    }) : null

    const activeVariant = currentVariant || product.variants?.[0] || null;

    // Fallback: se a variação não tiver preço definido (0), puxa o preço geral do produto
    const basePrice = Number(product.price || 0);
    const baseMrp = Number(product.mrp || 0);

    const displayPrice = product.hasVariants && activeVariant ? Number(activeVariant.price || basePrice) : basePrice;
    const displayMrp = product.hasVariants && activeVariant ? Number(activeVariant.mrp || baseMrp || displayPrice * 1.3) : baseMrp;
    const finalItemId = product.hasVariants && activeVariant ? `${product.id}|${activeVariant.stringKey}` : product.id
    // ============================

    const addToCartHandler = () => {
        dispatch(addToCart({ productId: finalItemId }))
        toast.success(`${product.name} no carrinho!`, {
            icon: '🛒',
            duration: 3000,
            position: 'top-center',
        });
    }

    const averageRating = product.rating?.length ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length : 0;

    const discountPercentage = displayMrp > 0 ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating?.length || 0} Avaliações</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{displayPrice.toFixed(2)} </p>
                    {displayMrp > displayPrice && (
                        <p className="text-xl text-slate-500 line-through">{currency}{displayMrp.toFixed(2)}</p>
                    )}
                </div>
                {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <TagIcon size={14} />
                        <p>Economize {discountPercentage}% agora mesmo</p>
                    </div>
                )}

                {/* Opções de Variações Condicionais */}
                {product.hasVariants && uniqueOptions.length > 0 && (
                    <div className="my-6 space-y-4">
                        {uniqueOptions.map((opt, idx) => (
                            <div key={idx}>
                                <h3 className="text-sm font-medium text-slate-800 mb-2">{opt.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {opt.values.map((val, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
                                            className={`px-4 py-1.5 border rounded-md text-sm transition ${selectedOptions[opt.name] === val ? 'bg-green-500 text-white border-green-500 font-medium shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[finalItemId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantidade</p>
                                <Counter productId={finalItemId} />
                            </div>
                        )
                    }
                    <button onClick={() => !cart[finalItemId] ? addToCartHandler() : router.push('/cart')} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
                        {!cart[finalItemId] ? 'Adicionar ao Carrinho' : 'Ver Carrinho'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Frete grátis para todo o Brasil </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> Pagamento 100% Seguro </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Aprovado pelas melhores marcas </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails