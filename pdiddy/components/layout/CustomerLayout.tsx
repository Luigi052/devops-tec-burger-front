import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
      <Footer />
    </div>
  );
}
