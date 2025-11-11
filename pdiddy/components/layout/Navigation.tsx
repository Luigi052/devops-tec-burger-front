'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User, Package } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
}

const navItems: NavItem[] = [
    {
        href: '/',
        label: 'Início',
        icon: <Home className="w-5 h-5" />,
    },
    {
        href: '/carrinho',
        label: 'Carrinho',
        icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
        href: '/perfil',
        label: 'Perfil',
        icon: <User className="w-5 h-5" />,
    },
    {
        href: '/admin/produtos',
        label: 'Admin',
        icon: <Package className="w-5 h-5" />,
        adminOnly: true,
    },
];

export function Navigation() {
    const pathname = usePathname();
    const { isAdmin } = useAuth();

    const filteredNavItems = navItems.filter(
        (item) => !item.adminOnly || isAdmin
    );

    return (
        <nav className="flex items-center gap-1" aria-label="Navegação principal">
            {filteredNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500
              ${isActive
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-neutral-700 hover:bg-neutral-100'
                            }
            `}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {item.icon}
                        <span className="hidden md:inline">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
