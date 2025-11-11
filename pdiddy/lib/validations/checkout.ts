import { z } from 'zod';

/**
 * Validation schema for delivery address
 */
export const deliveryAddressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório').max(2, 'Use a sigla do estado (ex: SP)'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido. Use o formato: 12345-678'),
});

/**
 * Validation schema for card payment
 */
export const cardPaymentSchema = z.object({
  cardNumber: z.string()
    .min(1, 'Número do cartão é obrigatório')
    .regex(/^\d{16}$/, 'Número do cartão deve ter 16 dígitos'),
  cardName: z.string().min(1, 'Nome no cartão é obrigatório'),
  cardExpiry: z.string()
    .min(1, 'Validade é obrigatória')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use o formato MM/AA'),
  cardCVV: z.string()
    .min(3, 'CVV deve ter 3 ou 4 dígitos')
    .max(4, 'CVV deve ter 3 ou 4 dígitos')
    .regex(/^\d{3,4}$/, 'CVV deve conter apenas números'),
});

/**
 * Validation schema for payment method
 */
export const paymentMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('credit'),
    cardNumber: z.string().min(1, 'Número do cartão é obrigatório'),
    cardName: z.string().min(1, 'Nome no cartão é obrigatório'),
    cardExpiry: z.string().min(1, 'Validade é obrigatória'),
    cardCVV: z.string().min(1, 'CVV é obrigatório'),
  }),
  z.object({
    type: z.literal('debit'),
    cardNumber: z.string().min(1, 'Número do cartão é obrigatório'),
    cardName: z.string().min(1, 'Nome no cartão é obrigatório'),
    cardExpiry: z.string().min(1, 'Validade é obrigatória'),
    cardCVV: z.string().min(1, 'CVV é obrigatório'),
  }),
  z.object({
    type: z.literal('pix'),
  }),
  z.object({
    type: z.literal('cash'),
  }),
]);

export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
