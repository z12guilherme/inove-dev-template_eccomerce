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
- [ ] Adicionar testes E2E (End-to-End) para a jornada de compra (do carrinho ao checkout).
- [ ] Limpeza de código morto e pacotes não utilizados (ex: pasta `/store`).
- [ ] Deploy oficial na plataforma (Ex: **Vercel**).

---
*💡 Foco: Construir uma loja rápida, segura, responsiva e pronta para ser entregue para o cliente final da INOVE-DEV sem dor de cabeça.*