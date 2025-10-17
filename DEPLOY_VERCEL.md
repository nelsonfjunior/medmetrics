# 🚀 Deploy no Vercel - MedMetrics

## **⚠️ IMPORTANTE:**
O Vercel **NÃO suporta servidores Node.js** no plano gratuito. Vamos fazer deploy apenas do **frontend** e usar **Supabase** diretamente.

## **🔧 Configuração:**

### **1. Remover servidor Express:**
```bash
# O servidor Express não funcionará no Vercel
# Vamos usar Supabase diretamente no frontend
```

### **2. Configurar variáveis de ambiente no Vercel:**
1. No dashboard do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anônima
   - `JWT_SECRET` = sua chave secreta

### **3. Atualizar código para usar Supabase diretamente:**
Vou criar uma versão que funciona sem servidor Express.

## **📁 Arquivos necessários:**
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `index.html` - Corrigido (removido `/index.tsx`)
- ✅ Variáveis de ambiente configuradas

## **🚀 Deploy:**
1. Faça commit das mudanças
2. Push para o GitHub
3. Conecte no Vercel
4. Configure as variáveis de ambiente
5. Deploy automático

## **⚠️ Limitações:**
- ❌ Sem servidor Express (não funciona no Vercel gratuito)
- ✅ Frontend funcionando
- ✅ Supabase como banco
- ✅ Autenticação via Supabase Auth (recomendado)

## **💡 Alternativa:**
Para ter o servidor completo, use:
- **Railway** (suporta Node.js)
- **Render** (suporta Node.js)
- **Heroku** (suporta Node.js)
