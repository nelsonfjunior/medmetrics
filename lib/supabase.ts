import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Debug: Verificar se as variáveis estão configuradas
console.log('🔧 Configuração Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Configurada' : 'Não configurada');

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error('❌ Supabase não configurado! Configure as variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
