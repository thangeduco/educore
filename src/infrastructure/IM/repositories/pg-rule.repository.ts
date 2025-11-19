import { RuleRepository } from '../../../domain/IM/repositories/rule.repository';
import { Rule } from '../../../domain/IM/models/rule.model';
import { pool } from '../../common/db-postgres';

export class PgRuleRepository implements RuleRepository {
  async listActiveByEventType(eventType: string, at: Date): Promise<Rule[]> {
    const sql = `SELECT * FROM im_rules
      WHERE enabled = true
        AND $1 = ANY(trigger_event_types)
        AND (valid_from IS NULL OR valid_from <= $2)
        AND (valid_to   IS NULL OR valid_to   >= $2)`;
    const r = await pool.query(sql, [eventType, at]);
    return r.rows.map((row: any) => ({
      id: Number(row.id),
      name: row.name,
      version: row.version,
      enabled: row.enabled,
      triggerEventTypes: row.trigger_event_types,
      priority: row.priority,
      conditions: row.conditions,
      actions: row.actions,
      channels: row.channels,
      capsPolicyId: row.caps_policy_id,
      validFrom: row.valid_from,
      validTo: row.valid_to
    }));
  }
}
