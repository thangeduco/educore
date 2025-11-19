"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgStyleRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgStyleRepository {
    async resolve(type, ref, version) {
        const r = await db_postgres_1.pool.query('SELECT * FROM im_styles WHERE type=$1 AND name=$2 AND version=$3 AND enabled=true', [type, ref, version]);
        if (!r.rowCount)
            return null;
        const row = r.rows[0];
        return { id: Number(row.id), type: row.type, name: row.name, version: row.version, enabled: row.enabled, styleConfig: row.style_config };
    }
}
exports.PgStyleRepository = PgStyleRepository;
