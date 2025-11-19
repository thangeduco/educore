"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgEventRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres"); // dùng DB chung
class PgEventRepository {
    async create(e) {
        const sql = `INSERT INTO im_events
      (idempotency_key, source, event_type, student_id, parent_id, course_id, week_id, lesson_id, video_id, payload, occurred_at, received_at, correlation_id, extra_tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now(),$12,$13) RETURNING id`;
        const vals = [e.idempotencyKey, e.source, e.eventType, e.studentId ?? null, e.parentId ?? null, e.courseId ?? null, e.weekId ?? null, e.lessonId ?? null, e.videoId ?? null, e.payload ?? {}, e.occurredAt ?? new Date(), e.correlationId ?? null, e.extraTags ?? []];
        const r = await db_postgres_1.pool.query(sql, vals);
        return Number(r.rows[0].id);
    }
    async findById(id) {
        const r = await db_postgres_1.pool.query('SELECT * FROM im_events WHERE id=$1', [id]);
        if (r.rowCount === 0)
            return null;
        const row = r.rows[0];
        return {
            eventId: Number(row.id),
            idempotencyKey: row.idempotency_key,
            source: row.source,
            eventType: row.event_type,
            studentId: row.student_id ?? undefined,
            parentId: row.parent_id ?? undefined,
            courseId: row.course_id ?? undefined,
            weekId: row.week_id ?? undefined,
            lessonId: row.lesson_id ?? undefined,
            videoId: row.video_id ?? undefined,
            payload: row.payload ?? {},
            occurredAt: row.occurred_at,
            correlationId: row.correlation_id ?? undefined,
            extraTags: row.extra_tags ?? []
        };
    }
}
exports.PgEventRepository = PgEventRepository;
