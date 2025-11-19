import { OutcomeRepository } from '../../../domain/IM/repositories/outcome.repository';
import { pool } from '../../common/db-postgres';

export class PgOutcomeRepository implements OutcomeRepository {
  async createOutcome(deliveryId: number, status: string, metrics?: unknown, occurredAt?: Date): Promise<void> {
    await pool.query('INSERT INTO im_outcomes (delivery_id, status, metrics, occurred_at) VALUES ($1,$2,$3,$4)',
      [deliveryId, status, metrics ?? {}, occurredAt ?? new Date()]);
  }
}
