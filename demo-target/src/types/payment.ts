// What the internal system expects based on old documentation
export interface LegacyPaymentResponse {
  status: 'success' | 'failed';
  transactionId: string;
}