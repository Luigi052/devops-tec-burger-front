'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/layout';
import { ProductTable, ProductForm } from '@/components/admin';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product, CreateProductDTO } from '@/lib/types/product';
import { productService } from '@/lib/services/productService';
import { Plus, Search } from 'lucide-react';

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load products and categories
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || 
        product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handle create product
  const handleCreateProduct = async (data: CreateProductDTO) => {
    try {
      await productService.create(data);
      await loadProducts();
      await loadCategories();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  // Handle edit product
  const handleEditProduct = async (data: CreateProductDTO) => {
    if (!editingProduct) return;
    
    try {
      await productService.update(editingProduct.id, data);
      await loadProducts();
      await loadCategories();
      setIsFormModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    
    try {
      setIsDeleting(true);
      await productService.delete(deletingProduct.id);
      await loadProducts();
      await loadCategories();
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProduct(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Gerenciamento de Produtos
            </h1>
            <p className="text-neutral-600 mt-1">
              Gerencie o catálogo de produtos da plataforma
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="w-5 h-5" />
            Adicionar Novo Produto
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar produtos por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <div className="text-sm text-neutral-600">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </div>
        )}

        {/* Product Table */}
        <ProductTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          isLoading={isLoading}
        />

        {/* Create/Edit Product Modal */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={closeFormModal}
          title={editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
          size="lg"
        >
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
            onCancel={closeFormModal}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Confirmar Exclusão"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-neutral-700">
              Tem certeza que deseja excluir o produto{' '}
              <strong>{deletingProduct?.name}</strong>?
            </p>
            <p className="text-sm text-neutral-600">
              Esta ação não pode ser desfeita.
            </p>
            <ModalFooter>
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteProduct}
                loading={isDeleting}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir Produto
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
