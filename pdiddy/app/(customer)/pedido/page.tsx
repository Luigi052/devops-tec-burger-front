'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { DeliveryAddressForm } from '@/components/order/DeliveryAddressForm';
import { PaymentMethodSelector } from '@/components/order/PaymentMethodSelector';
import { OrderSummary } from '@/components/order/OrderSummary';
import { Button } from '@/components/ui/Button';
import { DeliveryAddress, PaymentMethod } from '@/lib/types/order';
import { deliveryAddressSchema, paymentMethodSchema } from '@/lib/validations/checkout';
import { orderService } from '@/lib/services/orderService';
import { ZodError } from 'zod';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentMethod, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/carrinho');
    }
  }, [cart.items.length, router]);

  const validateForm = (): boolean => {
    let isValid = true;
    setAddressErrors({});
    setPaymentErrors({});
    setGeneralError(null);

    // Validate delivery address
    try {
      deliveryAddressSchema.parse(deliveryAddress);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Partial<Record<keyof DeliveryAddress, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof DeliveryAddress] = err.message;
          }
        });
        setAddressErrors(errors);
        isValid = false;
      }
    }

    // Validate payment method
    try {
      paymentMethodSchema.parse(paymentMethod);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Partial<Record<keyof PaymentMethod, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof PaymentMethod] = err.message;
          }
        });
        setPaymentErrors(errors);
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setGeneralError('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setIsSubmitting(true);
      setGeneralError(null);

      // Create order
      const order = await orderService.create({
        userId: user?.id || 'guest',
        items: cart.items,
        deliveryAddress,
        paymentMethod,
        total: cart.total,
      });

      // Clear cart
      await clearCart();

      // Redirect to success page
      router.push(`/sucesso?orderId=${order.id}`);
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : 'Erro ao criar pedido. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <DeliveryAddressForm
                address={deliveryAddress}
                onChange={setDeliveryAddress}
                errors={addressErrors}
              />

              {/* Payment Method */}
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onChange={setPaymentMethod}
                errors={paymentErrors}
              />

              {/* Error Message */}
              {generalError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{generalError}</p>
                </div>
              )}

              {/* Mobile Submit Button */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Confirmar Pedido
                </Button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <OrderSummary items={cart.items} total={cart.total} />

                {/* Desktop Submit Button */}
                <div className="hidden lg:block">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Confirmar Pedido
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
