'use client'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { Trash2Icon, SquarePenIcon, XIcon, PlusIcon } from 'lucide-react'
import { deleteProduct, updateProduct } from '@/lib/features/product/productSlice'
import toast from 'react-hot-toast'
import { assets } from '@/assets/assets'
import Link from 'next/link'

export default function ManageProducts() {
    const products = useSelector(state => state.product.list)
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$'

    const [editingProduct, setEditingProduct] = useState(null)
    const [editImages, setEditImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const categories = ['Eletrônicos', 'Roupas', 'Casa & Cozinha', 'Beleza & Saúde', 'Brinquedos & Jogos', 'Esportes', 'Livros', 'Alimentos', 'Outros']

    // State para edição de variações
    const [editHasVariants, setEditHasVariants] = useState(false)
    const [editVariantOptions, setEditVariantOptions] = useState([{ name: 'Tamanho', values: '' }])
    const [editGeneratedVariants, setEditGeneratedVariants] = useState([])

    const [isMounted, setIsMounted] = useState(false)
    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleEditClick = (product) => {
        setEditingProduct(product)
        setEditImages({ 1: null, 2: null, 3: null, 4: null })
        // Popula os estados das variações com os dados do produto
        setEditHasVariants(product.hasVariants || false)
        const optionsForForm = product.variantOptions?.map(opt => ({
            name: opt.name,
            // Limpa as opções duplicadas que podem já estar salvas no banco
            values: [...new Set(opt.values || [])].join(', ')
        }))
        setEditVariantOptions(optionsForForm && optionsForForm.length > 0 ? optionsForForm : [{ name: 'Tamanho', values: '' }])
        setEditGeneratedVariants(product.variants || [])
        // Novos campos de dimensões
        setEditingProduct(prev => ({
            ...prev,
            weight: product.weight || '',
            height: product.height || '',
            width: product.width || '',
            length: product.length || ''
        }))
    }

    const handleResetDemo = () => {
        if (confirm("Isso apagará os produtos atuais e recarregará os originais do seu código. Tem certeza?")) {
            localStorage.removeItem('inove_products');
            window.location.reload();
        }
    }

    const handleDelete = (id) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            dispatch(deleteProduct(id))
            toast.success("Produto excluído com sucesso!")
        }
    }

    // Lógica para gerar variações no modal de edição
    const handleGenerateVariantsForEdit = () => {
        // Agrupa os valores se o usuário digitar opções com o mesmo nome (ex: "Tamanho" em dois blocos diferentes)
        const optionMap = {};
        editVariantOptions.forEach(opt => {
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

        if (parsedOptions.length === 0) {
            setEditGeneratedVariants([])
            return
        }

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
            // Tenta encontrar uma variação existente para preservar o preço
            const existingVariant = editingProduct.variants?.find(v => v.stringKey === variantKey)
            return {
                id: existingVariant?.id || `var_${Date.now()}_${idx}`,
                combination: comb,
                stringKey: variantKey,
                price: existingVariant?.price ?? editingProduct.price ?? 0,
                mrp: existingVariant?.mrp ?? editingProduct.mrp ?? 0,
            }
        })
        setEditGeneratedVariants(variants)
        toast.success(`Foram geradas ${variants.length} variações!`)
    }

    // Lógica para atualizar o preço/mrp da variação no modal
    const updateVariantValueForEdit = (idx, field, value) => {
        const newVars = [...editGeneratedVariants]
        newVars[idx] = { ...newVars[idx], [field]: value }
        setEditGeneratedVariants(newVars)
    }

    const handleSaveEdit = async () => {
        const imageUrls = editingProduct.images ? [...editingProduct.images] : [];
        for (const key in editImages) {
            if (editImages[key]) {
                const base64 = await getBase64(editImages[key]);
                imageUrls[key - 1] = base64;
            }
        }

        const optionMap = {};
        editVariantOptions.forEach(opt => {
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

        dispatch(updateProduct({
            ...editingProduct,
            images: imageUrls,
            price: Number(editingProduct.price),
            mrp: Number(editingProduct.mrp),
            weight: Number(editingProduct.weight) || 0,
            height: Number(editingProduct.height) || 0,
            width: Number(editingProduct.width) || 0,
            length: Number(editingProduct.length) || 0,
            hasVariants: editHasVariants,
            variantOptions: editHasVariants ? finalVariantOptions : [],
            // Converte para número apenas na hora de salvar
            variants: editHasVariants ? editGeneratedVariants.map(v => ({ ...v, price: Number(v.price) || 0, mrp: Number(v.mrp) || 0 })) : []
        }))
        setEditingProduct(null)
    }

    return (
        <div className="text-slate-500 mb-28 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl">Gerenciar <span className="text-slate-800 font-medium">Produtos</span></h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleResetDemo} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-md text-sm hover:bg-orange-200 transition font-medium">
                        Restaurar Produtos
                    </button>
                    <Link href="/admin/add-product" className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition font-medium flex items-center gap-2">
                        <PlusIcon size={18} /> Novo Produto
                    </Link>
                </div>
            </div>

            {(!isMounted) ? (
                <p className="text-slate-400">Carregando catálogo...</p>
            ) : products.length === 0 ? (
                <p className="text-slate-400">Nenhum produto cadastrado no momento.</p>
            ) : (
                <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4 text-center">Categoria</th>
                                <th className="px-6 py-4 text-center">Preço</th>
                                <th className="px-6 py-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={`prod_row_${product.id}`} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 flex gap-4 items-center">
                                        <div className="flex-shrink-0 bg-white border border-slate-100 p-1.5 rounded-lg shadow-sm">
                                            <Image src={product.images[0]} className="h-12 w-12 object-contain" alt={product.name} width={48} height={48} />
                                        </div>
                                        <span className="font-medium text-slate-800">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">{product.category}</td>
                                    <td className="px-6 py-4 text-center font-medium text-slate-700">{currency}{product.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleEditClick(product)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors inline-flex justify-center items-center" title="Editar Produto">
                                                <SquarePenIcon size={20} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors inline-flex justify-center items-center" title="Excluir Produto">
                                                <Trash2Icon size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Edição */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm h-screen flex items-center justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg relative mx-4 max-h-[95vh] overflow-y-auto no-scrollbar">
                        <button type="button" onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <XIcon size={24} />
                        </button>
                        <h2 className="text-2xl font-medium text-slate-800 mb-6">Editar Produto</h2>
                        <form onSubmit={e => { e.preventDefault(); toast.promise(handleSaveEdit(), { loading: 'Salvando...', success: 'Produto atualizado!', error: 'Erro ao atualizar.' }) }} className="flex flex-col gap-4">

                            <div>
                                <label className="block text-sm text-slate-600 mb-2">Imagens do Produto</label>
                                <div className="flex gap-3">
                                    {Object.keys(editImages).map((key) => {
                                        let previewSrc = assets.upload_area;
                                        if (editImages[key]) {
                                            previewSrc = URL.createObjectURL(editImages[key]);
                                        } else if (editingProduct.images && editingProduct.images[key - 1]) {
                                            previewSrc = editingProduct.images[key - 1];
                                        }
                                        return (
                                            <label key={key} htmlFor={`editImages${key}`}>
                                                <Image width={300} height={300} className='h-14 w-14 border border-slate-200 rounded cursor-pointer object-cover' src={previewSrc} alt="" />
                                                <input type="file" accept='image/*' id={`editImages${key}`} onChange={e => setEditImages({ ...editImages, [key]: e.target.files[0] })} hidden />
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Nome do Produto</label>
                                <input type="text" name="name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Categoria</label>
                                <select name="category" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500 bg-white" required>
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-slate-600 mb-1">Preço Original (R$)</label>
                                    <input type="number" step="0.01" name="mrp" value={editingProduct.mrp} onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })} className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500" required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-slate-600 mb-1">Preço c/ Desconto (R$)</label>
                                    <input type="number" step="0.01" name="price" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500" required />
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dimensões e Peso</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="flex flex-col gap-1 text-xs text-slate-600">
                                        Peso (kg)
                                        <input type="number" step="0.01" value={editingProduct.weight} onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })} className="p-2 border border-slate-200 rounded outline-none bg-white" required />
                                    </label>
                                    <label className="flex flex-col gap-1 text-xs text-slate-600">
                                        Altura (cm)
                                        <input type="number" value={editingProduct.height} onChange={(e) => setEditingProduct({ ...editingProduct, height: e.target.value })} className="p-2 border border-slate-200 rounded outline-none bg-white" required />
                                    </label>
                                    <label className="flex flex-col gap-1 text-xs text-slate-600">
                                        Largura (cm)
                                        <input type="number" value={editingProduct.width} onChange={(e) => setEditingProduct({ ...editingProduct, width: e.target.value })} className="p-2 border border-slate-200 rounded outline-none bg-white" required />
                                    </label>
                                    <label className="flex flex-col gap-1 text-xs text-slate-600">
                                        Comprimento (cm)
                                        <input type="number" value={editingProduct.length} onChange={(e) => setEditingProduct({ ...editingProduct, length: e.target.value })} className="p-2 border border-slate-200 rounded outline-none bg-white" required />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Descrição</label>
                                <textarea name="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={4} className="w-full p-2 border border-slate-200 rounded outline-none focus:border-green-500 resize-none" required />
                            </div>

                            {/* Sistema de Variações (adaptado do add-product) */}
                            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl my-4">
                                <label className="flex items-center gap-3 cursor-pointer text-slate-800 font-medium select-none">
                                    <input type="checkbox" checked={editHasVariants} onChange={() => setEditHasVariants(!editHasVariants)} className="w-5 h-5 accent-green-500 rounded" />
                                    Este produto possui variações (Tamanhos, Cores, etc.)
                                </label>

                                {editHasVariants && (
                                    <div className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                                        {editVariantOptions.map((opt, idx) => (
                                            <div key={idx} className="flex gap-3 items-end">
                                                <label className="flex-1 flex flex-col gap-2 text-sm text-slate-600">
                                                    Nome da Opção
                                                    <input type="text" value={opt.name} onChange={e => {
                                                        const newOpts = [...editVariantOptions]
                                                        newOpts[idx].name = e.target.value
                                                        setEditVariantOptions(newOpts)
                                                    }} className="p-2 border border-slate-200 outline-none focus:border-green-500 rounded bg-white" />
                                                </label>
                                                <label className="flex-[2] flex flex-col gap-2 text-sm text-slate-600">
                                                    Valores (separados por vírgula)
                                                    <input type="text" value={opt.values} onChange={e => {
                                                        const newOpts = [...editVariantOptions]
                                                        newOpts[idx].values = e.target.value
                                                        setEditVariantOptions(newOpts)
                                                    }} placeholder="P, M, G" className="p-2 border border-slate-200 outline-none focus:border-green-500 rounded bg-white" />
                                                </label>
                                                <button type="button" onClick={() => setEditVariantOptions(editVariantOptions.filter((_, i) => i !== idx))} className="pb-3 text-red-400 hover:text-red-600 text-sm">Remover</button>
                                            </div>
                                        ))}

                                        <button type="button" onClick={() => setEditVariantOptions([...editVariantOptions, { name: '', values: '' }])} className="text-green-600 font-medium text-sm hover:underline mt-2 inline-block">
                                            + Adicionar Atributo
                                        </button>

                                        <div className="mt-4">
                                            <button type="button" onClick={handleGenerateVariantsForEdit} className="bg-slate-200 text-slate-700 px-4 py-2 text-sm font-medium rounded hover:bg-slate-300 transition">
                                                Mapear Preços das Combinações
                                            </button>
                                        </div>

                                        {editGeneratedVariants.length > 0 && (
                                            <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
                                                <div className="grid grid-cols-3 bg-slate-100 p-3 border-b border-slate-200 text-sm font-medium text-slate-600">
                                                    <p>Variação</p>
                                                    <p>Preço Original (R$)</p>
                                                    <p>Preço c/ Desconto (R$)</p>
                                                </div>
                                                {editGeneratedVariants.map((gv, idx) => (
                                                    <div key={idx} className="grid grid-cols-3 p-3 border-b last:border-b-0 items-center text-sm gap-3">
                                                        <p className="text-slate-700 font-semibold">{gv.stringKey}</p>
                                                        <input type="number" step="0.01" value={gv.mrp} onChange={e => updateVariantValueForEdit(idx, 'mrp', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded outline-none" required />
                                                        <input type="number" step="0.01" value={gv.price} onChange={e => updateVariantValueForEdit(idx, 'price', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded outline-none" required />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="mt-4 w-full bg-green-500 text-white py-2.5 rounded hover:bg-green-600 transition active:scale-95 font-medium">Salvar Alterações</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}