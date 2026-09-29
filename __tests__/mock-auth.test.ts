import { mockAuthService } from '@/services/mockServices';

describe('mock authentication', () => {
  it('accepts any six-digit code in demo mode', async () => {
    await expect(mockAuthService.verifyOtp('9876543210', '654321')).resolves.toMatchObject({
      user: { phone: '+91 9876543210' },
    });
  });
});
