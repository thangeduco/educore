"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgInteractionPlanRepository = void 0;
const db_postgres_1 = require("../../common/db-postgres");
class PgInteractionPlanRepository {
    async createPlan(eventId, studentId, decisions, status) {
        const r = await db_postgres_1.pool.query('INSERT INTO im_interaction_plans (event_id, student_id, status, decisions, created_at) VALUES ($1,$2,$3,$4,now()) RETURNING id', [eventId, studentId, status, decisions]);
        return Number(r.rows[0].id);
    }
}
exports.PgInteractionPlanRepository = PgInteractionPlanRepository;
