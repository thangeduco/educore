"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgCapsPolicyRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgCapsPolicyRepository {
    async getDefault() {
        const r = await db_postgres_1.pool.query('SELECT * FROM im_caps_policies WHERE enabled=true ORDER BY updated_at DESC LIMIT 1');
        if (!r.rowCount)
            return null;
        const row = r.rows[0];
        return { id: Number(row.id), name: row.name, policy: row.policy, enabled: row.enabled };
    }
    async getById(id) {
        const r = await db_postgres_1.pool.query('SELECT * FROM im_caps_policies WHERE id=$1 AND enabled=true', [id]);
        if (!r.rowCount)
            return null;
        const row = r.rows[0];
        return { id: Number(row.id), name: row.name, policy: row.policy, enabled: row.enabled };
    }
}
exports.PgCapsPolicyRepository = PgCapsPolicyRepository;
