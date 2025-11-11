'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout';
import { useAuth } from '@/lib/context/AuthContext';
import { ProfileForm, SavedAddresses, OrderHistory } from '@/components/profile';

export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-48"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Meu Perfil
          </h1>
          <p className="text-neutral-600">
            Gerencie suas informações pessoais, endereços e pedidos
          </p>
        </div>

        <div className="space-y-6">
          <ProfileForm />
          <SavedAddresses />
          <OrderHistory />
        </div>
      </div>
    </CustomerLayout>
  );
}
