import gs_logo from "./gs_logo.jpg"
import happy_store from "./happy_store.webp"
import upload_area from "./upload_area.svg"
import hero_model_img from "./hero_model_img.png"
import hero_product_img1 from "./hero_product_img1.png"
import hero_product_img2 from "./hero_product_img2.png"
import product_img1 from "./product_img1.png"
import product_img2 from "./product_img2.png"
import product_img3 from "./product_img3.png"
import product_img4 from "./product_img4.png"
import product_img5 from "./product_img5.png"
import product_img6 from "./product_img6.png"
import product_img7 from "./product_img7.png"
import product_img8 from "./product_img8.png"
import product_img9 from "./product_img9.png"
import product_img10 from "./product_img10.png"
import product_img11 from "./product_img11.png"
import product_img12 from "./product_img12.png"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg"
import profile_pic2 from "./profile_pic2.jpg"
import profile_pic3 from "./profile_pic3.jpg"

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1, hero_product_img2, gs_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,
}

export const categories = ['Eletrônicos', 'Roupas', 'Casa & Cozinha', 'Beleza & Saúde', 'Brinquedos & Jogos', 'Esportes', 'Livros', 'Alimentos', 'Outros'];

export const dummyRatingsData = [
    { id: "rat_1", rating: 4.2, review: "Eu estava um pouco cético no começo, mas este produto acabou sendo ainda melhor do que eu imaginava. A qualidade parece premium, é fácil de usar e entrega exatamente o que foi prometido. Já recomendei para amigos e definitivamente comprarei novamente no futuro.", user: { name: 'Camila Silva', image: profile_pic1 }, productId: "prod_1", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Luminária de Mesa Moderna', category: 'Casa & Cozinha', id: 'prod_1' } },
    { id: "rat_2", rating: 5.0, review: "Este produto é ótimo. Eu adorei! Tornou a minha vida muito mais simples e o desempenho é excelente.", user: { name: 'Juliana Costa', image: profile_pic2 }, productId: "prod_2", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Smart Speaker Cinza', category: 'Eletrônicos', id: 'prod_2' } },
    { id: "rat_3", rating: 4.1, review: "Este produto é incrível. Funciona super bem e a qualidade do material é muito boa, recomendo a todos.", user: { name: 'Bruno Mendes', image: profile_pic3 }, productId: "prod_3", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Smartwatch Branco', category: 'Eletrônicos', id: 'prod_3' } },
    { id: "rat_4", rating: 5.0, review: "Muito bom, entrega rápida e o produto superou todas as minhas expectativas. Com certeza comprarei de novo.", user: { name: 'Camila Silva', image: profile_pic1 }, productId: "prod_4", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Fones de Ouvido Sem Fio', category: 'Eletrônicos', id: 'prod_4' } },
    { id: "rat_5", rating: 4.3, review: "No geral, estou muito feliz com esta compra. Funciona como descrito e parece durável. O único motivo de não dar cinco estrelas foi um pequeno atraso na transportadora.", user: { name: 'Juliana Costa', image: profile_pic2 }, productId: "prod_5", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Smartwatch Preto', category: 'Eletrônicos', id: 'prod_5' } },
    { id: "rat_6", rating: 5.0, review: "Excelente qualidade de construção e fácil de configurar. Muito satisfeito com a compra da INOVE-DEV!", user: { name: 'Bruno Mendes', image: profile_pic3 }, productId: "prod_6", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Câmera de Segurança', category: 'Eletrônicos', id: 'prod_6' } },
]

export const dummyStoreData = {
    id: "store_1",
    userId: "user_1",
    name: "Loja INOVE-DEV",
    description: "Na INOVE-DEV, acreditamos que fazer compras deve ser simples, inteligente e satisfatório. Estamos trazendo as últimas inovações e produtos essenciais diretamente para você.",
    username: "inovedev",
    address: "Av. Paulista, 1000, Bela Vista, São Paulo, SP",
    status: "approved",
    isActive: true,
    logo: happy_store,
    email: "contato@inove-dev.com",
    contact: "+55 11 98765-4321",
    createdAt: "2025-09-04T09:04:16.189Z",
    updatedAt: "2025-09-04T09:04:44.273Z",
    user: {
        id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "Admin INOVE-DEV",
        email: "admin@inove-dev.com",
        image: gs_logo,
    }
}

export const productDummyData = [
    {
        id: "prod_1",
        name: "Luminária de Mesa Moderna",
        description: "Luminária de mesa moderna com um design elegante. É perfeita para qualquer cômodo, escritório ou criado-mudo. Feita com materiais de alta qualidade para garantir longa durabilidade e iluminação suave. Transforme o ambiente da sua casa com essa peça exclusiva.",
        mrp: 140.00,
        price: 99.90,
        images: [product_img1, product_img2, product_img3, product_img4],
        category: "Casa & Cozinha",
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_2",
        name: "Smart Speaker Cinza",
        description: "Alto-falante inteligente com um design compacto e moderno. Perfeito para qualquer ambiente. Conectividade Bluetooth de última geração e assistente de voz integrado.",
        mrp: 250.00,
        price: 189.00,
        images: [product_img2],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_3",
        name: "Smartwatch Branco",
        description: "Smartwatch versátil com tela de alta definição, monitoramento de saúde e bateria de longa duração. Design resistente à água e conectividade com os melhores apps esportivos.",
        mrp: 360.00,
        price: 279.90,
        images: [product_img3],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_4",
        name: "Fones de Ouvido Sem Fio",
        description: "Fones de ouvido sem fio confortáveis e com cancelamento de ruído ativo. Graves potentes e áudio imersivo para até 30 horas de reprodução contínua sem interrupções.",
        mrp: 470.00,
        price: 329.00,
        images: [product_img4],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_5",
        name: "Smartwatch Preto",
        description: "Relógio inteligente com tela AMOLED e estrutura de alumínio. Perfeito para academia e uso diário, recebendo notificações de mensagens diretamente no seu pulso.",
        mrp: 349.00,
        price: 289.00,
        images: [product_img5],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_6",
        name: "Câmera de Segurança",
        description: "Câmera de segurança IP com visão noturna, sensor de movimento e controle via aplicativo. Acompanhe a segurança da sua casa de qualquer lugar do mundo.",
        mrp: 259.00,
        price: 199.00,
        images: [product_img6],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_7",
        name: "Caneta Smart para iPad",
        description: "Caneta inteligente compatível com iPads. Perfeita para desenhar, tomar notas e fazer esboços com extrema precisão e rejeição de palma. Recarga rápida.",
        mrp: 289.00,
        price: 199.90,
        images: [product_img7],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_8",
        name: "Home Theater",
        description: "Sistema de Home Theater Soundbar 5.1. Experimente o cinema no conforto da sua sala com graves incríveis e conectividade óptica ou via Bluetooth.",
        mrp: 990.00,
        price: 829.00,
        images: [product_img8],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_9",
        name: "Fones Sem Fio Premium",
        description: "Earbuds premium verdadeiramente sem fio. Encaixe perfeito, case de carregamento rápido e qualidade de estúdio nas suas mãos.",
        mrp: 389.00,
        price: 299.90,
        images: [product_img9],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_10",
        name: "Smart Watch Séries PRO",
        description: "A mais nova geração de Smart Watches PRO com monitoramento de O2 no sangue, tela infinita e diversas interfaces customizáveis. Fique conectado com estilo.",
        mrp: 1179.00,
        price: 929.00,
        images: [product_img10],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_11",
        name: "Mouse Gamer RGB",
        description: "Mouse Gamer RGB com DPI ajustável e formato ergonômico. Aprimore sua jogabilidade com botões laterais e precisão milimétrica em qualquer superfície.",
        mrp: 139.00,
        price: 99.00,
        images: [product_img11],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Eletrônicos",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_12",
        name: "Aspirador Robô Inteligente",
        description: "Aspirador robô inteligente capaz de mapear a casa inteira e limpar por cantos e bordas. Retorna para a base sozinho e é compatível com assistente virtual.",
        mrp: 1199.00,
        price: 999.00,
        images: [product_img12],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Casa & Cozinha",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
    }
];

export const ourSpecsData = [
    { title: "Frete Grátis", description: "Aproveite a entrega rápida e grátis em todos os pedidos. Sem letras miúdas, apenas conveniência na sua porta.", icon: SendIcon, accent: '#05DF72' },
    { title: "Devolução em 7 Dias", description: "Mudou de ideia? Sem problemas. Devolva ou troque qualquer item em até 7 dias úteis sem complicações.", icon: ClockFadingIcon, accent: '#FF8904' },
    { title: "Suporte 24/7", description: "Estamos sempre aqui por você. Obtenha ajuda imediata com nosso time de atendimento especializado ao cliente.", icon: HeadsetIcon, accent: '#A684FF' }
]

export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "João da Silva",
    email: "joao.silva@exemplo.com",
    street: "Av. Paulista, 1578",
    city: "São Paulo",
    state: "SP",
    zip: "01310-200",
    country: "Brasil",
    phone: "11987654321",
    createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
}

export const couponDummyData = [
    { code: "NOVO20", description: "20% de Desconto p/ Novos Usuários", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "NOVO10", description: "10% de Desconto p/ Novos Usuários", discount: 10, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "OFF20", description: "20% de Desconto p/ Todos", discount: 20, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "OFF10", description: "10% de Desconto p/ Todos", discount: 10, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "PLUS10", description: "10% de Desconto p/ Membros VIP", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "Admin INOVE-DEV",
    email: "admin@inove-dev.com",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: dummyRatingsData[2],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0], },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1], }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4], }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const storesDummyData = [
    {
        id: "cmemkb98v0001tat8r1hiyxhn",
        userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "INOVE-DEV",
        description: "INOVE-DEV é a sua loja de eletrônicos, casa inteligente e gadgets de ponta para melhorar a sua vida.",
        username: "inovedev",
        address: "São Paulo, SP, Brasil",
        status: "approved",
        isActive: true,
        logo: gs_logo,
        email: "contato@inove-dev.com",
        contact: "+55 11 98765-4321",
        createdAt: "2025-08-22T08:22:16.189Z",
        updatedAt: "2025-08-22T08:22:44.273Z",
        user: dummyUserData,
    },
    {
        id: "cmemkqnzm000htat8u7n8cpte",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        name: "INOVE-DEV",
        description: "Na INOVE-DEV, acreditamos que fazer compras deve ser simples, inteligente e satisfatório.",
        username: "inovedev_2",
        address: "São Paulo, SP",
        status: "approved",
        isActive: true,
        logo: happy_store,
        email: "contato@inove-dev.com",
        contact: "+55 11 98765-4321",
        createdAt: "2025-08-22T08:34:15.155Z",
        updatedAt: "2025-08-22T08:34:47.162Z",
        user: dummyUserData,
    }
]

export const dummyAdminDashboardData = {
    "orders": 6,
    "stores": 2,
    "products": 12,
    "revenue": "959.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "ratings": dummyRatingsData,
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}