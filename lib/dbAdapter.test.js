/**
 * Testes do dbAdapter
 * Cobre: produtos, pedidos, cupons, endereços e configurações do rodapé
 */
import { dbAdapter } from '../dbAdapter';

// Mock do localStorage para o ambiente de testes (jsdom)
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
    localStorage.clear();
});

// ── PRODUTOS ──────────────────────────────────────────────────────────────────
describe('dbAdapter — Produtos', () => {
    it('retorna lista vazia quando não há produtos', async () => {
        const products = await dbAdapter.getProducts();
        expect(products).toEqual([]);
    });

    it('cria e recupera um produto corretamente', async () => {
        const created = await dbAdapter.createProduct({ name: 'Fone BT', price: 199.9, category: 'Eletrônicos' });

        expect(created).toMatchObject({ name: 'Fone BT', price: 199.9 });
        expect(created.id).toMatch(/^prod_/);

        const products = await dbAdapter.getProducts();
        expect(products).toHaveLength(1);
        expect(products[0].name).toBe('Fone BT');
    });

    it('busca produto por ID', async () => {
        const created = await dbAdapter.createProduct({ name: 'Notebook', price: 3500 });
        const found = await dbAdapter.getProductById(created.id);
        expect(found).not.toBeNull();
        expect(found.name).toBe('Notebook');
    });

    it('retorna null para ID inexistente', async () => {
        const notFound = await dbAdapter.getProductById('prod_inexistente');
        expect(notFound).toBeNull();
    });
});

// ── PEDIDOS ───────────────────────────────────────────────────────────────────
describe('dbAdapter — Pedidos', () => {
    it('cria um pedido com id e createdAt automáticos', async () => {
        const order = await dbAdapter.createOrder({ total: 350, paymentMethod: 'PIX' });

        expect(order.id).toMatch(/^order_/);
        expect(order.total).toBe(350);
        expect(order.createdAt).toBeDefined();
    });

    it('lista todos os pedidos criados', async () => {
        await dbAdapter.createOrder({ total: 100 });
        await dbAdapter.createOrder({ total: 200 });

        const orders = await dbAdapter.getOrders();
        expect(orders).toHaveLength(2);
    });

    it('atualiza o status de um pedido', async () => {
        const order = await dbAdapter.createOrder({ total: 150 });
        await dbAdapter.updateOrderStatus(order.id, 'shipped');

        const orders = await dbAdapter.getOrders();
        expect(orders[0].status).toBe('shipped');
    });

    it('exclui um pedido pelo id', async () => {
        const order = await dbAdapter.createOrder({ total: 75 });
        await dbAdapter.deleteOrder(order.id);

        const orders = await dbAdapter.getOrders();
        expect(orders).toHaveLength(0);
    });

    it('limpa todos os pedidos com clearOrders', async () => {
        await dbAdapter.createOrder({ total: 50 });
        await dbAdapter.createOrder({ total: 80 });
        await dbAdapter.clearOrders();

        const orders = await dbAdapter.getOrders();
        expect(orders).toHaveLength(0);
    });
});

// ── CUPONS ────────────────────────────────────────────────────────────────────
describe('dbAdapter — Cupons', () => {
    const seedCoupon = async () => {
        // Simula cupom salvo direto no "banco"
        const db = JSON.parse(localStorage.getItem('@inove_dev_db') || '{"products":[],"orders":[],"users":[],"coupons":[],"addresses":[],"footerSettings":null}');
        db.coupons = [{ code: 'INOVE20', discount: 20, description: '20% off' }];
        localStorage.setItem('@inove_dev_db', JSON.stringify(db));
    };

    it('encontra cupom válido (case-insensitive)', async () => {
        await seedCoupon();
        const coupon = await dbAdapter.getCouponByCode('inove20');
        expect(coupon).not.toBeNull();
        expect(coupon.discount).toBe(20);
    });

    it('retorna undefined para cupom inexistente', async () => {
        await seedCoupon();
        const coupon = await dbAdapter.getCouponByCode('FALSO99');
        expect(coupon).toBeUndefined();
    });
});

// ── ENDEREÇOS ─────────────────────────────────────────────────────────────────
describe('dbAdapter — Endereços', () => {
    it('cria e lista endereços', async () => {
        await dbAdapter.createAddress({ name: 'Casa', city: 'São Paulo', zip: '01310-100' });
        const addresses = await dbAdapter.getAddresses();
        expect(addresses).toHaveLength(1);
        expect(addresses[0].city).toBe('São Paulo');
        expect(addresses[0].id).toMatch(/^addr_/);
    });
});

// ── CONFIGURAÇÕES DO RODAPÉ ───────────────────────────────────────────────────
describe('dbAdapter — Footer Settings', () => {
    it('retorna valores padrão quando não há configuração salva', async () => {
        const settings = await dbAdapter.getFooterSettings();
        expect(settings).toHaveProperty('socialLinks');
        expect(settings.socialLinks).toHaveProperty('facebook');
        expect(settings).toHaveProperty('contact');
        expect(settings).toHaveProperty('productsLinks');
        expect(settings).toHaveProperty('navigationLinks');
    });

    it('salva e recupera configurações personalizadas', async () => {
        const custom = {
            socialLinks: { facebook: 'https://facebook.com/inove', instagram: '', twitter: '', linkedin: '' },
            contact: { phone: '11 99999-0000', email: 'oi@inove.dev', address: 'Rua X, 10' },
            productsLinks: [{ text: 'Celulares', path: '/celulares' }],
            navigationLinks: [],
        };

        await dbAdapter.saveFooterSettings(custom);
        const saved = await dbAdapter.getFooterSettings();

        expect(saved.socialLinks.facebook).toBe('https://facebook.com/inove');
        expect(saved.contact.email).toBe('oi@inove.dev');
        expect(saved.productsLinks[0].text).toBe('Celulares');
    });
});
