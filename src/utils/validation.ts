import { z } from 'zod';

const phoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});
const otpSchema = z.object({ otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit code') });
const addressSchema = z.object({
  label: z.string().min(2, 'Add a label'),
  line1: z.string().min(8, 'Enter a complete address'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'Enter a city'),
  postalCode: z.string().regex(/^\d{6}$/, 'Enter a valid PIN code'),
});

export { addressSchema, otpSchema, phoneSchema };
