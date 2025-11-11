'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PaymentMethod } from '@/lib/types/order';

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod;
  onChange: (paymentMethod: PaymentMethod) => void;
  errors?: Partial<Record<keyof PaymentMethod, string>>;
}

export function PaymentMethodSelector({ paymentMethod, onChange, errors = {} }: PaymentMethodSelectorProps) {
  const handleTypeChange = (type: PaymentMethod['type']) => {
    onChange({
      type,
      ...(type === 'credit' || type === 'debit' ? {
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCVV: '',
      } : {}),
    });
  };

  const handleCardFieldChange = (field: string, value: string) => {
    onChange({
      ...paymentMethod,
      [field]: value,
    });
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 16);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    }
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  const showCardFields = paymentMethod.type === 'credit' || paymentMethod.type === 'debit';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Payment Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('credit')}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${paymentMethod.type === 'credit'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-300 hover:border-neutral-400'
                }
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💳</div>
                <div className="text-sm font-medium">Crédito</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('debit')}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${paymentMethod.type === 'debit'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-300 hover:border-neutral-400'
                }
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💳</div>
                <div className="text-sm font-medium">Débito</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('pix')}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${paymentMethod.type === 'pix'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-300 hover:border-neutral-400'
                }
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-sm font-medium">PIX</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('cash')}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${paymentMethod.type === 'cash'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-300 hover:border-neutral-400'
                }
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💵</div>
                <div className="text-sm font-medium">Dinheiro</div>
              </div>
            </button>
          </div>

          {/* Card Payment Fields */}
          {showCardFields && (
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div>
                <Input
                  label="Número do Cartão"
                  placeholder="1234 5678 9012 3456"
                  value={paymentMethod.cardNumber || ''}
                  onChange={(e) => handleCardFieldChange('cardNumber', formatCardNumber(e.target.value))}
                  error={errors.cardNumber}
                  maxLength={16}
                  required
                />
              </div>

              <div>
                <Input
                  label="Nome no Cartão"
                  placeholder="Nome como está no cartão"
                  value={paymentMethod.cardName || ''}
                  onChange={(e) => handleCardFieldChange('cardName', e.target.value.toUpperCase())}
                  error={errors.cardName}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Validade"
                    placeholder="MM/AA"
                    value={paymentMethod.cardExpiry || ''}
                    onChange={(e) => handleCardFieldChange('cardExpiry', formatExpiry(e.target.value))}
                    error={errors.cardExpiry}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="CVV"
                    placeholder="123"
                    value={paymentMethod.cardCVV || ''}
                    onChange={(e) => handleCardFieldChange('cardCVV', formatCVV(e.target.value))}
                    error={errors.cardCVV}
                    maxLength={4}
                    type="password"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* PIX Instructions */}
          {paymentMethod.type === 'pix' && (
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-primary-800">
                Após confirmar o pedido, você receberá o código PIX para pagamento.
              </p>
            </div>
          )}

          {/* Cash Instructions */}
          {paymentMethod.type === 'cash' && (
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-sm text-primary-800">
                O pagamento será feito na entrega. Tenha o valor exato ou troco disponível.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
