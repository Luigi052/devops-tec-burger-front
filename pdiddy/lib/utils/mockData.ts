import { Product } from '../types/product';
import { User } from '../types/user';
import { Order } from '../types/order';

/**
 * Mock data generators for products, users, and orders
 */

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Pizza clássica com molho de tomate, mussarela e manjericão fresco',
    price: 45.90,
    category: 'Pizza',
    imageUrl: '/images/pizza-margherita.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer 180g, queijo cheddar, alface, tomate e molho especial',
    price: 32.90,
    category: 'Hambúrguer',
    imageUrl: '/images/burger.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Sushi Combo',
    description: '20 peças variadas de sushi e sashimi',
    price: 89.90,
    category: 'Japonês',
    imageUrl: '/images/sushi.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Salada Caesar',
    description: 'Alface romana, croutons, parmesão e molho caesar',
    price: 28.90,
    category: 'Salada',
    imageUrl: '/images/salad.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Açaí 500ml',
    description: 'Açaí puro com granola, banana e mel',
    price: 22.90,
    category: 'Sobremesa',
    imageUrl: '/images/acai.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    name: 'Pasta Carbonara',
    description: 'Massa fresca com molho carbonara, bacon e parmesão',
    price: 38.90,
    category: 'Massa',
    imageUrl: '/images/pasta.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    name: 'Tacos Mexicanos',
    description: 'Trio de tacos com carne, guacamole e pico de gallo',
    price: 35.90,
    category: 'Mexicano',
    imageUrl: '/images/tacos.jpg',
    available: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite 350ml',
    price: 5.90,
    category: 'Bebida',
    imageUrl: '/images/soda.jpg',
    available: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    role: 'customer',
    savedAddresses: [
      {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
    ],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@pdiddy.com',
    phone: '(11) 99999-9999',
    role: 'admin',
    savedAddresses: [],
    createdAt: new Date('2024-01-01'),
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        productId: '1',
        product: mockProducts[0],
        quantity: 2,
        subtotal: 91.80,
      },
      {
        productId: '8',
        product: mockProducts[7],
        quantity: 2,
        subtotal: 11.80,
      },
    ],
    deliveryAddress: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    paymentMethod: {
      type: 'credit',
      cardNumber: '**** **** **** 1234',
      cardName: 'João Silva',
    },
    total: 103.60,
    status: 'delivered',
    createdAt: new Date('2024-01-15'),
  },
];

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
