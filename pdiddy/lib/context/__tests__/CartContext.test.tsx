/**
 * CartContext Tests
 * 
 * Note: These are example tests to verify the context implementation.
 * Run with: npm test -- CartContext.test.tsx
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { Product } from '../../types/product';

// Mock product for testing
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 10.99,
  category: 'test',
  imageUrl: '/test.jpg',
  available: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CartContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should provide initial empty cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.total).toBe(0);
    expect(result.current.cart.itemCount).toBe(0);
  });

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addItem(mockProduct, 2);
    });

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(2);
    expect(result.current.cart.itemCount).toBe(2);
    expect(result.current.cart.total).toBe(21.98);
  });

  it('should update item quantity', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addItem(mockProduct, 1);
    });

    await act(async () => {
      await result.current.updateQuantity(mockProduct.id, 3);
    });

    expect(result.current.cart.items[0].quantity).toBe(3);
    expect(result.current.cart.itemCount).toBe(3);
  });

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addItem(mockProduct, 1);
    });

    await act(async () => {
      await result.current.removeItem(mockProduct.id);
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.itemCount).toBe(0);
  });

  it('should clear cart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addItem(mockProduct, 2);
    });

    await act(async () => {
      await result.current.clearCart();
    });

    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.total).toBe(0);
  });

  it('should persist cart to localStorage', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addItem(mockProduct, 1);
    });

    // Check localStorage
    const stored = localStorage.getItem('pdiddy_cart');
    expect(stored).toBeTruthy();
    
    const cart = JSON.parse(stored!);
    expect(cart.items).toHaveLength(1);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');

    consoleSpy.mockRestore();
  });
});
