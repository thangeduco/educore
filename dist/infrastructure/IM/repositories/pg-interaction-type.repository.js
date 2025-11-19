"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgInteractionTypeRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgInteractionTypeRepository {
    async getByType(type) {
        const r = await db_postgres_1.pool.query('SELECT * FROM im_interaction_types WHERE type=$1 AND enabled=true', [type]);
        if (!r.rowCount)
            return null;
        const row = r.rows[0];
        return { type: row.type, schema: row.schema, renderAdapter: row.render_adapter, enabled: row.enabled };
    }
}
exports.PgInteractionTypeRepository = PgInteractionTypeRepository;
