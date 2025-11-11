import { Cart, CartItem } from '../types/cart';
import { Product } from '../types/product';
import { storage } from '../utils/storage';
import { ServiceError } from '../errors/ServiceError';

const STORAGE_KEY = 'pdiddy_cart';

/**
 * Cart Service - Operations for managing shopping cart
 */
class CartService {
  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    try {
      const cart = storage.get<Cart>(STORAGE_KEY);
      
      if (!cart) {
        return {
          items: [],
          total: 0,
          itemCount: 0,
        };
      }

      // Recalculate totals to ensure consistency
      return this.recalculateCart(cart);
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Add item to cart
   */
  async addItem(product: Product, quantity: number = 1): Promise<Cart> {
    try {
      if (!product || !product.id) {
        throw ServiceError.validationError('Produto inválido.');
      }

      if (quantity <= 0) {
        throw ServiceError.validationError('Quantidade deve ser maior que zero.');
      }

      if (!product.available) {
        throw ServiceError.validationError('Produto não está disponível.');
      }

      const cart = await this.getCart();
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal = 
          cart.items[existingItemIndex].quantity * product.price;
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity,
          subtotal: product.price * quantity,
        };
        cart.items.push(newItem);
      }

      const updatedCart = this.recalculateCart(cart);
      storage.set(STORAGE_KEY, updatedCart);
      
      return updatedCart;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(productId: string): Promise<Cart> {
    try {
      const cart = await this.getCart();
      const initialLength = cart.items.length;
      cart.items = cart.items.filter(item => item.productId !== productId);

      if (cart.items.length === initialLength) {
        throw ServiceError.notFound('Item não encontrado no carrinho.');
      }

      const updatedCart = this.recalculateCart(cart);
      storage.set(STORAGE_KEY, updatedCart);
      
      return updatedCart;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Update item quantity
   */
  async updateQuantity(productId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity < 0) {
        throw ServiceError.validationError('Quantidade não pode ser negativa.');
      }

      if (quantity === 0) {
        return this.removeItem(productId);
      }

      const cart = await this.getCart();
      const itemIndex = cart.items.findIndex(item => item.productId === productId);

      if (itemIndex === -1) {
        throw ServiceError.notFound('Item não encontrado no carrinho.');
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = 
        cart.items[itemIndex].product.price * quantity;

      const updatedCart = this.recalculateCart(cart);
      storage.set(STORAGE_KEY, updatedCart);
      
      return updatedCart;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<Cart> {
    try {
      const emptyCart: Cart = {
        items: [],
        total: 0,
        itemCount: 0,
      };

      storage.set(STORAGE_KEY, emptyCart);
      return emptyCart;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Recalculate cart totals
   */
  private recalculateCart(cart: Cart): Cart {
    const total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...cart,
      total,
      itemCount,
    };
  }
}

export const cartService = new CartService();
