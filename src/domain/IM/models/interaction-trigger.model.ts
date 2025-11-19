export interface InteractionTrigger {
  eventId: number | null;
  idempotencyKey: string;
  source: string;
  eventType: string;
  studentId?: string;
  parentId?: string;
  courseId?: string;
  weekId?: string;
  lessonId?: string;
  videoId?: string;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
  correlationId?: string;
  extraTags?: string[];
}
