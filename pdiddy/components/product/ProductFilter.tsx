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
      <h2 id="filter-heading" className="text-lg font-semibold text-neutral-900 mb-3">
        Categorias
      </h2>
      
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de categoria">
        <Button
          variant={selectedCategory === null ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          aria-pressed={selectedCategory === null}
          aria-label="Mostrar todos os produtos"
        >
          Todos
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            aria-pressed={selectedCategory === category}
            aria-label={`Filtrar por ${category}`}
          >
            {category}
          </Button>
        ))}
      </div>
    </section>
  );
};
