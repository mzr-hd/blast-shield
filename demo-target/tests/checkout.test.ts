import { describe, it, expect, vi } from 'vitest';
import { handleCheckout } from '../src/services/checkout';
import * as paymentApi from '../src/api/payment';

describe('Checkout Service (Legacy Mocks)', () => {
  it('should confirm order when payment is successful', async () => {
    // MOCKING THE LEGACY CONTRACT - hides the bug
    vi.spyOn(paymentApi, 'processPayment').mockResolvedValue({
      status: 'success',
      transactionId: 'TX_MOCK_123'
    });

    const result = await handleCheckout(100);
    expect(result.orderStatus).toBe('confirmed');
  });
});