import { addressSchema, otpSchema, phoneSchema } from '@/utils/validation';

describe('validation schemas', () => {
  it('accepts the documented demo credentials', () => {
    expect(phoneSchema.safeParse({ phone: '9876543210' }).success).toBe(true);
    expect(otpSchema.safeParse({ otp: '123456' }).success).toBe(true);
  });

  it('rejects incomplete addresses', () => {
    const result = addressSchema.safeParse({
      label: 'H',
      line1: 'Short',
      city: '',
      postalCode: '123',
    });

    expect(result.success).toBe(false);
  });
});
