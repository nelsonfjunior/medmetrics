// Teste de conexão com Supabase
// Execute este arquivo com: node test-supabase-connection.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('🔍 Verificando configuração...');
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não encontrada');
console.log('Anon Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não encontrada');

if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ ERRO: Variáveis de ambiente não configuradas!');
    console.log('Verifique se o arquivo .env contém:');
    console.log('VITE_SUPABASE_URL=https://seu-projeto.supabase.co');
    console.log('VITE_SUPABASE_ANON_KEY=sua-chave-anonima');
    process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('\n🔄 Testando conexão com Supabase...');
        
        // Testar conexão básica
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (error) {
            console.log('❌ Erro na conexão:', error.message);
            return false;
        }
        
        console.log('✅ Conexão com Supabase funcionando!');
        console.log('✅ Tabela "users" acessível');
        
        return true;
    } catch (err) {
        console.log('❌ Erro inesperado:', err.message);
        return false;
    }
}

// Executar teste
testConnection().then(success => {
    if (success) {
        console.log('\n🎉 Tudo funcionando perfeitamente!');
        console.log('Você pode agora executar: npm run dev');
    } else {
        console.log('\n💡 Dicas para resolver:');
        console.log('1. Verifique se executou o schema SQL no Supabase');
        console.log('2. Confirme se as variáveis de ambiente estão corretas');
        console.log('3. Verifique se o projeto Supabase está ativo');
    }
});
