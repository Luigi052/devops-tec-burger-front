'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { DeliveryAddress } from '@/lib/types/order';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react';

export const SavedAddresses: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DeliveryAddress>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'CEP inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentAddresses = user.savedAddresses || [];
      let updatedAddresses: DeliveryAddress[];

      if (editingIndex !== null) {
        // Update existing address
        updatedAddresses = [...currentAddresses];
        updatedAddresses[editingIndex] = formData;
      } else {
        // Add new address
        updatedAddresses = [...currentAddresses, formData];
      }

      await updateProfile({ savedAddresses: updatedAddresses });
      
      // Reset form
      setFormData({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      });
      setIsAdding(false);
      setEditingIndex(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar endereço');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const address = user?.savedAddresses[index];
    if (address) {
      setFormData(address);
      setEditingIndex(index);
      setIsAdding(true);
    }
  };

  const handleDelete = async (index: number) => {
    if (!user || !confirm('Deseja realmente remover este endereço?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedAddresses = user.savedAddresses.filter((_, i) => i !== index);
      await updateProfile({ savedAddresses: updatedAddresses });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover endereço');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    });
    setErrors({});
    setError(null);
    setIsAdding(false);
    setEditingIndex(null);
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Endereços Salvos</CardTitle>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={16} />
              Adicionar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {isAdding ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Rua"
                name="street"
                value={formData.street}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.street}
                placeholder="Nome da rua"
              />
              <Input
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.number}
                placeholder="123"
              />
            </div>

            <Input
              label="Complemento (opcional)"
              name="complement"
              value={formData.complement}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Apto, bloco, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.neighborhood}
                placeholder="Nome do bairro"
              />
              <Input
                label="CEP"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.zipCode}
                placeholder="12345-678"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.city}
                placeholder="Nome da cidade"
              />
              <Input
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.state}
                placeholder="SP"
                maxLength={2}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="flex-1"
              >
                {editingIndex !== null ? 'Atualizar' : 'Adicionar'} Endereço
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {user.savedAddresses.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <MapPin size={48} className="mx-auto mb-3 text-neutral-300" />
                <p>Nenhum endereço salvo</p>
                <p className="text-sm mt-1">Adicione um endereço para facilitar seus pedidos</p>
              </div>
            ) : (
              user.savedAddresses.map((address, index) => (
                <div
                  key={index}
                  className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-primary-500" />
                        <span className="font-medium text-neutral-900">
                          {address.street}, {address.number}
                        </span>
                      </div>
                      {address.complement && (
                        <p className="text-sm text-neutral-600 ml-6">{address.complement}</p>
                      )}
                      <p className="text-sm text-neutral-600 ml-6">
                        {address.neighborhood}, {address.city} - {address.state}
                      </p>
                      <p className="text-sm text-neutral-600 ml-6">CEP: {address.zipCode}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        disabled={isLoading}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
