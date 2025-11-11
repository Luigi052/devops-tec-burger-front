'use client';

/**
 * Example component demonstrating error handling patterns
 * This file shows how to use all error handling components
 */

import React, { useState } from 'react';
import { useToast } from '@/lib/context/ToastContext';
import { useProducts } from '@/lib/hooks/useProducts';
import { ErrorState, InlineError } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Package } from 'lucide-react';

/**
 * Example 1: Using Toast notifications
 */
export function ToastExample() {
  const toast = useToast();

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Toast Notifications</h3>
      <div className="flex gap-2">
        <Button onClick={() => toast.success('Produto adicionado ao carrinho!')}>
          Success Toast
        </Button>
        <Button onClick={() => toast.error('Erro ao processar pedido.')}>
          Error Toast
        </Button>
        <Button onClick={() => toast.info('Você tem 3 itens no carrinho.')}>
          Info Toast
        </Button>
        <Button onClick={() => toast.warning('Estoque baixo para este produto.')}>
          Warning Toast
        </Button>
      </div>
    </div>
  );
}

/**
 * Example 2: Loading states with skeleton
 */
export function LoadingExample() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Loading States</h3>
      <Button onClick={simulateLoading}>Simulate Loading</Button>
      
      {isLoading ? (
        <div className="space-y-4">
          <LoadingSpinner size="lg" />
          <LoadingOverlay message="Carregando produtos..." />
          <ProductGridSkeleton count={3} />
        </div>
      ) : (
        <p className="text-neutral-600">Click button to see loading states</p>
      )}
    </div>
  );
}

/**
 * Example 3: Error states with retry
 */
export function ErrorStateExample() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Error States</h3>
      <Button onClick={() => setHasError(!hasError)}>
        Toggle Error State
      </Button>
      
      {hasError ? (
        <>
          <ErrorState
            title="Erro ao carregar produtos"
            message="Não foi possível carregar os produtos. Verifique sua conexão e tente novamente."
            onRetry={() => setHasError(false)}
          />
          
          <InlineError
            message="Erro ao adicionar produto ao carrinho."
            onRetry={() => setHasError(false)}
          />
        </>
      ) : (
        <p className="text-neutral-600">Click button to see error states</p>
      )}
    </div>
  );
}

/**
 * Example 4: Empty states
 */
export function EmptyStateExample() {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Empty States</h3>
      
      <EmptyState
        icon={ShoppingBag}
        title="Carrinho vazio"
        message="Você ainda não adicionou nenhum produto ao carrinho."
        actionLabel="Continuar comprando"
        onAction={() => console.log('Navigate to products')}
      />
      
      <EmptyState
        icon={Package}
        title="Nenhum pedido encontrado"
        message="Você ainda não fez nenhum pedido. Que tal fazer seu primeiro pedido?"
        actionLabel="Ver produtos"
        onAction={() => console.log('Navigate to products')}
      />
    </div>
  );
}

/**
 * Example 5: Complete data fetching with error handling
 */
export function DataFetchingExample() {
  const { products, isLoading, error, retry } = useProducts();
  const toast = useToast();

  const handleAddToCart = () => {
    toast.success('Produto adicionado ao carrinho!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Products (Loading)</h3>
        <ProductGridSkeleton count={6} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Products (Error)</h3>
        <ErrorState
          title="Erro ao carregar produtos"
          message={error.message}
          onRetry={retry}
        />
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Products (Empty)</h3>
        <EmptyState
          icon={Package}
          title="Nenhum produto disponível"
          message="Não há produtos disponíveis no momento."
          actionLabel="Recarregar"
          onAction={retry}
        />
      </div>
    );
  }

  // Success state
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Products ({products.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(0, 3).map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h4 className="font-semibold">{product.name}</h4>
            <p className="text-sm text-neutral-600">{product.description}</p>
            <p className="text-lg font-bold text-primary-600 mt-2">
              R$ {product.price.toFixed(2)}
            </p>
            <Button onClick={handleAddToCart} className="mt-2 w-full">
              Adicionar ao carrinho
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
