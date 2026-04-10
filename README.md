# INOVE-DEV E-commerce

Bem-vindo ao repositório do e-commerce da INOVE-DEV! Este projeto é um template de loja virtual *single-tenant* (loja única), construído para ser robusto, moderno e altamente personalizável.

## Tecnologias Utilizadas
- Next.js
- React
- Tailwind CSS
- Zustand (para gerenciamento de estado)

## 🚀 Começando

Para rodar o projeto localmente, siga estes passos:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/inove-dev-ecommerce.git
   cd inove-dev-ecommerce
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado. O projeto já vem com dados de exemplo (`mock`) e funciona de forma autônoma usando o `LocalStorage` do navegador para simular um banco de dados.

## 🔌 Arquitetura e Integração com Backend

Para facilitar a customização e a integração com diferentes backends, o projeto utiliza o **Padrão de Adaptador (Adapter Pattern)**. Toda a comunicação com o "banco de dados" é centralizada em um único arquivo:

`lib/db/dbAdapter.js`

Por padrão, este adaptador lê e escreve dados no `LocalStorage` do navegador. Isso permite que qualquer desenvolvedor clone o projeto e o execute imediatamente, sem precisar configurar um banco de dados real.

### Como Conectar um Backend Real (Ex: Supabase)

Para conectar seu próprio backend, você só precisa modificar as funções dentro do `dbAdapter.js`. O resto da aplicação continuará funcionando sem alterações.

**Exemplo: Alterando a função `getProducts` para usar o Supabase**

1.  **Instale o cliente do Supabase:**
    ```bash
    npm install @supabase/supabase-js
    ```

2.  **Modifique a função em `lib/db/dbAdapter.js`:**

    ```javascript
    // Exemplo de como ficaria com Supabase
    import { createClient } from '@supabase/supabase-js'

    // Crie o cliente Supabase fora do adapter ou em um arquivo de configuração
    const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

    export const dbAdapter = {
        // ... outros métodos
        getProducts: async () => {
            // Lógica antiga (LocalStorage) foi removida
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                console.error("Erro ao buscar produtos:", error);
                return [];
            }
            return data;
        },
        // ... adapte os outros métodos (createProduct, getOrders, etc.) da mesma forma
    };
    ```

Para auxiliar na criação das tabelas no seu banco de dados, você pode usar o arquivo `migrations.sql` como referência. Ele contém a estrutura de tabelas pensada para este projeto, compatível com PostgreSQL (usado pelo Supabase).

## Créditos e Agradecimentos
Este projeto foi adaptado a partir do excelente repositório **GoCart**. Nossos sinceros agradecimentos aos desenvolvedores originais por disponibilizarem uma base tão incrível e bem estruturada para a comunidade open-source.