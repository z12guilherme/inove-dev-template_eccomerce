
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
        // Produtos são gerenciados pelo Redux/productSlice e salvos em 'inove_products'
        // ao invés do banco simulado '@inove_dev_db'
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('inove_products');
        return stored ? JSON.parse(stored) : [];
    },

    getProductById: async (id) => {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem('inove_products');
        const products = stored ? JSON.parse(stored) : [];
        return products.find(p => p.id === id) || null;
    },

    createProduct: async (productData) => {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem('inove_products');
        const products = stored ? JSON.parse(stored) : [];

        const newProduct = { 
            ...productData, 
            id: `prod_${Date.now()}`,
            weight: Number(productData.weight) || 0,
            height: Number(productData.height) || 0,
            width: Number(productData.width) || 0,
            length: Number(productData.length) || 0
        };
        products.push(newProduct);
        localStorage.setItem('inove_products', JSON.stringify(products));
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

    // ==========================================
    // CONFIGURAÇÕES DA LOJA (STORE SETTINGS)
    // ==========================================
    getStoreSettings: async () => {
        const db = getDB();
        if (!db || !db.storeSettings) {
            return {
                shippingOriginZip: '01310200',
                superfreteToken: '',
                defaultWeight: 1,
                defaultHeight: 20,
                defaultWidth: 20,
                defaultLength: 20
            };
        }
        return db.storeSettings;
    },

    saveStoreSettings: async (settings) => {
        const db = getDB();
        if (!db) return;
        db.storeSettings = settings;
        saveDB(db);
    },

    // ==========================================
    // LAYOUT DA HOME PAGE
    // ==========================================
    getHomeLayout: async () => {
        const db = getDB();
        if (!db || !db.homeLayout) {
            return [
                { id: 'hero', name: 'Banner Principal', visible: true, order: 1 },
                { id: 'latest_products', name: 'Últimos Produtos', visible: true, order: 2 },
                { id: 'best_selling', name: 'Mais Vendidos', visible: true, order: 3 },
                { id: 'our_specs', name: 'Nossos Diferenciais', visible: true, order: 4 },
                { id: 'newsletter', name: 'Captura de E-mails', visible: true, order: 5 },
            ];
        }
        return db.homeLayout;
    },

    saveHomeLayout: async (layout) => {
        const db = getDB();
        if (!db) return;
        db.homeLayout = layout;
        saveDB(db);
    },

    // ==========================================
    // PÁGINAS INSTITUCIONAIS (CMS)
    // ==========================================
    getPageContent: async (slug) => {
        const db = getDB();
        if (!db) return null;
        
        if (!db.pages) db.pages = {};
        if (!db.pages[slug]) {
            if (slug === 'about') {
                return {
                    title: "Inovação e Tecnologia em um só lugar.",
                    paragraphs: "Bem-vindo à INOVE-DEV, o seu destino definitivo para os gadgets mais recentes e inteligentes do mercado.\n\nNossa missão é trazer inovações tecnológicas e produtos essenciais diretamente para você, com foco absoluto em qualidade, design moderno e preços acessíveis. De smartphones de última geração a smartwatches e acessórios para casa inteligente, reunimos o melhor do mundo tech.\n\nAcreditamos que fazer compras deve ser simples, inteligente e satisfatório. Por isso, nossa plataforma foi construída pensando na melhor experiência possível, garantindo segurança extrema desde a escolha do produto até a entrega rápida na porta da sua casa."
                };
            }
            if (slug === 'contact') {
                return {
                    address: "Av. Paulista, 1000, Bela Vista, São Paulo, SP",
                    phone: "+55 11 98765-4321",
                    email: "contato@inove-dev.com"
                };
            }
            return null;
        }
        return db.pages[slug];
    },

    savePageContent: async (slug, content) => {
        const db = getDB();
        if (!db) return;
        if (!db.pages) db.pages = {};
        db.pages[slug] = content;
        saveDB(db);
    },
};