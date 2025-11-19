import { InteractionTypeRepository } from '../../../domain/IM/repositories/interaction-type.repository';
import { pool } from '../../common/db-postgres';

export class PgInteractionTypeRepository implements InteractionTypeRepository {
  async getByType(type: string) {
    const r = await pool.query('SELECT * FROM im_interaction_types WHERE type=$1 AND enabled=true', [type]);
    if (!r.rowCount) return null;
    const row = r.rows[0];
    return { type: row.type, schema: row.schema, renderAdapter: row.render_adapter, enabled: row.enabled };
  }
}
