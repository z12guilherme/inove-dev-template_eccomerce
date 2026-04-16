'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addProduct } from "@/lib/features/product/productSlice"
import { useRouter } from "next/navigation"

export default function AdminAddProduct() {

    const [categories, setCategories] = useState([])
    const [hasVariants, setHasVariants] = useState(false)
    const [variantOptions, setVariantOptions] = useState([{ name: 'Tamanho', values: 'P, M, G' }])
    const [generatedVariants, setGeneratedVariants] = useState([])

    useEffect(() => {
        const stored = localStorage.getItem('inove_categories')
        if (stored) {
            setCategories(JSON.parse(stored))
        } else {
            setCategories(['Eletrônicos', 'Roupas', 'Casa & Cozinha', 'Beleza & Saúde', 'Brinquedos & Jogos', 'Esportes', 'Livros', 'Alimentos', 'Outros'])
        }
    }, [])

    const dispatch = useDispatch()
    const router = useRouter()

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: "",
        weight: "",
        height: "",
        width: "",
        length: "",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    // Converte a imagem para Base64 para simularmos no banco local
    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const imageUrls = [];
            for (const key in images) {
                if (images[key]) {
                    const base64 = await getBase64(images[key]);
                    imageUrls.push(base64);
                }
            }

            if (imageUrls.length === 0) {
                imageUrls.push('https://via.placeholder.com/400x400?text=Sem+Imagem');
            }

            const optionMap = {};
            variantOptions.forEach(opt => {
                const name = opt.name?.trim();
                if (name) {
                    if (!optionMap[name]) optionMap[name] = [];
                    optionMap[name].push(...opt.values.split(',').map(v => v.trim()).filter(Boolean));
                }
            });

            const finalVariantOptions = Object.keys(optionMap).map(name => ({
                name,
                values: [...new Set(optionMap[name])]
            })).filter(opt => opt.values.length > 0);

            const newProduct = {
                id: "prod_" + Date.now(),
                name: productInfo.name,
                description: productInfo.description,
                mrp: Number(productInfo.mrp) || 0,
                price: Number(productInfo.price) || 0,
                category: productInfo.category,
                weight: Number(productInfo.weight) || 0,
                height: Number(productInfo.height) || 0,
                width: Number(productInfo.width) || 0,
                length: Number(productInfo.length) || 0,
                images: imageUrls,
                rating: [],
                createdAt: new Date().toISOString(),
                hasVariants,
                variantOptions: hasVariants ? finalVariantOptions : [],
                variants: hasVariants ? generatedVariants.map(v => ({ ...v, price: Number(v.price) || 0, mrp: Number(v.mrp) || 0 })) : []
            }

            dispatch(addProduct(newProduct))
            toast.success("Produto adicionado com sucesso!")

            router.push('/admin/manage-products')

        } catch (error) {
            toast.error("Erro ao adicionar produto.")
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateVariants = () => {
        // Agrupa os valores se o usuário digitar opções com o mesmo nome
        const optionMap = {};
        variantOptions.forEach(opt => {
            const name = opt.name?.trim();
            if (name) {
                if (!optionMap[name]) optionMap[name] = [];
                optionMap[name].push(...opt.values.split(',').map(v => v.trim()).filter(Boolean));
            }
        });

        const parsedOptions = Object.keys(optionMap).map(name => ({
            name,
            values: [...new Set(optionMap[name])]
        })).filter(opt => opt.values.length > 0);

        if (parsedOptions.length === 0) return

        let results = [{}]
        for (const option of parsedOptions) {
            const temp = []
            for (const res of results) {
                for (const value of option.values) {
                    temp.push({ ...res, [option.name]: value })
                }
            }
            results = temp
        }

        const variants = results.map((comb, idx) => {
            const variantKey = Object.values(comb).join(' / ')
            return {
                id: `var_` + idx,
                combination: comb,
                stringKey: variantKey,
                price: productInfo.price || 0,
                mrp: productInfo.mrp || 0
            }
        })
        setGeneratedVariants(variants)
        toast.success(`Foram geradas ${variants.length} variações!`)
    }

    const updateVariantValue = (idx, field, value) => {
        const newVars = [...generatedVariants]
        newVars[idx] = { ...newVars[idx], [field]: value }
        setGeneratedVariants(newVars)
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adicionando Produto..." })} className="text-slate-500 mb-28 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl">Adicionar Novo <span className="text-slate-800 font-medium">Produto</span></h1>
                <button type="button" onClick={() => router.push('/admin/manage-products')} className="text-sm text-slate-500 hover:text-slate-700 underline">
                    Voltar
                </button>
            </div>
            <p className="mt-7">Imagens do Produto</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer object-cover' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6 ">
                Nome do Produto
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Digite o nome do produto" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6 ">
                Descrição
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Digite a descrição detalhada" rows={5} className="w-full p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5 max-sm:flex-col mb-6">
                <label className="flex flex-col gap-2 w-full">
                    Preço Original (R$)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="Ex: 199.90" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label className="flex flex-col gap-2 w-full">
                    Preço com Desconto (R$)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="Ex: 149.90" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl my-6">
                <p className="font-medium text-slate-800 mb-4">Dimensões e Peso (Para Frete)</p>
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2 text-sm">
                        Peso (kg)
                        <input type="number" step="0.01" name="weight" onChange={onChangeHandler} value={productInfo.weight} placeholder="Ex: 0.500" className="w-full p-2 px-4 outline-none border border-slate-200 rounded bg-white" required />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Altura (cm)
                        <input type="number" name="height" onChange={onChangeHandler} value={productInfo.height} placeholder="Ex: 10" className="w-full p-2 px-4 outline-none border border-slate-200 rounded bg-white" required />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Largura (cm)
                        <input type="number" name="width" onChange={onChangeHandler} value={productInfo.width} placeholder="Ex: 20" className="w-full p-2 px-4 outline-none border border-slate-200 rounded bg-white" required />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        Comprimento (cm)
                        <input type="number" name="length" onChange={onChangeHandler} value={productInfo.length} placeholder="Ex: 30" className="w-full p-2 px-4 outline-none border border-slate-200 rounded bg-white" required />
                    </label>
                </div>
            </div>

            <label className="flex flex-col gap-2 my-6">
                Categoria Principal
                <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full p-2 px-4 outline-none border border-slate-200 rounded bg-white" required>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </label>

            {/* Sistema de Variações */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl my-6">
                <label className="flex items-center gap-3 cursor-pointer text-slate-800 font-medium select-none">
                    <input type="checkbox" checked={hasVariants} onChange={() => setHasVariants(!hasVariants)} className="w-5 h-5 accent-green-500 rounded" />
                    Este produto possui variações (Tamanhos, Cores, etc.)
                </label>

                {hasVariants && (
                    <div className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                        {variantOptions.map((opt, idx) => (
                            <div key={idx} className="flex gap-3 items-end">
                                <label className="flex-1 flex flex-col gap-2 text-sm text-slate-600">
                                    Nome da Opção (Ex: Tamanho)
                                    <input type="text" value={opt.name} onChange={e => {
                                        const newOpts = [...variantOptions]
                                        newOpts[idx].name = e.target.value
                                        setVariantOptions(newOpts)
                                    }} className="p-2 border border-slate-200 outline-none focus:border-green-500 rounded bg-white" />
                                </label>
                                <label className="flex-[2] flex flex-col gap-2 text-sm text-slate-600">
                                    Valores Separados por Vírgula
                                    <input type="text" value={opt.values} onChange={e => {
                                        const newOpts = [...variantOptions]
                                        newOpts[idx].values = e.target.value
                                        setVariantOptions(newOpts)
                                    }} placeholder="P, M, G" className="p-2 border border-slate-200 outline-none focus:border-green-500 rounded bg-white" />
                                </label>
                                <button type="button" onClick={() => setVariantOptions(variantOptions.filter((_, i) => i !== idx))} className="pb-3 text-red-400 hover:text-red-600 text-sm">Remover</button>
                            </div>
                        ))}

                        <button type="button" onClick={() => setVariantOptions([...variantOptions, { name: '', values: '' }])} className="text-green-600 font-medium text-sm hover:underline mt-2 inline-block">
                            + Adicionar Atributo
                        </button>

                        <div className="mt-4">
                            <button type="button" onClick={handleGenerateVariants} className="bg-slate-200 text-slate-700 px-4 py-2 text-sm font-medium rounded hover:bg-slate-300 transition">
                                Mapear Preços das Combinações
                            </button>
                        </div>

                        {generatedVariants.length > 0 && (
                            <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-3 bg-slate-100 p-3 border-b border-slate-200 text-sm font-medium text-slate-600">
                                    <p>Variação</p>
                                    <p>Preço Original (R$)</p>
                                    <p>Preço c/ Desconto (R$)</p>
                                </div>
                                {generatedVariants.map((gv, idx) => (
                                    <div key={idx} className="grid grid-cols-3 p-3 border-b last:border-b-0 items-center text-sm gap-3">
                                        <p className="text-slate-700 font-semibold">{gv.stringKey}</p>
                                        <input type="number" step="0.01" value={gv.mrp} onChange={e => updateVariantValue(idx, 'mrp', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded outline-none" required />
                                        <input type="number" step="0.01" value={gv.price} onChange={e => updateVariantValue(idx, 'price', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded outline-none" required />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button disabled={loading} className="bg-slate-800 text-white px-8 mt-4 py-3 hover:bg-slate-900 rounded transition active:scale-95 disabled:opacity-50 font-medium">
                Adicionar Produto
            </button>
        </form>
    )
}