export interface DeliveryLogRepository {
  logDelivery(payload: any, planId: number, status: 'sent'|'failed', error?: string, recipient?: { id: string; role: string }): Promise<number>;
}
