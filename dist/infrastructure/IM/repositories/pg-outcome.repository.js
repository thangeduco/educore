"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgOutcomeRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgOutcomeRepository {
    async createOutcome(deliveryId, status, metrics, occurredAt) {
        await db_postgres_1.pool.query('INSERT INTO im_outcomes (delivery_id, status, metrics, occurred_at) VALUES ($1,$2,$3,$4)', [deliveryId, status, metrics ?? {}, occurredAt ?? new Date()]);
    }
}
exports.PgOutcomeRepository = PgOutcomeRepository;
