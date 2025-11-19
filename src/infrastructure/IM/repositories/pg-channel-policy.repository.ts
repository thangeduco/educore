import { ChannelPolicyRepository } from '../../../domain/IM/repositories/channel-policy.repository';
import { pool } from '../../common/db-postgres';

export class PgChannelPolicyRepository implements ChannelPolicyRepository {
  async getDefault() {
    const r = await pool.query('SELECT * FROM im_channel_policies WHERE enabled=true ORDER BY updated_at DESC LIMIT 1');
    if (!r.rowCount) return null;
    const row = r.rows[0];
    return { id: Number(row.id), name: row.name, config: row.config, enabled: row.enabled };
  }
}
