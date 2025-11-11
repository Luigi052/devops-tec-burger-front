'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '../ui/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminNavItems: AdminNavItem[] = [
  {
    href: '/admin/produtos',
    label: 'Produtos',
    icon: <Package className="w-5 h-5" />,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, logout } = useAuth();

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Don't render admin layout for non-admin users
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside 
        className="hidden lg:flex w-64 bg-white border-r border-neutral-200 flex-col"
        aria-label="Navegação lateral administrativa"
      >
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <Link
            href="/admin/produtos"
            className="flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1"
            aria-label="Pdiddy Admin - Ir para página inicial do admin"
          >
            <span className="text-2xl" aria-hidden="true">🍔</span>
            <span>Pdiddy Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" aria-label="Navegação administrativa">
          <ul className="space-y-2" role="list">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      font-medium text-sm transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-200 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-100 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            aria-label="Voltar para o site principal"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>Voltar ao Site</span>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:bg-red-50"
            aria-label="Sair da conta"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Painel Administrativo
            </h1>
            {/* Mobile menu button could go here */}
          </div>
        </header>

        {/* Content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
