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
        },
        deleteProduct: (state, action) => {
            state.list = state.list.filter(product => product.id !== action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('inove_products', JSON.stringify(state.list));
            }
        },
        updateProduct: (state, action) => {
            const index = state.list.findIndex(product => product.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...action.payload };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('inove_products', JSON.stringify(state.list));
                }
            }
        },
        addReview: (state, action) => {
            const { productId, reviewData } = action.payload;
            const index = state.list.findIndex(product => product.id === productId);
            if (index !== -1) {
                if (!state.list[index].rating) state.list[index].rating = [];
                state.list[index].rating.push(reviewData);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('inove_products', JSON.stringify(state.list));
                }
            }
        }
    }
})

export const { setProduct, clearProduct, addProduct, deleteProduct, updateProduct, addReview } = productSlice.actions

export default productSlice.reducer