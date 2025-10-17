# 🔍 VERIFICAR CONFIGURAÇÃO DO SUPABASE

## **Problema Identificado:**
- ✅ Servidor funcionando (porta 3001)
- ✅ APIs respondendo
- ❌ **Erro ao criar usuário** - Supabase não configurado

## **Solução:**

### **1. Acesse o Supabase:**
1. Vá em [https://supabase.com](https://supabase.com)
2. Faça login
3. Acesse seu projeto

### **2. Execute o SQL:**
1. No Supabase, vá em **SQL Editor**
2. Copie e cole o conteúdo do arquivo `database/schema.sql`
3. Clique em **"Run"**

### **3. Verificar se funcionou:**
1. Vá em **Table Editor**
2. Deve aparecer a tabela **"users"**
3. Se não aparecer, execute o SQL novamente

### **4. Testar novamente:**
1. Acesse http://localhost:5175
2. Tente fazer cadastro
3. Deve funcionar agora

## **📋 SQL para executar:**

```sql
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
CREATE POLICY "Allow all operations for development" ON users
    FOR ALL USING (true);
```

## **✅ Depois de executar o SQL:**
- A tabela `users` deve aparecer no Table Editor
- O cadastro deve funcionar
- Os dados devem ser salvos no Supabase
