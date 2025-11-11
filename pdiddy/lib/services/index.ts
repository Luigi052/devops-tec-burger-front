/**
 * Service layer exports
 * 
 * This file provides a centralized export for all services.
 * The USE_MOCK flag allows switching between mock and API implementations.
 */

export { productService } from './productService';
export { cartService } from './cartService';
export { orderService } from './orderService';
export { userService } from './userService';

// Environment flag for future API integration
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
