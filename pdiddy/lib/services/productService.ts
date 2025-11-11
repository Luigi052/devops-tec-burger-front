import { Product, CreateProductDTO, UpdateProductDTO } from '../types/product';
import { storage } from '../utils/storage';
import { mockProducts, generateId } from '../utils/mockData';
import { ServiceError } from '../errors/ServiceError';

const STORAGE_KEY = 'pdiddy_products';

/**
 * Product Service - CRUD operations using localStorage
 */
class ProductService {
  /**
   * Initialize products in localStorage if not exists
   */
  private initializeProducts(): void {
    try {
      const existing = storage.get<Product[]>(STORAGE_KEY);
      if (!existing) {
        storage.set(STORAGE_KEY, mockProducts);
      }
    } catch (error) {
      throw ServiceError.serverError('Erro ao inicializar produtos.');
    }
  }

  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    try {
      this.initializeProducts();
      const products = storage.get<Product[]>(STORAGE_KEY) || [];
      
      // Convert date strings back to Date objects
      return products.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product> {
    try {
      const products = await this.getAll();
      const product = products.find(p => p.id === id);
      
      if (!product) {
        throw ServiceError.notFound('Produto não encontrado.');
      }
      
      return product;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get products by category
   */
  async getByCategory(category: string): Promise<Product[]> {
    try {
      const products = await this.getAll();
      return products.filter(p => p.category === category);
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Search products by name
   */
  async search(query: string): Promise<Product[]> {
    try {
      const products = await this.getAll();
      const lowerQuery = query.toLowerCase();
      return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Create a new product
   */
  async create(data: CreateProductDTO): Promise<Product> {
    try {
      // Validate required fields
      if (!data.name || !data.price || !data.category) {
        throw ServiceError.validationError('Nome, preço e categoria são obrigatórios.');
      }

      if (data.price <= 0) {
        throw ServiceError.validationError('Preço deve ser maior que zero.');
      }

      const products = await this.getAll();
      
      const newProduct: Product = {
        id: generateId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      products.push(newProduct);
      storage.set(STORAGE_KEY, products);
      
      return newProduct;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Update a product
   */
  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    try {
      const products = await this.getAll();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw ServiceError.notFound('Produto não encontrado.');
      }

      // Validate price if provided
      if (data.price !== undefined && data.price <= 0) {
        throw ServiceError.validationError('Preço deve ser maior que zero.');
      }

      const updatedProduct: Product = {
        ...products[index],
        ...data,
        updatedAt: new Date(),
      };

      products[index] = updatedProduct;
      storage.set(STORAGE_KEY, products);
      
      return updatedProduct;
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Delete a product
   */
  async delete(id: string): Promise<void> {
    try {
      const products = await this.getAll();
      const filteredProducts = products.filter(p => p.id !== id);
      
      if (filteredProducts.length === products.length) {
        throw ServiceError.notFound('Produto não encontrado.');
      }

      storage.set(STORAGE_KEY, filteredProducts);
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const products = await this.getAll();
      const categories = new Set(products.map(p => p.category));
      return Array.from(categories).sort();
    } catch (error) {
      throw ServiceError.fromError(error);
    }
  }
}

export const productService = new ProductService();
