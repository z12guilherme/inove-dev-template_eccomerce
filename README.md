# Inove Commerce 🛒

O **Inove Commerce** é um template de E-commerce robusto, escalável e de alta conversão. Inspirado nos maiores varejistas do mercado brasileiro (como *Mercado Livre* e *Americanas*), este projeto foi desenvolvido para oferecer uma base sólida e moderna para qualquer negócio online.

![Inove Commerce Banner](./assets/hero_model_img.png)

## 📌 Visão Geral

Este template entrega uma jornada de compra ponta-a-ponta, apresentando um Front-end moderno voltado para performance e experiência do usuário (UX), além de um Painel Administrativo completo para a gestão da operação.

### ✨ Principais Funcionalidades

- **Integração Logística (Correios):** Cálculo dinâmico de frete baseado no CEP do cliente através de integração direta com API de entregas.
- **Pagamento Automatizado:** Esteira de checkout otimizada e estruturada para receber integrações com os maiores Gateways de pagamento (Pix, Cartão de Crédito, Boletos).
- **Painel Administrativo Independente:** Dashboard administrativo seguro para gestão de Cupons, Pedidos, e Cadastro de Produtos, além de personalização de aparência.
- **Design Responsivo e Premium:** Interfaces dinâmicas, com micro-interações, inspiradas nas maiores lojas online do Brasil para garantir a melhor conversão.
- **Gestão Global de Estado:** Carrinho de compras reativo utilizando o estado global para oferecer feedback instantâneo sem recarregar a tela.

---

## 🚀 Tecnologias Utilizadas

A stack foi cuidadosamente escolhida para priorizar **Server-side Rendering (SSR)** para SEO, velocidade e fácil manutenção:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com design system customizável
- **Gerenciamento de Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) (Carrinho, Produtos, Endereços)
- **Testes Automatizados:** [Vitest](https://vitest.dev/) + React Testing Library
- **Notificações:** React Hot Toast
- **Ícones:** Lucide React

*(O sistema atualmente utiliza um `dbAdapter` robusto construído sobre o `localStorage` do navegador para simular a reatividade do banco de dados perfeitamente. O design pattern utilizado permite trocar facilmente para um ORM como Prisma ou integração com Supabase/Firebase backend).*

---

## 🛠️ Como Rodar Localmente

Certifique-se de ter o **Node.js** (v18+) instalado em sua máquina.

**1. Clone o repositório e acesse a pasta:**
```bash
git clone https://github.com/seu-usuario/inove-dev-template_eccomerce.git
cd inove-dev-template_eccomerce
```

**2. Instale as dependências essenciais:**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) com o seu navegador para ver o E-commerce público.
Acesse [http://localhost:3000/admin](http://localhost:3000/admin) para ver o Dashboard de controle.

---

## 🧪 Suíte de Testes (Vitest)

O Inove Commerce preza pela confiabilidade financeira. Nossa cobertura de testes automatizados cobre desde interações de componentes até lógicas profundas de checkout (subtotal, desconto, cálculo de frete) e o dbAdapter.

Para rodar os testes:
```bash
npm run test
```

Para rodar os testes de forma progressiva (Watch mode):
```bash
npm run test:watch
```

---

## 📁 Estrutura de Diretórios 

```text
├── app/
│   ├── (public)/          # Rotas públicas (Loja, Carrinho, Checkout, Sobre, etc)
│   ├── admin/             # Rotas do Dashboard Administrativo
│   ├── api/               # API Routes do Next.js (Ex: Cálculo de CEP)
│   └── globals.css        # Variáveis globais base do Tailwind
├── components/            # Componentes React reutilizáveis (UI)
├── lib/                   # Configurações do Redux, Adapters (DB) e Serviços Auxiliares
├── assets/                # Configurações de exportações de imagens em JS e Mocks
└── __tests__/             # Suíte auxiliar de testes com Vitest
```

---

## 🤝 Feito por Inove Dev

Desenvolvido e mantido por **Inove Dev**. Uma solução sob medida focada em escalabilidade e resultados rápidos para negócios inovadores.

*Descreva sua ideia e nossa equipe transformará seus problemas complexos em soluções digitais simples e eficientes.*

**Email:** contato@inovedev.com.br
**Siga-nos para mais modelos:** [inovedev.com.br](https://inovedev.com.br)

---

### 🏆 Créditos
Este boilerplate e modelo de E-commerce foi originalmente inspirado no framework e interface do projeto open source **Inove Dev**, construído pela comunidade.
Você pode encontrar e apoiar o repositório formador da base em: [GreatStackDev / Inove Dev](https://github.com/GreatStackDev/Inove Dev).