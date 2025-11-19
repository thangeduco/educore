// IM DTO: ingest event
export interface IngestEventDTO {
  idempotencyKey: string;
  source: string;              // 'learning' | 'system' | ...
  eventType: string;           // 'video.timestamp_reached' | ...
  studentId?: string;
  parentId?: string;
  courseId?: string;
  weekId?: string;
  lessonId?: string;
  videoId?: string;
  payload: Record<string, unknown>;
  occurredAt: string;          // ISO string
  correlationId?: string;
  extraTags?: string[];
}

export interface HandleEventResultDTO {
  eventId: number;
  planId: number | null;
  decisionsCount: number;
  deliveries: Array<{ deliveryId: number; type: string; channel: string; recipientRole: string }>;
}
