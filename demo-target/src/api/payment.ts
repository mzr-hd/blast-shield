// Simulating the external 3rd party API that silently changed its contract
export async function processPayment(amount: number): Promise<unknown> {
  if (amount <= 0) throw new Error('Invalid amount');
  
  // DRIFT: The API silently updated from 'status' to 'paymentStatus'
  return {
    paymentStatus: 'success',
    transactionId: `TX_${Math.floor(Math.random() * 10000)}`
  };
}