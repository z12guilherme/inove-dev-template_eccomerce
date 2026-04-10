-- ========================================================================================
-- BANCO DE DADOS E-COMMERCE INOVE-DEV (SUPABASE / PostgreSQL)
-- Script de criação de tabelas, relacionamentos e segurança
-- Revisado em: 2026-04-10 — alinhado com dbAdapter.js, OrderSummary, AddressModal
-- ========================================================================================

-- Extensão necessária para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================================
-- 1. TABELA DE PERFIS (Extensão da tabela auth.users do Supabase)
-- ========================================================================================
CREATE TABLE public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  role       TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  image      TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ========================================================================================
-- 2. TABELA DE PRODUTOS
-- ========================================================================================
CREATE TABLE public.products (
  id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT    NOT NULL,
  description TEXT,
  category    TEXT    NOT NULL,
  mrp         NUMERIC(10, 2) NOT NULL,           -- Preço original (de)
  price       NUMERIC(10, 2) NOT NULL,           -- Preço com desconto (por)
  images      TEXT[]  DEFAULT '{}',              -- Array de URLs no Supabase Storage
  in_stock    BOOLEAN DEFAULT true,              -- Disponibilidade em estoque
  is_active   BOOLEAN DEFAULT true,              -- Produto visível na loja
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ========================================================================================
-- 3. TABELA DE AVALIAÇÕES DE PRODUTOS
--    rating usa NUMERIC para suportar meias-estrelas (ex: 4.2, 3.5)
-- ========================================================================================
CREATE TABLE public.reviews (
  id         UUID           DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID           REFERENCES public.products(id) ON DELETE CASCADE,
  user_id    UUID           REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating     NUMERIC(3, 1)  NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  review     TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ========================================================================================
-- 4. TABELA DE ENDEREÇOS
--    Alinhada com AddressModal.jsx: name, email, phone, street, city, state, zip, country
-- ========================================================================================
CREATE TABLE public.addresses (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,     -- Nome do destinatário
  email      TEXT NOT NULL,     -- E-mail para confirmação
  phone      TEXT NOT NULL,     -- Telefone / WhatsApp
  street     TEXT NOT NULL,     -- Rua, número e complemento
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,     -- UF (2 caracteres)
  zip        TEXT NOT NULL,     -- CEP (somente números)
  country    TEXT NOT NULL DEFAULT 'Brasil',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ========================================================================================
-- 5. TABELA DE CUPONS DE DESCONTO
--    Coluna 'discount' (inteiro 1-100) alinhada com o dbAdapter e UI de cupons
-- ========================================================================================
CREATE TABLE public.coupons (
  id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  code        TEXT    UNIQUE NOT NULL,
  description TEXT,
  discount    INTEGER NOT NULL CHECK (discount > 0 AND discount <= 100), -- porcentagem inteira (%)
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ========================================================================================
-- 6. TABELA DE PEDIDOS
--    Inclui campos extras capturados pelo OrderSummary:
--    customer_name, customer_email, coupon_code, discount_amount, shipping_cost
-- ========================================================================================
CREATE TABLE public.orders (
  id              UUID           DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID           REFERENCES public.profiles(id) ON DELETE SET NULL,
  address_id      UUID           REFERENCES public.addresses(id) ON DELETE RESTRICT,

  -- Snapshot do cliente no momento da compra (evita depender de JOIN em dados futuros)
  customer_name   TEXT,
  customer_email  TEXT,

  -- Pagamento
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('PIX', 'STRIPE')),
  total           NUMERIC(10, 2) NOT NULL,
  shipping_cost   NUMERIC(10, 2) NOT NULL DEFAULT 0,

  -- Cupom (snapshot do código e valor descontado)
  is_coupon_used  BOOLEAN DEFAULT false,
  coupon_code     TEXT,
  coupon_id       UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ========================================================================================
-- 7. TABELA DE ITENS DO PEDIDO
--    Coluna renomeada para 'price' (alinhada com o dbAdapter/OrderSummary)
-- ========================================================================================
CREATE TABLE public.order_items (
  id         UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id   UUID    REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID    REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  price      NUMERIC(10, 2) NOT NULL -- Preço unitário no momento da compra (snapshot)
);

-- ========================================================================================
-- 8. TABELA DE CONFIGURAÇÕES DO RODAPÉ (Footer dinâmico — Admin)
--    Armazenada como JSONB para flexibilidade máxima (links, redes sociais, contato)
-- ========================================================================================
CREATE TABLE public.footer_settings (
  id              UUID  DEFAULT uuid_generate_v4() PRIMARY KEY,
  social_links    JSONB DEFAULT '{"facebook":"","instagram":"","twitter":"","linkedin":""}',
  contact         JSONB DEFAULT '{"phone":"","email":"","address":""}',
  products_links  JSONB DEFAULT '[]',
  navigation_links JSONB DEFAULT '[]',
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);
-- Garante que só exista uma linha de configuração por loja (single-tenant)
INSERT INTO public.footer_settings DEFAULT VALUES;

-- ========================================================================================
-- 9. TABELA DE CONFIGURAÇÕES DE TEMA (Paleta de Cores — Admin)
--    Armazenada como JSONB para suportar múltiplas variáveis CSS
-- ========================================================================================
CREATE TABLE public.theme_settings (
  id            UUID  DEFAULT uuid_generate_v4() PRIMARY KEY,
  primary_color       TEXT DEFAULT '#16a34a',
  primary_light_color TEXT DEFAULT '#bbf7d0',
  primary_mid_color   TEXT DEFAULT '#86efac',
  primary_dark_color  TEXT DEFAULT '#15803d',
  accent_color        TEXT DEFAULT '#1e293b',
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);
-- Garante que só exista uma linha de tema por loja
INSERT INTO public.theme_settings DEFAULT VALUES;

-- ========================================================================================
-- SEGURANÇA — ROW LEVEL SECURITY (RLS)
-- Habilita RLS em todas as tabelas para impedir acesso direto não autorizado
-- ========================================================================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings  ENABLE ROW LEVEL SECURITY;

-- ========================================================================================
-- EXEMPLOS DE POLÍTICAS RLS (adaptar conforme a autenticação usada)
-- ========================================================================================

-- Produtos: leitura pública, escrita apenas para admin
CREATE POLICY "Produtos visíveis para todos" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin gerencia produtos" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Pedidos: usuário vê apenas os próprios; admin vê todos
CREATE POLICY "Usuário vê seus pedidos" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin vê todos os pedidos" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Endereços: usuário gerencia apenas os próprios
CREATE POLICY "Usuário gerencia seus endereços" ON public.addresses
  FOR ALL USING (user_id = auth.uid());

-- Avaliações: leitura pública, escrita autenticada
CREATE POLICY "Avaliações visíveis para todos" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Usuário autenticado cria avaliação" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Configurações de rodapé e tema: somente admin
CREATE POLICY "Admin gerencia rodapé" ON public.footer_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin gerencia tema" ON public.theme_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Leitura pública de rodapé e tema (necessária para o front-end exibir sem autenticação)
CREATE POLICY "Leitura pública do rodapé" ON public.footer_settings
  FOR SELECT USING (true);

CREATE POLICY "Leitura pública do tema" ON public.theme_settings
  FOR SELECT USING (true);