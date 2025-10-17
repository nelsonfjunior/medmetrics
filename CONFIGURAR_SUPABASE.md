# 🚨 ERRO DE CONEXÃO - CONFIGURAR SUPABASE

## O problema:
Você está recebendo erro de conexão porque o **Supabase não está configurado**.

## Solução rápida:

### 1. **Criar projeto no Supabase:**
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Escolha sua organização
6. Digite um nome (ex: "medmetrics")
7. Escolha uma senha forte
8. Escolha a região (South America - São Paulo)
9. Clique em "Create new project"

### 2. **Pegar as credenciais:**
1. No dashboard do Supabase, vá em **Settings** > **API**
2. Copie a **Project URL** (algo como: `https://xxxxx.supabase.co`)
3. Copie a **anon public** key (uma string longa)

### 3. **Configurar variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
JWT_SECRET=sua-chave-secreta-jwt-aqui
```

### 4. **Executar o SQL:**
1. No Supabase, vá em **SQL Editor**
2. Copie e cole o conteúdo do arquivo `database/schema.sql`
3. Clique em "Run"

### 5. **Reiniciar o servidor:**
```bash
# Parar o servidor (Ctrl+C)
npm run dev
```

## ✅ Teste:
1. Abra o projeto
2. Tente fazer cadastro
3. Deve funcionar sem erro de conexão

## 🔍 Verificar se está funcionando:
- Abra o Console do navegador (F12)
- Deve aparecer: "🔧 Configuração Supabase: URL: https://..."
- Se aparecer "YOUR_SUPABASE_URL", as variáveis não estão configuradas
