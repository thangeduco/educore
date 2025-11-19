"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgDeliveryLogRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgDeliveryLogRepository {
    async logDelivery(payload, planId, status, error, recipient) {
        const sql = `INSERT INTO im_delivery_logs (plan_id, type, channel, student_id, payload, delivered_at, delivery_status, last_error, recipient_id, recipient_role)
                 VALUES ($1,$2,$3,$4,$5,now(),$6,$7,$8,$9) RETURNING id`;
        const studentId = (recipient?.role === 'student') ? recipient?.id : (payload?.recipient?.role === 'student' ? payload.recipient.id : '');
        const vals = [planId, payload.type, payload.channel, studentId, payload, status, error ?? null, recipient?.id ?? payload?.recipient?.id ?? '', recipient?.role ?? payload?.recipient?.role ?? 'student'];
        const r = await db_postgres_1.pool.query(sql, vals);
        return Number(r.rows[0].id);
    }
}
exports.PgDeliveryLogRepository = PgDeliveryLogRepository;
