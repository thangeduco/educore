export interface InteractionPlanRepository {
  createPlan(eventId: number, studentId: string | null, decisions: unknown, status: string): Promise<number>;
}
