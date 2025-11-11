'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Cart, CartItem } from '../types/cart';
import { Product } from '../types/product';
import { cartService } from '../services/cartService';

interface CartContextValue {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        const loadedCart = await cartService.getCart();
        setCart(loadedCart);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar carrinho');
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    try {
      setError(null);
      const updatedCart = await cartService.addItem(product, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar item');
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    try {
      setError(null);
      const updatedCart = await cartService.removeItem(productId);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover item');
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar quantidade');
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao limpar carrinho');
      throw err;
    }
  }, []);

  const value: CartContextValue = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
