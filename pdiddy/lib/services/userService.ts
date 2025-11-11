import { User, UpdateUserDTO, LoginDTO } from '../types/user';
import { storage } from '../utils/storage';
import { mockUsers } from '../utils/mockData';
import { ServiceError } from '../errors/ServiceError';

const STORAGE_KEY = 'pdiddy_users';
const CURRENT_USER_KEY = 'pdiddy_current_user';

/**
 * User Service - Operations for user profile and authentication
 */
class UserService {
  /**
   * Initialize users in localStorage if not exists
   */
  private initializeUsers(): void {
    try {
      const existing = storage.get<User[]>(STORAGE_KEY);
      if (!existing) {
        storage.set(STORAGE_KEY, mockUsers);
      }
    } catch (error) {
      throw ServiceError.serverError('Erro ao inicializar usuários.');
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userId = storage.get<string>(CURRENT_USER_KEY);
      if (!userId) {
        return null;
      }

      this.initializeUsers();
      const users = storage.get<User[]>(STORAGE_KEY) || [];
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        return null;
      }

      // Convert date strings back to Date objects
      return {
        ...user,
        createdAt: new Date(user.createdAt),
      };
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Login user (mock authentication)
   */
  async login(credentials: LoginDTO): Promise<User> {
    try {
      if (!credentials.email) {
        throw ServiceError.validationError('Email é obrigatório.');
      }

      if (!credentials.password) {
        throw ServiceError.validationError('Senha é obrigatória.');
      }

      this.initializeUsers();
      const users = storage.get<User[]>(STORAGE_KEY) || [];
      
      // Mock authentication - in real app, this would validate against backend
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        throw ServiceError.unauthorized('Email ou senha incorretos.');
      }

      // Store current user ID
      storage.set(CURRENT_USER_KEY, user.id);

      return {
        ...user,
        createdAt: new Date(user.createdAt),
      };
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      storage.remove(CURRENT_USER_KEY);
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if current user is admin
   */
  async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserDTO): Promise<User> {
    try {
      const currentUser = await this.getCurrentUser();
      
      if (!currentUser) {
        throw ServiceError.unauthorized('Usuário não autenticado.');
      }

      // Validate email format if provided
      if (data.email && !this.isValidEmail(data.email)) {
        throw ServiceError.validationError('Email inválido.');
      }

      this.initializeUsers();
      const users = storage.get<User[]>(STORAGE_KEY) || [];
      const index = users.findIndex(u => u.id === currentUser.id);

      if (index === -1) {
        throw ServiceError.notFound('Usuário não encontrado.');
      }

      const updatedUser: User = {
        ...users[index],
        ...data,
      };

      users[index] = updatedUser;
      storage.set(STORAGE_KEY, users);

      return updatedUser;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    try {
      this.initializeUsers();
      const users = storage.get<User[]>(STORAGE_KEY) || [];
      const user = users.find(u => u.id === id);
      
      if (!user) {
        throw ServiceError.notFound('Usuário não encontrado.');
      }

      return {
        ...user,
        createdAt: new Date(user.createdAt),
      };
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const userService = new UserService();
