# 🧪 Guia Completo de Testes - Tec Burger API

## 📋 Pré-requisitos

- ✅ Backend rodando em `http://localhost:8080`
- ✅ Frontend rodando em `http://localhost:3000`
- ✅ Docker Desktop instalado
- ✅ Node.js instalado

---

## 🚀 Passo a Passo de Configuração

### 1. Subir o Backend (se ainda não estiver rodando)

```bash
# Terminal 1 - Backend
cd devops-tec-burger-back/infrastructure
docker compose up
```

**Aguarde até ver:**
```
✅ catalog-service | INFO:     Application startup complete
✅ order-service   | INFO:     Application startup complete  
✅ worker          | INFO:     Application startup complete
✅ api-gateway     | nginx: ...
```

### 2. Verificar Backend

Abra o navegador e teste:

```bash
# Health check
http://localhost:8080/api/catalog/health
http://localhost:8080/api/order/health

# Listar produtos (deve retornar JSON)
http://localhost:8080/api/catalog/api/v1/products
```

### 3. Subir o Frontend

```bash
# Terminal 2 - Frontend
cd devops-tec-burger-front/pdiddy
npm run dev
```

**Acesse:**
```
http://localhost:3000
```

---

## 🧪 Roteiro de Testes

### **Teste 1: Comportamento Padrão (API)** ☁️

1. Acesse `http://localhost:3000`
2. **Observe:** A página deve tentar carregar da API automaticamente.
3. Se o backend estiver rodando, você verá o banner **Azul**: "Modo: ☁️ API Real".

### **Teste 2: Fallback Automático (Mock)** 🛡️

1. **Pare o backend** (Ctrl+C no terminal do docker compose).
2. Recarregue a página `http://localhost:3000`.
3. **Observe:**
   - A página tenta carregar...
   - Detecta erro de conexão.
   - Muda automaticamente para o banner **Laranja**: "Modo Fallback: API Indisponível".
   - Os produtos Mock são exibidos.

### **Teste 3: Recuperação Automática** 🔄

1. Com a página em modo Fallback (Laranja).
2. **Suba o backend novamente** (`docker compose up`).
3. Aguarde os serviços iniciarem.
4. Clique no botão **"Tentar API Novamente"**.
5. **Observe:**
   - O banner muda para **Azul**.
   - Produtos da API são carregados.

---

### **Teste 4: React Query DevTools** 🔍

1. Com modo API ativado
2. Olhe para o canto **inferior** da tela
3. Clique no ícone do React Query (flor/logo)
4. Veja o cache de queries

**✅ Você deve ver:**
```
['products', 'list', {...}] - Status: success
```

---

### **Teste 5: Cache Automático** ⚡

1. Com API ativada, navegue pela página
2. Clique no botão **Forçar Mock** (Roxo)
3. Clique no botão **Usar API** (Azul)
4. **Observe**: Produtos aparecem INSTANTANEAMENTE (cache!)

---

### **Teste 6: Criar Pedido (Orders)** 📋

Para testar orders, você precisará criar uma página de pedidos.

**Usando cURL:**

```bash
# Criar um pedido
curl -X POST http://localhost:8080/api/order/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-123456" \
  -d '{
    "productId": "UUID-DO-PRODUTO",
    "quantity": 2
  }'

# Resposta esperada (202 Accepted):
{
  "orderId": "novo-uuid-aqui",
  "status": "pending"
}
```

---

## 🐛 Solução de Problemas

### Erro: "Network Error" ou "Failed to fetch"

**Causa:** Backend não está rodando ou CORS

**Solução:**
```bash
# Verificar se backend está up
docker ps
```

### Erro: "Products not found" ou array vazio

**Causa:** Banco de dados vazio

**Solução:**
```bash
# Verificar migrações e seed
cd devops-tec-burger-back/infrastructure
docker compose exec -w /app/db catalog-service alembic upgrade head
```

---

## 📊 Checklist de Validação

### Backend ✅
- [ ] `docker compose up` sem erros
- [ ] Healthchecks respondendo (200 OK)
- [ ] GET /products retorna JSON válido

### Frontend ✅
- [ ] `npm run dev` sem erros
- [ ] Página inicial carrega API por padrão
- [ ] Fallback automático funciona se API cair
- [ ] Botão de retry funciona
- [ ] Produtos aparecem (ambos os modos)

---

## ✅ Sucesso!

Se todos os testes passaram, você tem:
- ✅ Frontend integrado com API
- ✅ Sistema de **Fallback Automático** robusto
- ✅ Cache automático funcionando
- ✅ Toggle mock/real implementado

**Parabéns! 🎉**
