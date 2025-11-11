import { CartItem } from './cart';

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: 'credit' | 'debit' | 'pix' | 'cash';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface CreateOrderDTO {
  userId: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  total: number;
}
