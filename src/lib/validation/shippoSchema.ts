// lib/validation/shippoShema
import { z } from 'zod';

export const AddressSchema = z.object({
  name: z.string(),
  street1: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
  phone: z.string().optional().nullable(), // Rendez-les optionnels
  email: z.string().email().optional().nullable(),
  company: z.string().optional(),
});

export const ParcelSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  distance_unit: z.enum(['cm', 'in']).default('cm'),
  weight: z.number().positive(),
  mass_unit: z.enum(['kg', 'lb', 'g', 'oz']).default('kg'),
});

export const GetRatesSchema = z.object({
  from: AddressSchema,
  to: AddressSchema,
  parcels: z.array(ParcelSchema).min(1),
});