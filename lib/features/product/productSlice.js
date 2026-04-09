import { createSlice } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'

const loadProducts = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('inove_products');
        if (stored) return JSON.parse(stored);
        localStorage.setItem('inove_products', JSON.stringify(productDummyData));
    }
    return productDummyData;
}

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: loadProducts(),
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        },
        addProduct: (state, action) => {
            state.list.unshift(action.payload); // Adiciona no início (como "Último Produto")
            if (typeof window !== 'undefined') {
                localStorage.setItem('inove_products', JSON.stringify(state.list));
            }
        }
    }
})

export const { setProduct, clearProduct, addProduct } = productSlice.actions

export default productSlice.reducer