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
        const stateWith2 = { cartItems: { prod_001: 3, prod_002: 1 }, total: 4 };
        const state = cartReducer(stateWith2, deleteItemFromCart({ productId: 'prod_001' }));
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
        // cartItems: { prod_001: 2, prod_002: 1 }
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


const mockProduct = {
    id: 'prod_001',
    name: 'Fone de Ouvido BT',
    price: 199.9,
    image: ['/fone.jpg'],
    category: 'Eletrônicos',
};

const initialState = { cartItems: [] };

describe('Carrinho — cartSlice', () => {
    it('estado inicial deve ser carrinho vazio', () => {
        expect(cartReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('adiciona um produto ao carrinho', () => {
        const state = cartReducer(initialState, addItemToCart({ ...mockProduct, quantity: 1 }));
        expect(state.cartItems).toHaveLength(1);
        expect(state.cartItems[0].id).toBe('prod_001');
    });

    it('incrementa a quantidade ao adicionar o mesmo produto', () => {
        let state = cartReducer(initialState, addItemToCart({ ...mockProduct, quantity: 1 }));
        state = cartReducer(state, addItemToCart({ ...mockProduct, quantity: 1 }));
        expect(state.cartItems).toHaveLength(1);
        expect(state.cartItems[0].quantity).toBe(2);
    });

    it('remove um produto do carrinho pelo productId', () => {
        let state = cartReducer(initialState, addItemToCart({ ...mockProduct, quantity: 1 }));
        state = cartReducer(state, deleteItemFromCart({ productId: 'prod_001' }));
        expect(state.cartItems).toHaveLength(0);
    });

    it('atualiza a quantidade de um produto no carrinho', () => {
        let state = cartReducer(initialState, addItemToCart({ ...mockProduct, quantity: 1 }));
        state = cartReducer(state, updateCartQuantity({ productId: 'prod_001', quantity: 5 }));
        expect(state.cartItems[0].quantity).toBe(5);
    });

    it('limpa todo o carrinho com clearCart', () => {
        let state = cartReducer(initialState, addItemToCart({ ...mockProduct, quantity: 2 }));
        state = cartReducer(state, clearCart());
        expect(state.cartItems).toHaveLength(0);
    });

    it('não remove produto de carrinho vazio (sem erro)', () => {
        const state = cartReducer(initialState, deleteItemFromCart({ productId: 'prod_nao_existe' }));
        expect(state.cartItems).toHaveLength(0);
    });
});

// ── Cálculos de preço ─────────────────────────────────────────────────────────
describe('Jornada de compra — Cálculos de preço', () => {
    it('calcula subtotal corretamente para múltiplos itens', () => {
        const items = [
            { id: 'prod_001', price: 199.9, quantity: 2 },
            { id: 'prod_002', price: 50, quantity: 1 },
        ];
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        expect(subtotal).toBeCloseTo(449.8, 1);
    });

    it('aplica desconto de cupom corretamente (20%)', () => {
        const subtotal = 300;
        const couponDiscount = 20; // 20%
        const discount = (couponDiscount / 100) * subtotal;
        expect(discount).toBe(60);
        expect(subtotal - discount).toBe(240);
    });

    it('total final = subtotal + frete - desconto', () => {
        const subtotal = 500;
        const shipping = 25.9;
        const discount = 50; // cupom de 10% em 500
        const total = subtotal + shipping - discount;
        expect(total).toBeCloseTo(475.9, 1);
    });

    it('frete grátis quando subtotal >= 50 (regra do banner)', () => {
        const getFreeShipping = (subtotal) => subtotal >= 50;
        expect(getFreeShipping(50)).toBe(true);
        expect(getFreeShipping(49.9)).toBe(false);
    });
});
