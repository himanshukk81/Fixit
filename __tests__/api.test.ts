import { AxiosError } from 'axios';

import { normalizeApiError } from '@/services/api/client';

describe('API error normalization', () => {
  it('marks network failures as retryable', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK');
    expect(normalizeApiError(error)).toMatchObject({
      code: 'ERR_NETWORK',
      retryable: true,
    });
  });
});
