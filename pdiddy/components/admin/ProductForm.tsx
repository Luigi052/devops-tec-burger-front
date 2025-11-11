'use client';

import React, { useState, useEffect } from 'react';
import { Product, CreateProductDTO } from '@/lib/types/product';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: CreateProductDTO) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    available: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductDTO, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        available: product.available,
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProductDTO, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'URL da imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateProductDTO, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome do Produto"
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        placeholder="Ex: Pizza Margherita"
        required
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`
            w-full px-4 py-2 rounded-lg
            border-2 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${
              errors.description
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
            }
          `}
          rows={3}
          placeholder="Descreva o produto..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Preço (R$)"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          error={errors.price}
          placeholder="0.00"
          required
        />

        <Input
          label="Categoria"
          type="text"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          error={errors.category}
          placeholder="Ex: Pizzas"
          required
        />
      </div>

      <Input
        label="URL da Imagem"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => handleChange('imageUrl', e.target.value)}
        error={errors.imageUrl}
        placeholder="https://exemplo.com/imagem.jpg"
        helperText="Cole o link da imagem do produto"
        required
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) => handleChange('available', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="available" className="text-sm font-medium text-neutral-700">
          Produto disponível para venda
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {product ? 'Atualizar Produto' : 'Criar Produto'}
        </Button>
      </div>
    </form>
  );
}
