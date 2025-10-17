// Configuração do Supabase
// Substitua pelos seus valores reais do Supabase

export const supabaseConfig = {
  url: process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret'
};

// Instruções para configurar:
// 1. Acesse https://supabase.com
// 2. Crie um novo projeto
// 3. Vá em Settings > API
// 4. Copie a URL do projeto e a chave anônima
// 5. Substitua os valores acima ou configure as variáveis de ambiente
