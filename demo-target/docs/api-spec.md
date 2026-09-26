# Payment Service API Specification

## Endpoint: `processPayment`
Processes credit card transactions through the external payment gateway.

### Parameters
- `amount` (number): Cart total in USD. Must be greater than 0.

### Response Payload Contract (v1)
```json
{
  "status": "success",
  "transactionId": "string"
}