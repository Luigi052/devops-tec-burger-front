# Pdiddy Library

This directory contains the core business logic, services, and utilities for the Pdiddy application.

## Structure

```
lib/
├── constants/       # Application constants (theme, config)
├── services/        # Service layer for data operations
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Services

The service layer provides an abstraction for data operations, currently using localStorage but prepared for future API integration.

### Product Service

Manages product catalog operations:
- `getAll()` - Get all products
- `getById(id)` - Get product by ID
- `getByCategory(category)` - Filter products by category
- `search(query)` - Search products by name/description
- `create(data)` - Create new product (admin)
- `update(id, data)` - Update product (admin)
- `delete(id)` - Delete product (admin)
- `getCategories()` - Get all unique categories

### Cart Service

Manages shopping cart operations:
- `getCart()` - Get current cart
- `addItem(product, quantity)` - Add item to cart
- `removeItem(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear all items from cart

### Order Service

Manages order operations:
- `create(data)` - Create new order
- `getAll()` - Get all orders
- `getByUserId(userId)` - Get orders for specific user
- `getById(id)` - Get order by ID
- `updateStatus(id, status)` - Update order status
- `cancel(id)` - Cancel order

### User Service

Manages user profile and authentication:
- `getCurrentUser()` - Get current authenticated user
- `login(credentials)` - Login user (mock)
- `logout()` - Logout user
- `isAuthenticated()` - Check if user is authenticated
- `isAdmin()` - Check if user is admin
- `updateProfile(data)` - Update user profile
- `getById(id)` - Get user by ID

## Storage

The `storage` utility provides localStorage operations:
- `get<T>(key)` - Get item from localStorage
- `set<T>(key, value)` - Set item in localStorage
- `remove(key)` - Remove item from localStorage
- `clear()` - Clear all items from localStorage

## Mock Data

Mock data generators are available in `utils/mockData.ts`:
- `mockProducts` - Sample product data
- `mockUsers` - Sample user data
- `mockOrders` - Sample order data
- `generateId()` - Generate unique IDs

## Environment Variables

Configure the application behavior using environment variables in `.env.local`:

```env
# Set to 'true' to use mock data (localStorage)
# Set to 'false' to use real API endpoints
NEXT_PUBLIC_USE_MOCK=true

# API URL for future integration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Future API Integration

The service layer is designed for easy migration to API endpoints:

1. Create API service implementations (e.g., `apiProductService.ts`)
2. Update service exports to switch based on `USE_MOCK` flag
3. Set `NEXT_PUBLIC_USE_MOCK=false` in environment
4. No changes needed in components using the services

Example:
```typescript
// lib/services/index.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const productService = USE_MOCK 
  ? mockProductService 
  : apiProductService;
```
