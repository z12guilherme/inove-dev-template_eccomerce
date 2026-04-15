'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { useState, useMemo } from "react"

 function ShopContent() {

    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)
    
    // Filtros Locais
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState(10000)

    const categoriesList = ['Eletrônicos', 'Roupas', 'Casa & Cozinha', 'Beleza & Saúde', 'Brinquedos & Jogos', 'Esportes', 'Livros', 'Alimentos', 'Outros'];

    const handleCategoryToggle = (cat) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat))
        } else {
            setSelectedCategories([...selectedCategories, cat])
        }
    }

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Busca textual
            const matchSearch = search 
                ? product.name.toLowerCase().includes(search.toLowerCase()) || (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
                : true;
                
            // Categoria
            const matchCategory = selectedCategories.length > 0 
                ? selectedCategories.includes(product.category)
                : true;
                
            // Preço (Max)
            const matchPrice = product.price <= priceRange;

            return matchSearch && matchCategory && matchPrice;
        })
    }, [products, search, selectedCategories, priceRange])

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-8 my-6">
                
                {/* Sidebar Filtros */}
                <div className="w-full md:w-64 shrink-0 border border-slate-200 rounded-xl p-6 bg-slate-50/50 self-start">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Filtros</h2>
                    
                    <div className="mb-6">
                        <h3 className="font-medium text-slate-700 mb-3 text-sm uppercase tracking-wider">Categorias</h3>
                        <div className="flex flex-col gap-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {categoriesList.map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer text-slate-600 text-sm hover:text-green-600 transition">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 accent-green-500 rounded" 
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => handleCategoryToggle(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-slate-700 text-sm uppercase tracking-wider">Preço Máximo</h3>
                            <span className="text-sm font-semibold text-green-600">R${priceRange}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="5000" 
                            step="50"
                            value={priceRange} 
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full accent-green-500" 
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>R$0</span>
                            <span>R$5000+</span>
                        </div>
                    </div>
                    
                    {(selectedCategories.length > 0 || priceRange < 10000 || search) && (
                         <button 
                            onClick={() => { setSelectedCategories([]); setPriceRange(10000); if(search) router.push('/shop') }} 
                            className="w-full mt-6 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-200 rounded font-medium transition"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>

                {/* Vitrine de Produtos */}
                <div className="flex-1">
                    <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer pb-6 border-b border-slate-200 mb-6"> 
                        {search && <MoveLeftIcon size={20} />}  
                        {search ? `Resultados para "${search}"` : (
                            <>Todos os <span className="text-slate-800 font-medium tracking-tight">Produtos</span></>
                        )}
                        <span className="ml-auto text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-600">{filteredProducts.length} itens</span>
                    </h1>
                    
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-slate-600">Nenhum produto encontrado com estes filtros.</p>
                            <button onClick={() => { setSelectedCategories([]); setPriceRange(10000); if(search) router.push('/shop') }} className="mt-4 text-green-500 hover:underline">Limpar filtros e ver tudo</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6 mx-auto mb-32">
                            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}