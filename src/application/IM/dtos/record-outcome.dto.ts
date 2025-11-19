// IM DTO: record outcome
export interface RecordOutcomeDTO {
  deliveryId: number;
  status: 'delivered'|'seen'|'closed'|'clicked'|'engaged'|'answered';
  metrics?: Record<string, unknown>;
  occurredAt?: string; // ISO
}
