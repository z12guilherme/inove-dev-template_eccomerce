'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addProduct } from "@/lib/features/product/productSlice"
import { useRouter } from "next/navigation"

export default function AdminAddProduct() {

    const categories = ['Eletrônicos', 'Roupas', 'Casa & Cozinha', 'Beleza & Saúde', 'Brinquedos & Jogos', 'Esportes', 'Livros', 'Alimentos', 'Outros']

    const dispatch = useDispatch()
    const router = useRouter()

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: "",
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

            // Fallback caso nenhuma imagem seja inserida
            if (imageUrls.length === 0) {
                imageUrls.push('https://via.placeholder.com/400x400?text=Sem+Imagem');
            }

            const newProduct = {
                id: "prod_" + Date.now(),
                name: productInfo.name,
                description: productInfo.description,
                mrp: Number(productInfo.mrp),
                price: Number(productInfo.price),
                category: productInfo.category,
                images: imageUrls,
                rating: [],
                store: {
                    name: "INOVE-DEV",
                    username: "inovedev",
                    logo: assets.gs_logo.src || 'https://via.placeholder.com/100?text=Logo'
                },
                createdAt: new Date().toISOString()
            }

            dispatch(addProduct(newProduct))
            toast.success("Produto adicionado com sucesso!")
            
            // Reseta o formulário
            setProductInfo({ name: "", description: "", mrp: "", price: "", category: "" })
            setImages({ 1: null, 2: null, 3: null, 4: null })
            
        } catch (error) {
            toast.error("Erro ao adicionar produto.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adicionando Produto..." })} className="text-slate-500 mb-28 max-w-2xl">
            <h1 className="text-2xl">Adicionar Novo <span className="text-slate-800 font-medium">Produto</span></h1>
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

            <div className="flex gap-5 max-sm:flex-col">
                <label className="flex flex-col gap-2 w-full">
                    Preço Original (R$)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="Ex: 199.90" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label className="flex flex-col gap-2 w-full">
                    Preço com Desconto (R$)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="Ex: 149.90" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <label className="flex flex-col gap-2 my-6">
                Categoria
                <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full p-2 px-4 outline-none border border-slate-200 rounded bg-white" required>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </label>

            <button disabled={loading} className="bg-slate-800 text-white px-8 mt-4 py-2.5 hover:bg-slate-900 rounded transition active:scale-95 disabled:opacity-50 font-medium">
                Adicionar Produto
            </button>
        </form>
    )
}