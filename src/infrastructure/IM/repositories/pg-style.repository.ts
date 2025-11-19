import { StyleRepository } from '../../../domain/IM/repositories/style.repository';
import { pool } from '../../common/db-postgres';

export class PgStyleRepository implements StyleRepository {
  async resolve(type: string, ref: string, version: number) {
    const r = await pool.query('SELECT * FROM im_styles WHERE type=$1 AND name=$2 AND version=$3 AND enabled=true', [type, ref, version]);
    if (!r.rowCount) return null;
    const row = r.rows[0];
    return { id: Number(row.id), type: row.type, name: row.name, version: row.version, enabled: row.enabled, styleConfig: row.style_config };
  }
}
