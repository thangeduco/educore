import { InteractionPlanRepository } from '../../../domain/IM/repositories/interaction-plan.repository';
import { pool } from '../../common/db-postgres';

export class PgInteractionPlanRepository implements InteractionPlanRepository {
  async createPlan(eventId: number, studentId: string | null, decisions: unknown, status: string): Promise<number> {
    const r = await pool.query(
      'INSERT INTO im_interaction_plans (event_id, student_id, status, decisions, created_at) VALUES ($1,$2,$3,$4,now()) RETURNING id',
      [eventId, studentId, status, decisions]
    );
    return Number(r.rows[0].id);
  }
}
