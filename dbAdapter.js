import { productDummyData, orderDummyData, dummyUserData, couponDummyData, addressDummyData } from '@/assets/assets';

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
        // Inicializa o banco de dados com os dados "mockados" do sistema se estiver vazio
        db = {
            products: productDummyData,
            orders: orderDummyData,
            users: [dummyUserData],
            coupons: couponDummyData,
            addresses: [addressDummyData],
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
};