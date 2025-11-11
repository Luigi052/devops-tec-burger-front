'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout';
import { useCart } from '@/lib/context/CartContext';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CarrinhoPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem, isLoading } = useCart();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleRemoveClick = async (productId: string) => {
    setItemToRemove(productId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      await removeItem(itemToRemove);
      setShowRemoveModal(false);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const handleCheckout = () => {
    router.push('/pedido');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <main id="main-content" className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" aria-label="Carregando carrinho" />
          </div>
        </main>
      </CustomerLayout>
    );
  }

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <CustomerLayout>
        <main id="main-content" className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6" aria-hidden="true">
              <ShoppingBag className="w-12 h-12 text-neutral-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-neutral-500 mb-8 text-center max-w-md">
              Adicione produtos ao seu carrinho para continuar com a compra
            </p>
            <Button onClick={handleContinueShopping} size="lg" aria-label="Voltar para a página inicial">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Continuar Comprando
            </Button>
          </div>
        </main>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <main id="main-content" className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Carrinho de Compras
          </h1>
          <p className="text-neutral-600" aria-live="polite">
            {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </header>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <section className="lg:col-span-2 space-y-4" aria-label="Itens do carrinho">
            {cart.items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={handleRemoveClick}
              />
            ))}
          </section>

          {/* Cart Summary */}
          <aside className="lg:col-span-1" aria-label="Resumo do pedido">
            <CartSummary subtotal={cart.total} total={cart.total} />
            
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
                aria-label="Ir para finalizar pedido"
              >
                Finalizar Pedido
              </Button>
              <Button
                onClick={handleContinueShopping}
                variant="outline"
                size="lg"
                className="w-full"
                aria-label="Voltar para continuar comprando"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                Continuar Comprando
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={showRemoveModal}
        onClose={handleCancelRemove}
        title="Remover item do carrinho"
        size="sm"
      >
        <p className="text-neutral-700 mb-6">
          Tem certeza que deseja remover este item do carrinho?
        </p>
        <ModalFooter>
          <Button variant="outline" onClick={handleCancelRemove}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmRemove}>
            Remover
          </Button>
        </ModalFooter>
      </Modal>
    </CustomerLayout>
  );
}
