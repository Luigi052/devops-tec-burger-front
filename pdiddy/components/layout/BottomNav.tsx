'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

export function BottomNav() {
    const pathname = usePathname();
    const { cart } = useCart();
    const itemCount = cart.itemCount;

    const navItems = [
        {
            href: '/',
            label: 'Home',
            icon: Home,
        },
        {
            href: '/carrinho',
            label: 'Cart',
            icon: ShoppingBag,
            badge: itemCount > 0 ? itemCount : null,
        },
        {
            href: '/favoritos', // Placeholder
            label: 'Favorite',
            icon: Heart,
        },
        {
            href: '/perfil',
            label: 'Profile',
            icon: User,
        },
    ];

    return (
        <div className="fixed bottom-6 left-4 right-4 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] lg:hidden z-50">
            <nav className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                ${isActive
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 -translate-y-4 border-4 border-neutral-50'
                                    : 'text-neutral-400 hover:text-neutral-600'
                                }
              `}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />

                            {item.badge && !isActive && (
                                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
