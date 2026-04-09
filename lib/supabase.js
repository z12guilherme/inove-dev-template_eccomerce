import { createClient } from '@supabase/supabase-js'

// Estas variáveis deverão ser colocadas no seu arquivo .env.local no futuro
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima'

// Cria e exporta o cliente para ser usado em qualquer lugar da aplicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey)