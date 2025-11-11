'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { CartIcon } from './CartIcon';
import { Navigation } from './Navigation';
import { useAuth } from '@/lib/context/AuthContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented in task 5
    console.log('Search:', searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1"
          >
            <span className="text-2xl">🍔</span>
            <span className="hidden sm:inline">Pdiddy</span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md"
          >
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full"
            />
          </form>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <Navigation />
            <div className="flex items-center gap-2">
              <CartIcon />
              <Link
                href="/perfil"
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Perfil do usuário"
              >
                <User className="w-6 h-6 text-neutral-700" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex lg:hidden items-center gap-2">
            <CartIcon />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="md:hidden pb-3"
        >
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              <Navigation />
              {isAuthenticated && (
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
