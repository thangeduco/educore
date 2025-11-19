// IM DTO: preview
export interface PreviewEventDTO {
  source: string;
  eventType: string;
  studentId?: string;
  parentId?: string;
  payload: Record<string, unknown>;
  occurredAt?: string; // ISO
}
export interface PreviewResultDTO {
  candidates: Array<{ type: string; channel: string; priority: number; reasons?: string[] }>;
  payloads: Array<{ type: string; channel: string; example: unknown }>;
}
