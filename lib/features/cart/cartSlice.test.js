import cartReducer, { addToCart, deleteItemFromCart } from './cartSlice';

describe('Testes do Reducer de Carrinho (cartSlice)', () => {
    
    const estadoInicial = { cartItems: {}, total: 0 };

    it('deve retornar o estado inicial', () => {
        expect(cartReducer(undefined, { type: 'unknown' })).toBeDefined();
    });

    it('deve adicionar um item ao carrinho', () => {
        const acao = addToCart({ productId: 'prod_123' });
        const estadoAtual = cartReducer(estadoInicial, acao);
        
        // Verifica se o produto foi adicionado e se a quantidade é 1
        expect(estadoAtual.cartItems['prod_123']).toEqual(1);
    });

    it('deve remover um item do carrinho', () => {
        // Simulamos um carrinho que já possui produtos
        const estadoComItens = { cartItems: { 'prod_123': 2, 'prod_456': 1 }, total: 3 };
        const acao = deleteItemFromCart({ productId: 'prod_123' });
        const estadoAtual = cartReducer(estadoComItens, acao);
        
        // O produto 123 deve ser removido, e o 456 deve continuar no carrinho
        expect(estadoAtual.cartItems['prod_123']).toBeUndefined();
        expect(estadoAtual.cartItems['prod_456']).toEqual(1);
    });

    it('deve suportar chaves compostas (Variantes Isoladas)', () => {
        // Testa se "prod_123|Camisa-Preta" fica num bloco isolado
        const estadoComItemBase = { cartItems: { 'prod_123': 1 }, total: 1 };
        
        // Cliente adiciona o mesmo produto mas com variante específica
        const acao = addToCart({ productId: 'prod_123|Camisa-Branca' });
        const estadoFinal = cartReducer(estadoComItemBase, acao);

        // Devem existir como dois SKUs diferentes coexistindo
        expect(estadoFinal.cartItems['prod_123']).toEqual(1);
        expect(estadoFinal.cartItems['prod_123|Camisa-Branca']).toEqual(1);
        expect(estadoFinal.total).toEqual(2);
    });
});