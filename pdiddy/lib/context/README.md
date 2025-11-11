# Context API Documentation

This directory contains React Context providers for global state management in the Pdiddy application.

## CartContext

Manages shopping cart state with automatic localStorage persistence.

### Usage

```tsx
import { CartProvider, useCart } from '@/lib/context';

// Wrap your app with CartProvider
function App() {
  return (
    <CartProvider>
      <YourComponents />
    </CartProvider>
  );
}

// Use the cart in any component
function ProductCard({ product }) {
  const { cart, addItem, isLoading } = useCart();
  
  const handleAddToCart = async () => {
    await addItem(product, 1);
  };
  
  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      Adicionar ao Carrinho
    </button>
  );
}
```

### API

#### CartContextValue

- `cart: Cart` - Current cart state with items, total, and itemCount
- `addItem: (product: Product, quantity?: number) => Promise<void>` - Add item to cart
- `removeItem: (productId: string) => Promise<void>` - Remove item from cart
- `updateQuantity: (productId: string, quantity: number) => Promise<void>` - Update item quantity
- `clearCart: () => Promise<void>` - Clear all items from cart
- `isLoading: boolean` - Loading state for async operations
- `error: string | null` - Error message if operation fails

### Features

- ✅ Automatic localStorage persistence
- ✅ Automatic cart recalculation (totals, item count)
- ✅ Loading states for all operations
- ✅ Error handling with user-friendly messages
- ✅ Optimistic updates with rollback on error

## AuthContext

Manages user authentication and profile state.

### Usage

```tsx
import { AuthProvider, useAuth } from '@/lib/context';

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourComponents />
    </AuthProvider>
  );
}

// Use auth in any component
function LoginForm() {
  const { login, isAuthenticated, user, isLoading } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // Redirect to profile or home
    } catch (error) {
      // Handle error
    }
  };
  
  if (isAuthenticated) {
    return <div>Bem-vindo, {user?.name}!</div>;
  }
  
  return <LoginFormUI onSubmit={handleLogin} />;
}
```

### API

#### AuthContextValue

- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Whether user is logged in
- `isAdmin: boolean` - Whether user has admin role
- `login: (credentials: LoginDTO) => Promise<void>` - Login user
- `logout: () => Promise<void>` - Logout user
- `updateProfile: (data: UpdateUserDTO) => Promise<void>` - Update user profile
- `isLoading: boolean` - Loading state for async operations
- `error: string | null` - Error message if operation fails

### Features

- ✅ Persistent authentication across page reloads
- ✅ Role-based access control (customer/admin)
- ✅ Profile management
- ✅ Loading states for all operations
- ✅ Error handling with user-friendly messages

## Combining Providers

When using multiple providers, nest them in your root layout:

```tsx
import { CartProvider, AuthProvider } from '@/lib/context';

export default function RootLayout({ children }) {
  return (
    <html>
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

## Error Handling

Both contexts provide error states. Handle errors in your components:

```tsx
function MyComponent() {
  const { addItem, error } = useCart();
  
  useEffect(() => {
    if (error) {
      // Show toast notification or error message
      console.error('Cart error:', error);
    }
  }, [error]);
  
  // ... rest of component
}
```

## Testing

Example test files are provided in `__tests__/` directory. To run tests, you'll need to install testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/react-hooks @types/jest
```

When testing components that use these contexts, wrap them with the providers:

```tsx
import { render } from '@testing-library/react';
import { CartProvider } from '@/lib/context';

test('component uses cart', () => {
  render(
    <CartProvider>
      <MyComponent />
    </CartProvider>
  );
  
  // ... test assertions
});
```

## Future API Integration

The contexts are designed to work seamlessly when switching from localStorage to API calls. The service layer handles the data operations, so no changes to the contexts will be needed when integrating with a backend API.
