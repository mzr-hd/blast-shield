import { processPayment } from '../api/payment';
import { sendReceipt } from './notification';

export async function handleCheckout(cartTotal: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- intentional: external gateway response is untyped at the boundary; this is the demo scenario
  const result: any = await processPayment(cartTotal);

  // BUG: The API now returns 'paymentStatus', but we still read 'status'
  if (result.status === 'success') {
    await sendReceipt(result.transactionId);
    return { orderStatus: 'confirmed', tx: result.transactionId };
  }

  throw new Error('Payment verification failed');
}