import { DeliveryLogRepository } from '../../../domain/IM/repositories/delivery-log.repository';
import { pool } from '../../common/db-postgres';

export class PgDeliveryLogRepository implements DeliveryLogRepository {
  async logDelivery(payload: any, planId: number, status: 'sent'|'failed', error?: string, recipient?: { id: string; role: string }): Promise<number> {
    const sql = `INSERT INTO im_delivery_logs (plan_id, type, channel, student_id, payload, delivered_at, delivery_status, last_error, recipient_id, recipient_role)
                 VALUES ($1,$2,$3,$4,$5,now(),$6,$7,$8,$9) RETURNING id`;
    const studentId = (recipient?.role === 'student') ? recipient?.id : (payload?.recipient?.role === 'student' ? payload.recipient.id : '');
    const vals = [planId, payload.type, payload.channel, studentId, payload, status, error ?? null, recipient?.id ?? payload?.recipient?.id ?? '', recipient?.role ?? payload?.recipient?.role ?? 'student'];
    const r = await pool.query(sql, vals);
    return Number(r.rows[0].id);
  }
}
