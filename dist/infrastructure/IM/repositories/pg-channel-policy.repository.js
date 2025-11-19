"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgChannelPolicyRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgChannelPolicyRepository {
    async getDefault() {
        const r = await db_postgres_1.pool.query('SELECT * FROM im_channel_policies WHERE enabled=true ORDER BY updated_at DESC LIMIT 1');
        if (!r.rowCount)
            return null;
        const row = r.rows[0];
        return { id: Number(row.id), name: row.name, config: row.config, enabled: row.enabled };
    }
}
exports.PgChannelPolicyRepository = PgChannelPolicyRepository;
