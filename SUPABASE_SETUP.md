# Configuração do Supabase para MedMetrics

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "medmetrics")
6. Escolha uma senha forte para o banco de dados
7. Escolha a região mais próxima (ex: South America - São Paulo)
8. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

Após criar o projeto, você precisará das seguintes informações:

### No Dashboard do Supabase:
1. Vá em **Settings** > **API**
2. Copie a **Project URL** e **anon public** key

### Criar arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# JWT Secret (para tokens de autenticação)
JWT_SECRET=sua-chave-secreta-jwt-aqui
```

## 3. Configurar Banco de Dados

1. No Dashboard do Supabase, vá em **SQL Editor**
2. Copie e cole o conteúdo do arquivo `database/schema.sql`
3. Execute o script clicando em "Run"

## 4. Testar a Conexão

Após configurar tudo, você pode testar se está funcionando:

1. Execute `npm install` para instalar as dependências
2. Execute `npm run dev` para iniciar o projeto
3. Tente fazer login/registro para verificar se está funcionando

## 5. Vantagens do Supabase

- ✅ **Interface gráfica** para gerenciar dados
- ✅ **Autenticação integrada** (opcional)
- ✅ **Real-time subscriptions**
- ✅ **Storage para arquivos**
- ✅ **Edge Functions**
- ✅ **Dashboard completo**
- ✅ **Backup automático**
- ✅ **Escalabilidade**

## 6. Migração de Dados (se necessário)

Se você já tem dados no localStorage, pode migrá-los:

1. Exporte os dados do localStorage
2. Use o dashboard do Supabase para inserir os dados
3. Ou crie um script de migração

## 7. Próximos Passos

- Configure autenticação do Supabase (opcional)
- Implemente real-time para atualizações em tempo real
- Use Supabase Storage para arquivos
- Configure Edge Functions para lógica serverless
