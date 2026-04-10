
/**
 * INOVE-DEV DB Adapter
 * 
 * Este arquivo serve como uma "ponte" entre a sua interface e o banco de dados.
 * Atualmente ele utiliza o LocalStorage para simular um banco de dados real.
 * Para plugar um backend de verdade (Supabase, Firebase, Node.js API),
 * basta alterar a lógica dentro destas funções.
 */

const DB_KEY = '@inove_dev_db';

// Função auxiliar para ler o banco simulado
const getDB = () => {
    if (typeof window === 'undefined') return null; // Prevenção para SSR no Next.js

    let db = localStorage.getItem(DB_KEY);
    if (!db) {
        // Inicializa o banco de dados vazio (sem dados de demonstração)
        db = {
            products: [],
            orders: [],
            users: [],
            coupons: [],
            addresses: [],
        };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        return db;
    }
    return JSON.parse(db);
};

// Função auxiliar para salvar o banco simulado
const saveDB = (db) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const dbAdapter = {
    // ==========================================
    // PRODUTOS
    // ==========================================
    getProducts: async () => {
        const db = getDB();
        return db ? db.products : [];
    },

    getProductById: async (id) => {
        const db = getDB();
        return db ? db.products.find(p => p.id === id) : null;
    },

    createProduct: async (productData) => {
        const db = getDB();
        if (!db) return null;

        const newProduct = { ...productData, id: `prod_${Date.now()}` };
        db.products.push(newProduct);
        saveDB(db);
        return newProduct;
    },

    // ==========================================
    // PEDIDOS (ORDERS)
    // ==========================================
    getOrders: async () => {
        const db = getDB();
        return db ? db.orders : [];
    },

    createOrder: async (orderData) => {
        const db = getDB();
        if (!db) return null;

        const newOrder = { ...orderData, id: `order_${Date.now()}`, createdAt: new Date().toISOString() };
        db.orders.push(newOrder);
        saveDB(db);
        return newOrder;
    },

    clearOrders: async () => {
        const db = getDB();
        if (!db) return;
        db.orders = [];
        saveDB(db);
    },

    deleteOrder: async (id) => {
        const db = getDB();
        if (!db) return;
        db.orders = db.orders.filter(order => order.id !== id);
        saveDB(db);
    },

    updateOrderStatus: async (id, status) => {
        const db = getDB();
        if (!db) return;
        const orderIndex = db.orders.findIndex(o => o.id === id);
        if (orderIndex > -1) {
            db.orders[orderIndex].status = status;
            saveDB(db);
        }
    },

    // ==========================================
    // CUPONS
    // ==========================================
    getCoupons: async () => {
        const db = getDB();
        return db ? db.coupons : [];
    },

    getCouponByCode: async (code) => {
        const db = getDB();
        if (!db) return null;
        return db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    },

    // ==========================================
    // ENDEREÇOS (ADDRESSES)
    // ==========================================
    getAddresses: async () => {
        const db = getDB();
        return db ? db.addresses : [];
    },

    createAddress: async (addressData) => {
        const db = getDB();
        if (!db) return null;
        const newAddress = { ...addressData, id: `addr_${Date.now()}` };
        db.addresses.push(newAddress);
        saveDB(db);
        return newAddress;
    },

    // ==========================================
    // CONFIGURAÇÕES DO RODAPÉ (FOOTER)
    // ==========================================
    getFooterSettings: async () => {
        const db = getDB();
        if (!db || !db.footerSettings) {
            return {
                socialLinks: {
                    facebook: 'https://www.facebook.com',
                    instagram: 'https://www.instagram.com',
                    twitter: 'https://twitter.com',
                    linkedin: 'https://www.linkedin.com',
                },
                contact: {
                    phone: '+55 11 99999-9999',
                    email: 'contato@inove-dev.com',
                    address: 'Rua da Inovação, 123 - São Paulo, SP',
                },
                productsLinks: [
                    { text: 'Fones de Ouvido', path: '/' },
                    { text: 'Headphones', path: '/' },
                    { text: 'Smartphones', path: '/' },
                    { text: 'Notebooks', path: '/' },
                ],
                navigationLinks: [
                    { text: 'Início', path: '/' },
                    { text: 'Política de Privacidade', path: '/' },
                ],
            };
        }
        return db.footerSettings;
    },

    saveFooterSettings: async (settings) => {
        const db = getDB();
        if (!db) return;
        db.footerSettings = settings;
        saveDB(db);
    },
};