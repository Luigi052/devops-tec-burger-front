'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface ProductFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <section className="mb-6" aria-labelledby="filter-heading">
      <h2 id="filter-heading" className="text-lg font-semibold text-brown-900 mb-3">
        Categorias
      </h2>

      <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide" role="group" aria-label="Filtros de categoria">
        <Button
          variant={selectedCategory === null ? 'primary' : 'outline'}
          className={`rounded-full px-6 h-10 whitespace-nowrap transition-all ${selectedCategory === null ? 'shadow-md shadow-primary-500/25 bg-primary-600 text-white hover:bg-primary-700' : 'bg-cream-100 border-cream-300 hover:bg-cream-200 text-brown-700'}`}
          onClick={() => onCategoryChange(null)}
          aria-pressed={selectedCategory === null}
        >
          🔥 Todos
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline'}
            className={`rounded-full px-6 h-10 whitespace-nowrap transition-all ${selectedCategory === category ? 'shadow-md shadow-primary-500/25 bg-primary-600 text-white hover:bg-primary-700' : 'bg-cream-100 border-cream-300 hover:bg-cream-200 text-brown-700'}`}
            onClick={() => onCategoryChange(category)}
            aria-pressed={selectedCategory === category}
          >
            {/* Map category to emoji/icon here if possible, for now just text */}
            {category === 'Hambúrguer' ? '🍔 ' : category === 'Bebida' ? '🥤 ' : category === 'Sobremesa' ? '🍦 ' : '🍽️ '}
            {category}
          </Button>
        ))}
      </div>
    </section>
  );
};
