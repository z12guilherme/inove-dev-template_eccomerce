# 📝 TODO: INOVE-DEV E-commerce (Single-Tenant)

Este documento lista as melhorias e tarefas necessárias para transformar o template atual em um produto consolidado, focado em ser uma loja única, altamente personalizável e de alto desempenho.

## 🚀 Fase 1: Conclusão do MVP (Protótipo com LocalStorage)
- [x] Traduzir toda a interface pública para o português.
- [x] Criar layout do painel administrativo.
- [x] Remover lógicas de "Múltiplos Vendedores / Lojas" (SaaS).
- [x] Adaptar a página de "Adicionar Produto" no Admin salvando no Redux/LocalStorage.
- [x] Criar a página de **Gerenciar Produtos** no Admin (Listar, Editar, Excluir e Upload de Fotos).
- [x] Criar a página de **Gerenciar Categorias** no Admin (Adicionar/Remover categorias dinâmicas).
- [x] Criar a página de **Gerenciar Cupons** no Admin (Adicionar/Remover cupons com LocalStorage).
- [x] Criar a página de **Pedidos** no Admin (Visualizar compras feitas e alterar status de entrega).

## 🎨 Fase 2: Personalização White-label (Identidade Visual)
- [x] Criar um sistema ou painel simples para alterar a paleta de cores principal (Tailwind Theme).
- [x] Permitir o upload dinâmico da Logo da marca pelo painel Admin.
- [x] Tornar o Banner promocional dinâmico (editável pelo Admin).
- [x] Tornar os links do Rodapé (Footer) e Redes Sociais dinâmicos.

## 🗄️ Fase 3: Persistência e Banco de Dados (Abordagem Simulada/Adaptável)
- [x] Criar o script SQL (`migrations.sql`) com o novo modelo B2C limpo (como referência).
- [x] Criar "Adapters" ou funções de serviço genéricas para chamadas de DB (permitindo plugar qualquer backend futuramente).
- [x] Consolidar a simulação do Banco de Dados no **LocalStorage/Redux** como implementação padrão do template.
- [x] Documentar no README onde o desenvolvedor deve integrar a API real (Supabase, Firebase, Node, etc.).

## 💳 Fase 4: Checkout e Pagamentos (Simulados)
- [x] Revisar o componente `OrderSummary` para o fluxo de finalização.
- [x] Criar fluxo de Checkout Simulado (Mock de tela de sucesso/falha para Cartão de Crédito e PIX).
- [x] Criar cálculo de Frete Simulado (valores fixos ou regras simples baseadas em prefixo de CEP).
- [x] Adicionar confirmação visual de Pedido Concluído (simulando a etapa em que um E-mail seria disparado).

## ⚙️ Fase 5: Otimização e Lançamento (Produção)
- [x] Revisar SEO (Meta tags, Open Graph, estruturação de links).
- [x] Adicionar testes E2E (End-to-End) para a jornada de compra (do carrinho ao checkout).
- [ ] Limpeza de código morto e pacotes não utilizados (ex: pasta `/store`).
- [ ] Deploy oficial na plataforma (Ex: **Vercel**).

## 🛠️ Fase 6: Personalização Avançada pelo Lojista (CMS & Construtor)
- [x] **Motor Tipográfico e Design Global:** Adicionar controles para selecionar fontes do Google Fonts dinamicamente e gerenciar o `border-radius` em todas as bordas da aplicação (Concluído!).
- [x] **Construtor Dinâmico da Home - Admin:** Criar interface em `/admin/home-layout` para arrastar, habilitar/desabilitar e alterar a ordem das seções (ex: Banner Principal, Produtos Destaques, Grade de Categorias).
- [x] **Motor de Renderização da Home:** Refatorar `app/(public)/page.jsx` para ler a estrutura dinâmica definida no Admin e renderizar os componentes na ordem correta, abandonando o layout fixo.
- [x] **Gestão de Páginas Secundárias (Predefinidas):** Criar editor simples em `/admin/pages` para atualizar textos de páginas já existentes (ex: `/about`, `/contact`, `/faq`), alimentado pelo localStorage no momento.
- [x] **Motor de Variações de Produtos:** Expandir o formulário de cadastro de produtos para permitir N variações do mesmo item (ex: Cor: Preto/Branco | Tamanho: P/M/G) com gestão de estoque/preço individual por variação.
- [ ] *[Postergado]* Persistência em Nuvem (Trabalharemos 100% com LocalStorage/Redux por enquanto até termos um Backend).

## 🚀 Fase 7: Features de E-commerce (Profissionalização)
- [x] **Integração Real de Cupons na Vitrine:** Conectar a tela de Checkout/Carrinho ao gerenciador de cupons local para abater porcentagem do total de forma dinâmica.
- [x] **Fluxo de Sistema de Avaliações (Reviews):** Adicionar um modal/botão na tela do `ProductDetails` onde o usuário possa escrever um comentário, dar estrelas e persistir isso (simuladamente) no localStorage para então ser renderizado no momento para os outros usuários.
- [x] **Busca Global Mapeada na Navbar:** Fazer o formulário de pesquisa da `Navbar` redirecionar e carregar a query string para a página `/shop?q=xxx`, e garantir que a página Shop respeite e filtre baseado no Redux os produtos com aquele título/descrição.
- [x] **Filtros Avançados Inteligentes:** Na página de `shop`, plugar e fazer funcionarem as categorias da lateral esqueda e o controle de range financeiro.
- [x] **Aviso de Estoque Limítrofe:** Incorporar uma checagem de `.inStock` no frontend (ProductDetails e Carrinho). Bloquear botão quando "Esgotado".

---
*💡 Foco: Construir uma loja rápida, segura, responsiva e pronta para ser entregue para o cliente final da INOVE-DEV sem dor de cabeça, permitindo total controle visual.*