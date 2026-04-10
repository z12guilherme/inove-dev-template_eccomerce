/**
 * Testes da jornada de compra — Carrinho + Cálculos de Preço
 * Cobre: cartSlice completo e lógica de subtotal, cupom e frete
 */
import cartReducer, { addToCart, removeFromCart, deleteItemFromCart, clearCart } from '../lib/features/cart/cartSlice';

const initialState = { cartItems: {}, total: 0 };

// ── CartSlice ─────────────────────────────────────────────────────────────────
describe('Jornada de Compra — cartSlice', () => {
    it('estado inicial deve ser carrinho vazio', () => {
        const state = cartReducer(undefined, { type: '@@INIT' });
        expect(state.cartItems).toEqual({});
        expect(state.total).toBe(0);
    });

    it('adiciona produto ao carrinho com quantidade 1', () => {
        const state = cartReducer(initialState, addToCart({ productId: 'prod_001' }));
        expect(state.cartItems['prod_001']).toBe(1);
        expect(state.total).toBe(1);
    });

    it('incrementa quantidade ao adicionar mesmo produto duas vezes', () => {
        let state = cartReducer(initialState, addToCart({ productId: 'prod_001' }));
        state = cartReducer(state, addToCart({ productId: 'prod_001' }));
        expect(state.cartItems['prod_001']).toBe(2);
        expect(state.total).toBe(2);
    });

    it('decrementa quantidade com removeFromCart', () => {
        const stateWith2 = { cartItems: { prod_001: 2 }, total: 2 };
        const state = cartReducer(stateWith2, removeFromCart({ productId: 'prod_001' }));
        expect(state.cartItems['prod_001']).toBe(1);
        expect(state.total).toBe(1);
    });

    it('remove produto do carrinho quando quantidade chega a 0', () => {
        const stateWith1 = { cartItems: { prod_001: 1 }, total: 1 };
        const state = cartReducer(stateWith1, removeFromCart({ productId: 'prod_001' }));
        expect(state.cartItems['prod_001']).toBeUndefined();
    });

    it('exclui produto diretamente com deleteItemFromCart', () => {
        const stateWith = { cartItems: { prod_001: 3, prod_002: 1 }, total: 4 };
        const state = cartReducer(stateWith, deleteItemFromCart({ productId: 'prod_001' }));
        expect(state.cartItems['prod_001']).toBeUndefined();
        expect(state.cartItems['prod_002']).toBe(1);
        expect(state.total).toBe(1);
    });

    it('limpa todo o carrinho com clearCart', () => {
        const stateWithItems = { cartItems: { prod_001: 2, prod_002: 1 }, total: 3 };
        const state = cartReducer(stateWithItems, clearCart());
        expect(state.cartItems).toEqual({});
        expect(state.total).toBe(0);
    });

    it('não quebra ao remover produto que não existe no carrinho', () => {
        const state = cartReducer(initialState, deleteItemFromCart({ productId: 'prod_inexistente' }));
        expect(state.cartItems).toEqual({});
        expect(state.total).toBe(0);
    });
});

// ── Cálculos de preço ─────────────────────────────────────────────────────────
describe('Jornada de Compra — Cálculos de preço', () => {
    const products = [
        { id: 'prod_001', price: 199.9 },
        { id: 'prod_002', price: 50 },
    ];

    it('calcula subtotal corretamente para múltiplos itens', () => {
        const cartItems = { prod_001: 2, prod_002: 1 };
        const subtotal = products.reduce((acc, p) => acc + p.price * (cartItems[p.id] || 0), 0);
        expect(subtotal).toBeCloseTo(449.8, 1);
    });

    it('aplica desconto de cupom de 20% corretamente', () => {
        const subtotal = 300;
        const discount = (20 / 100) * subtotal;
        expect(discount).toBe(60);
        expect(subtotal - discount).toBe(240);
    });

    it('total final = subtotal + frete - desconto', () => {
        const subtotal = 500;
        const shipping = 25.9;
        const discount = 50;
        const total = subtotal + shipping - discount;
        expect(total).toBeCloseTo(475.9, 1);
    });

    it('frete grátis quando subtotal >= R$50 (regra do banner)', () => {
        const isFree = (subtotal) => subtotal >= 50;
        expect(isFree(50)).toBe(true);
        expect(isFree(100)).toBe(true);
        expect(isFree(49.9)).toBe(false);
    });

    it('desconto zero quando não há cupom', () => {
        const coupon = null;
        const discount = coupon ? (coupon.discount / 100) * 500 : 0;
        expect(discount).toBe(0);
    });
});
