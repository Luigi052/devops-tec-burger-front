# Context Usage Examples

This document provides practical examples of how to use the CartContext and AuthContext in your components.

## Setup in Root Layout

First, wrap your application with the providers in your root layout:

```tsx
// app/layout.tsx
import { AuthProvider, CartProvider } from '@/lib/context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Cart Examples

### Example 1: Product Card with Add to Cart

```tsx
'use client';

import { useCart } from '@/lib/context';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart();

  const handleAddToCart = async () => {
    try {
      await addItem(product, 1);
      // Show success toast
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      // Show error toast
      alert('Erro ao adicionar produto');
    }
  };

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">R$ {product.price.toFixed(2)}</p>
      <Button 
        onClick={handleAddToCart} 
        disabled={isLoading || !product.available}
      >
        Adicionar ao Carrinho
      </Button>
    </div>
  );
}
```

### Example 2: Cart Icon with Badge

```tsx
'use client';

import { useCart } from '@/lib/context';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartIcon() {
  const { cart } = useCart();

  return (
    <Link href="/carrinho" className="cart-icon">
      <ShoppingCart size={24} />
      {cart.itemCount > 0 && (
        <span className="badge">{cart.itemCount}</span>
      )}
    </Link>
  );
}
```

### Example 3: Cart Page

```tsx
'use client';

import { useCart } from '@/lib/context';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/components/cart/CartItem';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, clearCart, isLoading } = useCart();
  const router = useRouter();

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <p>Seu carrinho está vazio</p>
        <Button onClick={() => router.push('/')}>
          Continuar Comprando
        </Button>
      </div>
    );
  }

  const handleCheckout = () => {
    router.push('/pedido');
  };

  return (
    <div className="cart-page">
      <h1>Meu Carrinho</h1>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <span>R$ {cart.total.toFixed(2)}</span>
        </div>
        
        <div className="actions">
          <Button 
            variant="outline" 
            onClick={clearCart}
            disabled={isLoading}
          >
            Limpar Carrinho
          </Button>
          <Button 
            onClick={handleCheckout}
            disabled={isLoading}
          >
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Example 4: Cart Item Component

```tsx
'use client';

import { useCart } from '@/lib/context';
import { CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleRemove = async () => {
    if (confirm('Deseja remover este item do carrinho?')) {
      await removeItem(item.productId);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.product.imageUrl} alt={item.product.name} />
      
      <div className="item-details">
        <h3>{item.product.name}</h3>
        <p className="price">R$ {item.product.price.toFixed(2)}</p>
      </div>

      <div className="quantity-controls">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleDecrease}
          disabled={isLoading || item.quantity <= 1}
        >
          <Minus size={16} />
        </Button>
        <span>{item.quantity}</span>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleIncrease}
          disabled={isLoading}
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="subtotal">
        R$ {item.subtotal.toFixed(2)}
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRemove}
        disabled={isLoading}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
```

## Auth Examples

### Example 5: Login Form

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
      router.push('/perfil');
    } catch (err) {
      // Error is already set in context
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
```

### Example 6: Protected Profile Page

```tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="profile-page">
      <h1>Meu Perfil</h1>
      
      <div className="profile-info">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Telefone:</strong> {user.phone}</p>
        <p><strong>Tipo:</strong> {user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
      </div>

      <Button onClick={handleLogout}>
        Sair
      </Button>
    </div>
  );
}
```

### Example 7: Admin Route Protection

```tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <h1>Gerenciar Produtos</h1>
      {/* Admin content */}
    </div>
  );
}
```

### Example 8: Header with Auth State

```tsx
'use client';

import { useAuth } from '@/lib/context';
import { useCart } from '@/lib/context';
import Link from 'next/link';
import { User, ShoppingCart, LogOut } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="header">
      <Link href="/" className="logo">
        Pdiddy
      </Link>

      <nav>
        <Link href="/carrinho" className="cart-link">
          <ShoppingCart size={24} />
          {cart.itemCount > 0 && (
            <span className="badge">{cart.itemCount}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            <Link href="/perfil">
              <User size={24} />
              <span>{user?.name}</span>
            </Link>
            
            {isAdmin && (
              <Link href="/admin/produtos">
                Admin
              </Link>
            )}
            
            <button onClick={logout}>
              <LogOut size={24} />
            </button>
          </>
        ) : (
          <Link href="/login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
```

### Example 9: Profile Update Form

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ProfileUpdateForm() {
  const { user, updateProfile, isLoading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({ name, phone });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h3>Editar Perfil</h3>

      <Input
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Telefone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
}
```

## Combined Example: Checkout Flow

### Example 10: Checkout Page with Cart and Auth

```tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context';
import { useCart } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { orderService } from '@/lib/services/orderService';

export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, clearCart, isLoading: cartLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleConfirmOrder = async (orderData: any) => {
    try {
      // Create order
      const order = await orderService.create({
        userId: user!.id,
        items: cart.items,
        deliveryAddress: orderData.address,
        paymentMethod: orderData.payment,
        total: cart.total,
      });

      // Clear cart after successful order
      await clearCart();

      // Redirect to success page
      router.push(`/sucesso?orderId=${order.id}`);
    } catch (error) {
      alert('Erro ao criar pedido');
    }
  };

  if (authLoading || cartLoading) {
    return <div>Carregando...</div>;
  }

  if (cart.items.length === 0) {
    router.push('/carrinho');
    return null;
  }

  return (
    <div className="checkout-page">
      <h1>Finalizar Pedido</h1>
      {/* Order form and summary */}
    </div>
  );
}
```

## Tips and Best Practices

1. **Always check loading states** before rendering content that depends on context data
2. **Handle errors gracefully** by displaying user-friendly messages
3. **Use useEffect for redirects** based on auth state to avoid hydration issues
4. **Wrap async operations in try-catch** to handle errors properly
5. **Show loading indicators** during async operations for better UX
6. **Persist cart state** is automatic - no need to manually save to localStorage
7. **Check isAuthenticated** before accessing user-specific features
8. **Use isAdmin** to conditionally render admin-only features
