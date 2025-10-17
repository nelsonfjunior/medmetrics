# 🚀 DEPLOY VERCEL - TELA BRANCA CORRIGIDA

## **❌ Problema: Tela Branca**
- Build funciona localmente ✅
- Deploy na Vercel = tela branca ❌

## **🔧 Soluções:**

### **1. Configuração Vercel.json Corrigida:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### **2. Variáveis de Ambiente OBRIGATÓRIAS:**
No dashboard da Vercel, adicione:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima
```

### **3. Passos para Deploy:**

#### **A. Configure as Variáveis:**
1. Vá para [vercel.com](https://vercel.com)
2. Seu projeto → Settings → Environment Variables
3. Adicione as 2 variáveis acima

#### **B. Redeploy:**
1. Vá para Deployments
2. Clique em "Redeploy" no último deploy
3. Ou faça um novo commit no GitHub

### **4. Verificar se Funcionou:**
- Acesse o link do site
- Deve aparecer a tela de login
- Se ainda tiver tela branca, verifique o console do navegador (F12)

## **🔍 Debug Adicional:**

### **Se ainda não funcionar:**
1. **Abra o Console** (F12) no site
2. **Procure por erros** em vermelho
3. **Verifique se as variáveis** estão sendo carregadas

### **Erros Comuns:**
- ❌ `VITE_SUPABASE_URL is not defined` → Variável não configurada
- ❌ `Failed to fetch` → Problema de CORS ou URL
- ❌ `Module not found` → Problema de build

## **✅ Deve Funcionar Agora!**
