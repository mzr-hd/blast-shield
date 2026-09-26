import { processPayment } from '../api/payment';
import { sendReceipt } from './notification';

export async function handleCheckout(cartTotal: number) {
  // We cast to 'any' because it's an external, loosely typed API payload
  const result = await processPayment(cartTotal) as any;

  // BUG: The API now returns 'paymentStatus', but we still read 'status'
  if (result.status === 'success') {
    await sendReceipt(result.transactionId);
    return { orderStatus: 'confirmed', tx: result.transactionId };
  }

  throw new Error('Payment verification failed');
}