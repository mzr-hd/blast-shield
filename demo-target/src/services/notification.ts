export async function sendReceipt(transactionId: string): Promise<boolean> {
  console.log(`[Notification] Receipt sent for TX: ${transactionId}`);
  return true;
}