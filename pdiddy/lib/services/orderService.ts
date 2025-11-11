import { Order, CreateOrderDTO } from '../types/order';
import { storage } from '../utils/storage';
import { mockOrders, generateId } from '../utils/mockData';
import { ServiceError } from '../errors/ServiceError';

const STORAGE_KEY = 'pdiddy_orders';

/**
 * Order Service - Operations for managing orders
 */
class OrderService {
  /**
   * Initialize orders in localStorage if not exists
   */
  private initializeOrders(): void {
    try {
      const existing = storage.get<Order[]>(STORAGE_KEY);
      if (!existing) {
        storage.set(STORAGE_KEY, mockOrders);
      }
    } catch (error) {
      throw ServiceError.serverError('Erro ao inicializar pedidos.');
    }
  }

  /**
   * Create a new order
   */
  async create(data: CreateOrderDTO): Promise<Order> {
    try {
      // Validate order data
      if (!data.userId) {
        throw ServiceError.validationError('Usuário é obrigatório.');
      }

      if (!data.items || data.items.length === 0) {
        throw ServiceError.validationError('Pedido deve conter pelo menos um item.');
      }

      if (!data.deliveryAddress) {
        throw ServiceError.validationError('Endereço de entrega é obrigatório.');
      }

      if (!data.paymentMethod) {
        throw ServiceError.validationError('Método de pagamento é obrigatório.');
      }

      if (data.total <= 0) {
        throw ServiceError.validationError('Total do pedido deve ser maior que zero.');
      }

      this.initializeOrders();
      const orders = storage.get<Order[]>(STORAGE_KEY) || [];

      const newOrder: Order = {
        id: generateId(),
        ...data,
        status: 'pending',
        createdAt: new Date(),
      };

      orders.push(newOrder);
      storage.set(STORAGE_KEY, orders);

      return newOrder;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    try {
      this.initializeOrders();
      const orders = storage.get<Order[]>(STORAGE_KEY) || [];
      
      // Convert date strings back to Date objects
      return orders.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get orders by user ID
   */
  async getByUserId(userId: string): Promise<Order[]> {
    try {
      const orders = await this.getAll();
      return orders.filter(o => o.userId === userId);
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get order by ID
   */
  async getById(id: string): Promise<Order> {
    try {
      const orders = await this.getAll();
      const order = orders.find(o => o.id === id);
      
      if (!order) {
        throw ServiceError.notFound('Pedido não encontrado.');
      }
      
      return order;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Update order status
   */
  async updateStatus(
    id: string, 
    status: Order['status']
  ): Promise<Order> {
    try {
      const orders = await this.getAll();
      const index = orders.findIndex(o => o.id === id);

      if (index === -1) {
        throw ServiceError.notFound('Pedido não encontrado.');
      }

      orders[index].status = status;
      storage.set(STORAGE_KEY, orders);

      return orders[index];
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Cancel order
   */
  async cancel(id: string): Promise<Order> {
    return this.updateStatus(id, 'cancelled');
  }
}

export const orderService = new OrderService();
