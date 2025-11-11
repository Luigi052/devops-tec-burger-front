# Error Handling and Loading States Guide

This guide explains how to use the error handling and loading state components in the Pdiddy application.

## Table of Contents

1. [Toast Notifications](#toast-notifications)
2. [Loading States](#loading-states)
3. [Error States](#error-states)
4. [Empty States](#empty-states)
5. [Service Errors](#service-errors)
6. [Error Boundaries](#error-boundaries)
7. [Best Practices](#best-practices)

## Toast Notifications

Toast notifications provide temporary feedback to users about actions they've taken.

### Usage

```tsx
import { useToast } from '@/lib/context/ToastContext';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Produto adicionado ao carrinho!');
  };

  const handleError = () => {
    toast.error('Erro ao processar pedido.');
  };

  const handleInfo = () => {
    toast.info('Você tem 3 itens no carrinho.');
  };

  const handleWarning = () => {
    toast.warning('Estoque baixo para este produto.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Add to Cart</button>
    </div>
  );
}
```

### Toast Types

- **success**: Green toast for successful operations
- **error**: Red toast for errors
- **info**: Blue toast for informational messages
- **warning**: Yellow toast for warnings

### Custom Duration

```tsx
// Toast will disappear after 3 seconds
toast.success('Saved!', 3000);

// Toast will stay until manually closed
toast.error('Critical error', 0);
```

## Loading States

### LoadingSpinner

Simple spinner for inline loading states.

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="sm" />  // Small
<LoadingSpinner size="md" />  // Medium (default)
<LoadingSpinner size="lg" />  // Large
<LoadingSpinner size="xl" />  // Extra large
```

### LoadingOverlay

Full loading state with message.

```tsx
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

<LoadingOverlay message="Carregando produtos..." />
```

### Skeleton Loaders

Skeleton loaders show placeholder content while data is loading.

```tsx
import { 
  Skeleton, 
  ProductCardSkeleton, 
  ProductGridSkeleton,
  CartItemSkeleton 
} from '@/components/ui/Skeleton';

// Basic skeleton
<Skeleton className="h-4 w-full" />
<Skeleton className="h-20 w-20" variant="circular" />

// Product skeletons
<ProductCardSkeleton />
<ProductGridSkeleton count={6} />

// Cart skeleton
<CartItemSkeleton />
```

### Button Loading State

```tsx
import { Button } from '@/components/ui/Button';

<Button loading={isLoading} disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

## Error States

### ErrorState Component

Full-page error state with retry action.

```tsx
import { ErrorState } from '@/components/ui/ErrorState';

<ErrorState
  title="Erro ao carregar produtos"
  message="Não foi possível carregar os produtos. Verifique sua conexão."
  onRetry={handleRetry}
  retryLabel="Tentar novamente"
/>
```

### InlineError Component

Inline error message for forms or sections.

```tsx
import { InlineError } from '@/components/ui/ErrorState';

<InlineError
  message="Erro ao adicionar produto ao carrinho."
  onRetry={handleRetry}
/>
```

## Empty States

Empty states show when there's no data to display.

```tsx
import { EmptyState } from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

<EmptyState
  icon={ShoppingBag}
  title="Carrinho vazio"
  message="Você ainda não adicionou nenhum produto ao carrinho."
  actionLabel="Continuar comprando"
  onAction={() => router.push('/')}
/>
```

## Service Errors

### ServiceError Class

All service methods throw `ServiceError` instances for consistent error handling.

```tsx
import { ServiceError } from '@/lib/errors/ServiceError';

try {
  await productService.create(data);
} catch (error) {
  if (ServiceError.isServiceError(error)) {
    console.log(error.code);      // 'VALIDATION_ERROR'
    console.log(error.statusCode); // 400
    console.log(error.message);    // User-friendly message
  }
}
```

### Error Types

- **NETWORK_ERROR**: Connection issues
- **VALIDATION_ERROR**: Invalid data
- **NOT_FOUND**: Resource not found
- **UNAUTHORIZED**: Permission denied
- **SERVER_ERROR**: Internal server error
- **UNKNOWN_ERROR**: Unexpected error

### Creating Service Errors

```tsx
// Predefined error types
throw ServiceError.networkError();
throw ServiceError.validationError('Nome é obrigatório');
throw ServiceError.notFound('Produto não encontrado');
throw ServiceError.unauthorized();
throw ServiceError.serverError();

// Custom error
throw new ServiceError('Custom message', 'CUSTOM_CODE', 400);

// Convert unknown error
throw ServiceError.fromError(error);
```

## Error Boundaries

Error boundaries catch React errors and show a fallback UI.

### Usage

The root layout already includes an ErrorBoundary. For specific sections:

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error(error, errorInfo);
  }}
>
  <MyComponent />
</ErrorBoundary>
```

## Best Practices

### 1. Complete Data Fetching Pattern

```tsx
function ProductList() {
  const { products, isLoading, error, retry } = useProducts();
  const toast = useToast();

  // Loading state
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar produtos"
        message={error.message}
        onRetry={retry}
      />
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Nenhum produto disponível"
        message="Não há produtos disponíveis no momento."
      />
    );
  }

  // Success state
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Form Submission with Error Handling

```tsx
async function handleSubmit(data: FormData) {
  setIsLoading(true);
  
  try {
    await productService.create(data);
    toast.success('Produto criado com sucesso!');
    router.push('/admin/produtos');
  } catch (error) {
    if (ServiceError.isServiceError(error)) {
      if (error.code === 'VALIDATION_ERROR') {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar produto. Tente novamente.');
      }
    }
  } finally {
    setIsLoading(false);
  }
}
```

### 3. Optimistic Updates with Error Recovery

```tsx
async function handleAddToCart(product: Product) {
  // Optimistic update
  const previousCart = cart;
  updateCartLocally(product);
  toast.success('Produto adicionado ao carrinho!');
  
  try {
    await cartService.addItem(product);
  } catch (error) {
    // Rollback on error
    setCart(previousCart);
    toast.error('Erro ao adicionar produto. Tente novamente.');
  }
}
```

### 4. Custom Hook with Error Handling

```tsx
function useProducts(category?: string) {
  const [state, setState] = useState({
    products: [],
    isLoading: true,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const products = await productService.getAll();
      setState({ products, isLoading: false, error: null });
    } catch (error) {
      const serviceError = ServiceError.fromError(error);
      setState({ products: [], isLoading: false, error: serviceError });
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    retry: fetchProducts,
  };
}
```

### 5. Error Handling in Services

All services should:
- Validate input data
- Throw ServiceError instances
- Provide user-friendly error messages

```tsx
async create(data: CreateProductDTO): Promise<Product> {
  try {
    // Validate
    if (!data.name || !data.price) {
      throw ServiceError.validationError('Nome e preço são obrigatórios.');
    }

    if (data.price <= 0) {
      throw ServiceError.validationError('Preço deve ser maior que zero.');
    }

    // Process
    const product = await this.saveProduct(data);
    return product;
  } catch (error) {
    throw ServiceError.fromError(error);
  }
}
```

## Accessibility

All error handling components follow accessibility best practices:

- **Toast**: Uses `role="alert"` and `aria-live="polite"`
- **Loading**: Includes `aria-label="Carregando"`
- **Error States**: Semantic HTML with proper heading hierarchy
- **Buttons**: Keyboard accessible with focus states

## Testing

Example test for error handling:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { productService } from '@/lib/services/productService';
import { ServiceError } from '@/lib/errors/ServiceError';

jest.mock('@/lib/services/productService');

test('shows error state when fetch fails', async () => {
  const mockError = ServiceError.networkError();
  (productService.getAll as jest.Mock).mockRejectedValue(mockError);

  render(<ProductList />);

  await waitFor(() => {
    expect(screen.getByText(/erro ao carregar produtos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });
});
```

## Examples

See `components/examples/ErrorHandlingExample.tsx` for complete working examples of all error handling patterns.
