'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DeliveryAddress } from '@/lib/types/order';

interface DeliveryAddressFormProps {
  address: DeliveryAddress;
  onChange: (address: DeliveryAddress) => void;
  errors?: Partial<Record<keyof DeliveryAddress, string>>;
}

export function DeliveryAddressForm({ address, onChange, errors = {} }: DeliveryAddressFormProps) {
  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    onChange({
      ...address,
      [field]: value,
    });
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    handleChange('zipCode', formatted);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* CEP */}
          <div>
            <Input
              label="CEP"
              placeholder="12345-678"
              value={address.zipCode}
              onChange={handleCEPChange}
              error={errors.zipCode}
              maxLength={9}
              required
            />
          </div>

          {/* Street and Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Rua"
                placeholder="Nome da rua"
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                error={errors.street}
                required
              />
            </div>
            <div>
              <Input
                label="Número"
                placeholder="123"
                value={address.number}
                onChange={(e) => handleChange('number', e.target.value)}
                error={errors.number}
                required
              />
            </div>
          </div>

          {/* Complement and Neighborhood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Complemento"
                placeholder="Apto, bloco, etc. (opcional)"
                value={address.complement || ''}
                onChange={(e) => handleChange('complement', e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Bairro"
                placeholder="Nome do bairro"
                value={address.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                error={errors.neighborhood}
                required
              />
            </div>
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Cidade"
                placeholder="Nome da cidade"
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
                error={errors.city}
                required
              />
            </div>
            <div>
              <Input
                label="Estado"
                placeholder="SP"
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                error={errors.state}
                maxLength={2}
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
