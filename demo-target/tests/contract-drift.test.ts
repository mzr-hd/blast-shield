import { describe, it, expect, vi } from 'vitest';
import { handleCheckout } from '../src/services/checkout';
import * as paymentApi from '../src/api/payment';

describe('Payment Contract Drift (Staging Environment)', () => {
  it('should handle the new payment gateway response format', async () => {
    // This test hits a mock of the NEW 3rd party API
    vi.spyOn(paymentApi, 'processPayment').mockResolvedValue({
      paymentStatus: 'success', 
      transactionId: 'TX_NEW_456'
    });

    // This will FAIL because handleCheckout looks for `result.status`
    const result = await handleCheckout(100);
    expect(result.orderStatus).toBe('confirmed');
  });
});