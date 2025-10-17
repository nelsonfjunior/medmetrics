# ✅ Checklist - Configuração Supabase

## 1. **Projeto Supabase Criado**
- [ ] Acessou [supabase.com](https://supabase.com)
- [ ] Criou um novo projeto
- [ ] Anotou a URL do projeto
- [ ] Anotou a chave anônima (anon key)

## 2. **Variáveis de Ambiente (.env)**
- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] Contém `VITE_SUPABASE_URL=https://seu-projeto.supabase.co`
- [ ] Contém `VITE_SUPABASE_ANON_KEY=sua-chave-anonima`
- [ ] Contém `JWT_SECRET=sua-chave-secreta-jwt`

## 3. **Banco de Dados Configurado**
- [ ] Executou o SQL do arquivo `database/schema.sql` no Supabase
- [ ] Tabela `users` foi criada
- [ ] Índices foram criados
- [ ] Triggers foram criados
- [ ] Políticas RLS foram configuradas

## 4. **Dependências Instaladas**
- [ ] Executou `npm install`
- [ ] `@supabase/supabase-js` foi instalado
- [ ] Não há erros de dependências

## 5. **Teste de Conexão**
- [ ] Executou `node test-supabase-connection.js`
- [ ] Conexão com Supabase funcionando
- [ ] Tabela `users` acessível

## 6. **Aplicação Funcionando**
- [ ] Executou `npm run dev`
- [ ] Aplicação carrega sem erros
- [ ] Pode fazer login/registro
- [ ] Dados são salvos no Supabase

## 🚨 **Problemas Comuns e Soluções**

### ❌ "Supabase URL not found"
- **Solução:** Verifique se o arquivo `.env` está na raiz do projeto
- **Solução:** Confirme se a variável está como `VITE_SUPABASE_URL`

### ❌ "Invalid API key"
- **Solução:** Verifique se copiou a chave correta do Supabase
- **Solução:** Confirme se não há espaços extras na chave

### ❌ "Table 'users' doesn't exist"
- **Solução:** Execute o SQL do arquivo `database/schema.sql`
- **Solução:** Verifique se está no projeto correto do Supabase

### ❌ "Permission denied"
- **Solução:** Verifique se as políticas RLS estão configuradas
- **Solução:** Use a política temporária para desenvolvimento

## 🎯 **Próximos Passos Após Configuração**

1. **Teste completo:**
   - Registre um novo usuário
   - Faça login
   - Adicione uma sessão de estudo
   - Verifique se os dados aparecem no dashboard do Supabase

2. **Otimizações (opcional):**
   - Configure autenticação nativa do Supabase
   - Implemente real-time subscriptions
   - Configure backup automático

## 📞 **Precisa de Ajuda?**

Se algo não estiver funcionando:
1. Verifique os logs do console do navegador
2. Verifique os logs do Supabase (Dashboard > Logs)
3. Execute o teste de conexão: `node test-supabase-connection.js`
4. Confirme se todas as etapas do checklist foram seguidas
