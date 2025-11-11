import { DeliveryAddress } from './order';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: DeliveryAddress[];
  createdAt: Date;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  phone?: string;
  savedAddresses?: DeliveryAddress[];
}

export interface LoginDTO {
  email: string;
  password: string;
}
