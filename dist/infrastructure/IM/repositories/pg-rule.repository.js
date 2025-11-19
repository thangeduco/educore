"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRuleRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgRuleRepository {
    async listActiveByEventType(eventType, at) {
        const sql = `SELECT * FROM im_rules
      WHERE enabled = true
        AND $1 = ANY(trigger_event_types)
        AND (valid_from IS NULL OR valid_from <= $2)
        AND (valid_to   IS NULL OR valid_to   >= $2)`;
        const r = await db_postgres_1.pool.query(sql, [eventType, at]);
        return r.rows.map((row) => ({
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
exports.PgRuleRepository = PgRuleRepository;
