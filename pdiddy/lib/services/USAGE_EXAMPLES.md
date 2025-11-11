# Service Layer Usage Examples

This document provides examples of how to use the service layer in your components.

## Product Service Examples

### Get all products
```typescript
import { productService } from '@/lib/services';

const products = await productService.getAll();
console.log(products);
```

### Get product by ID
```typescript
const product = await productService.getById('1');
if (product) {
  console.log(product.name, product.price);
}
```

### Search products
```typescript
const results = await productService.search('pizza');
console.log(`Found ${results.length} products`);
```

### Filter by category
```typescript
const pizzas = await productService.getByCategory('Pizza');
```

### Create product (admin)
```typescript
const newProduct = await productService.create({
  name: 'Nova Pizza',
  description: 'Deliciosa pizza artesanal',
  price: 49.90,
  category: 'Pizza',
  imageUrl: '/images/nova-pizza.jpg',
  available: true,
});
```

### Update product (admin)
```typescript
const updated = await productService.update('1', {
  price: 39.90,
  available: false,
});
```

### Delete product (admin)
```typescript
const success = await productService.delete('1');
if (success) {
  console.log('Product deleted');
}
```

## Cart Service Examples

### Get current cart
```typescript
import { cartService } from '@/lib/services';

const cart = await cartService.getCart();
console.log(`Cart has ${cart.itemCount} items, total: R$ ${cart.total}`);
```

### Add item to cart
```typescript
const product = await productService.getById('1');
if (product) {
  const cart = await cartService.addItem(product, 2);
  console.log(`Added 2x ${product.name} to cart`);
}
```

### Update quantity
```typescript
const cart = await cartService.updateQuantity('1', 5);
console.log(`Updated quantity to 5`);
```

### Remove item
```typescript
const cart = await cartService.removeItem('1');
console.log('Item removed from cart');
```

### Clear cart
```typescript
const cart = await cartService.clearCart();
console.log('Cart cleared');
```

## Order Service Examples

### Create order
```typescript
import { orderService, cartService } from '@/lib/services';

const cart = await cartService.getCart();
const order = await orderService.create({
  userId: '1',
  items: cart.items,
  deliveryAddress: {
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  paymentMethod: {
    type: 'credit',
    cardNumber: '1234567890123456',
    cardName: 'João Silva',
    cardExpiry: '12/25',
    cardCVV: '123',
  },
  total: cart.total,
});

// Clear cart after order
await cartService.clearCart();
```

### Get user orders
```typescript
const orders = await orderService.getByUserId('1');
console.log(`User has ${orders.length} orders`);
```

### Get order details
```typescript
const order = await orderService.getById('order-123');
if (order) {
  console.log(`Order #${order.id} - Status: ${order.status}`);
  console.log(`Total: R$ ${order.total}`);
}
```

### Update order status (admin)
```typescript
const order = await orderService.updateStatus('order-123', 'delivering');
```

## User Service Examples

### Login
```typescript
import { userService } from '@/lib/services';

try {
  const user = await userService.login({
    email: 'joao@example.com',
    password: 'password123',
  });
  console.log(`Welcome, ${user.name}!`);
} catch (error) {
  console.error('Login failed:', error);
}
```

### Get current user
```typescript
const user = await userService.getCurrentUser();
if (user) {
  console.log(`Logged in as: ${user.name}`);
} else {
  console.log('Not logged in');
}
```

### Check authentication
```typescript
const isAuth = await userService.isAuthenticated();
if (!isAuth) {
  // Redirect to login
}
```

### Check admin role
```typescript
const isAdmin = await userService.isAdmin();
if (isAdmin) {
  // Show admin features
}
```

### Update profile
```typescript
const updatedUser = await userService.updateProfile({
  name: 'João Silva Santos',
  phone: '(11) 99999-8888',
  savedAddresses: [
    {
      street: 'Rua Nova',
      number: '456',
      neighborhood: 'Jardim',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '12345-678',
    },
  ],
});
```

### Logout
```typescript
await userService.logout();
console.log('Logged out successfully');
```

## Using in React Components

### Example: Product List Component
```typescript
'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/services';
import { Product } from '@/lib/types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>R$ {product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Add to Cart Button
```typescript
'use client';

import { cartService } from '@/lib/services';
import { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await cartService.addItem(product, 1);
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Erro ao adicionar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </button>
  );
}
```
