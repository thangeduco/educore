import { CapsPolicyRepository } from '../../../domain/IM/repositories/caps-policy.repository';
import { pool } from '../../common/db-postgres';

export class PgCapsPolicyRepository implements CapsPolicyRepository {
  async getDefault() {
    const r = await pool.query('SELECT * FROM im_caps_policies WHERE enabled=true ORDER BY updated_at DESC LIMIT 1');
    if (!r.rowCount) return null;
    const row = r.rows[0];
    return { id: Number(row.id), name: row.name, policy: row.policy, enabled: row.enabled };
  }
  async getById(id: number) {
    const r = await pool.query('SELECT * FROM im_caps_policies WHERE id=$1 AND enabled=true', [id]);
    if (!r.rowCount) return null;
    const row = r.rows[0];
    return { id: Number(row.id), name: row.name, policy: row.policy, enabled: row.enabled };
  }
}
