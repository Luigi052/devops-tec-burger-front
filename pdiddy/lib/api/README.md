# API Module

Este módulo contém toda a infraestrutura para comunicação com a API do Tec Burger.

## Estrutura

```
lib/api/
├── client.ts       # Cliente HTTP configurado (axios)
└── services/       # Serviços organizados por domínio
    ├── products.ts
    └── orders.ts
```

## Cliente HTTP (`client.ts`)

Cliente axios configurado com:

- ✅ Base URL (`http://localhost:8080`)
- ✅ Bearer token authentication
- ✅ Request/Response interceptors
- ✅ Retry logic com exponential backoff
- ✅ Tratamento de erros centralizado
- ✅ Logging em dev mode

### Uso Básico

```typescript
import apiClient from '@/lib/api/client';

// GET request
const response = await apiClient.get('/api/catalog/api/v1/products');

// POST request
const response = await apiClient.post('/api/order/api/v1/orders', {
  productId: 'uuid',
  quantity: 1
}, {
  headers: {
    'Idempotency-Key': 'unique-key'
  }
});
```

### Autenticação

O cliente automaticamente adiciona o Bearer token em todas as requisições:

```typescript
import { setAuthToken, clearAuthToken } from '@/lib/api/client';

// Após login bem-sucedido
setAuthToken('your-jwt-token');

// Logout
clearAuthToken();
```

### Tratamento de Erros

```typescript
import { getApiErrorMessage, isValidationError } from '@/lib/api/client';

try {
  await apiClient.post('/api/order/api/v1/orders', data);
} catch (error) {
  const message = getApiErrorMessage(error);
  
  if (isValidationError(error)) {
    // Tratar erro de validação
  }
}
```

## Serviços

Os serviços encapsulam as chamadas à API por domínio:

### Products Service

```typescript
import { getProducts, getProductById } from '@/lib/api/services/products';

// Listar produtos
const { data, meta } = await getProducts({ limit: 20 });

// Buscar produto específico
const product = await getProductById('product-uuid');
```

### Orders Service

```typescript
import { createOrder, getOrders } from '@/lib/api/services/orders';

// Criar pedido
const { orderId, status } = await createOrder({
  productId: 'product-uuid',
  quantity: 2
});

// Listar pedidos
const { data, meta } = await getOrders({ limit: 20 });
```

## Próximos Passos

1. Implementar serviços de Products (`services/products.ts`)
2. Implementar serviços de Orders (`services/orders.ts`)
3. Criar React Query hooks para cache e state management
4. Criar componentes de UI para loading/error states
