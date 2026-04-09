import productReducer, { setProduct, clearProduct, addProduct } from './productSlice';

// Simula o localStorage no ambiente Node.js do Jest
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('Testes do Reducer de Produtos (productSlice)', () => {
    const estadoInicial = { list: [] };

    it('deve retornar o estado inicial', () => {
        expect(productReducer(undefined, { type: 'unknown' })).toBeDefined();
    });

    it('deve conseguir substituir todos os produtos com setProduct', () => {
        const atual = productReducer(estadoInicial, setProduct([{ id: 1, name: 'Produto Mock' }]));
        expect(atual.list.length).toEqual(1);
        expect(atual.list[0].name).toEqual('Produto Mock');
    });

    it('deve limpar os produtos com clearProduct', () => {
        const estadoComProdutos = { list: [{ id: 1, name: 'Produto A' }] };
        const atual = productReducer(estadoComProdutos, clearProduct());
        expect(atual.list.length).toEqual(0);
    });

    it('deve adicionar um novo produto no início da lista com addProduct', () => {
        const atual = productReducer(estadoInicial, addProduct({ id: 2, name: 'Novo Produto' }));
        expect(atual.list[0].name).toEqual('Novo Produto');
    });
});