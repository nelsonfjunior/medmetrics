-- Schema para o banco de dados Supabase
-- Execute este SQL no SQL Editor do Supabase

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política temporária para permitir acesso total (para desenvolvimento)
-- IMPORTANTE: Remova ou ajuste estas políticas em produção!
CREATE POLICY "Allow all operations for development" ON users
    FOR ALL USING (true);

-- Políticas mais restritivas (comentadas para desenvolvimento):
-- CREATE POLICY "Users can view own data" ON users
--     FOR SELECT USING (auth.uid()::text = id::text);
-- CREATE POLICY "Users can update own data" ON users
--     FOR UPDATE USING (auth.uid()::text = id::text);
-- CREATE POLICY "Users can insert own data" ON users
--     FOR INSERT WITH CHECK (auth.uid()::text = id::text);
