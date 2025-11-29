/**
 * React Query Provider
 * 
 * Configura o QueryClient e Provider para toda a aplicação
 * Provê cache automático, revalidação e state management
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

// ============================================
// Query Client Configuration
// ============================================

const createQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            // Configurações padrão para queries
            staleTime: 60 * 1000, // 1 minuto - dados considerados "frescos"
            gcTime: 5 * 60 * 1000, // 5 minutos - garbage collection time (antes era cacheTime)
            refetchOnWindowFocus: true, // Revalidar quando janela recebe foco
            refetchOnReconnect: true, // Revalidar quando reconecta
            retry: 3, // Número de tentativas em caso de erro
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        },
        mutations: {
            // Configurações padrão para mutations
            retry: 1, // Tentar apenas 1 vez
            retryDelay: 1000,
        },
    },
});

// ============================================
// Provider Component
// ============================================

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    // Criar QueryClient dentro do componente para evitar compartilhamento entre requisições (SSR)
    const [queryClient] = useState(() => createQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools apenas em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    position="bottom"
                />
            )}
        </QueryClientProvider>
    );
}
