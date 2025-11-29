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
    <header className="sticky top-0 z-50 bg-neutral-50/80 backdrop-blur-md border-b border-transparent pt-4 pb-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">

          {/* Mobile: Avatar & Greeting */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden border-2 border-white shadow-sm">
                {/* Avatar Placeholder - In a real app, use next/image with user avatar */}
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-500 font-medium">Bom dia 👋</span>
              <span className="text-sm font-bold text-neutral-900 leading-none">
                Alex
              </span>
            </div>
          </div>

          {/* Desktop: Logo */}
          <Link
            href="/"
            className="hidden lg:flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span className="text-3xl">🍔</span>
            <span className="text-2xl font-bold text-neutral-900 tracking-tight">Pdiddy</span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full group">
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />}
                className="w-full bg-white border-transparent focus:bg-white transition-all shadow-sm rounded-2xl"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell (Mobile & Desktop) */}
            <button className="p-2.5 rounded-full bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 transition-colors relative border border-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Navigation />
              <div className="w-px h-8 bg-neutral-200"></div>
              <CartIcon />
              <Link
                href="/perfil"
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
              >
                <User className="w-6 h-6 text-neutral-700" />
              </Link>
            </div>

            {/* Mobile Filter Button (Visual only for now, matching reference) */}
            <button className="lg:hidden p-2.5 rounded-full bg-white text-neutral-900 shadow-sm hover:bg-neutral-50 transition-colors border border-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Separated row */}
        <div className="mt-4 lg:hidden">
          <div className="relative w-full group">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-neutral-400" />}
              className="w-full bg-white border-transparent focus:bg-white transition-all shadow-sm rounded-2xl py-3"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-white rounded-lg text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
