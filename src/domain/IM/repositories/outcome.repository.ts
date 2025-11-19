export interface OutcomeRepository {
  createOutcome(deliveryId: number, status: string, metrics?: unknown, occurredAt?: Date): Promise<void>;
}
