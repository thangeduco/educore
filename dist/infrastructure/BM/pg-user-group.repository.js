"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgUserGroupRepository = void 0;
const db_postgres_1 = require("../common/db-postgres");
class PgUserGroupRepository {
    /**
     * Tìm email của phụ huynh từ ID học sinh
     */
    async findParentsEmail(studentId) {
        try {
            const res = await db_postgres_1.pool.query(`SELECT email 
         FROM users 
         WHERE id IN (
           SELECT parent_id FROM users WHERE id = $1
         ) 
         LIMIT 1`, [studentId]);
            const row = res.rows[0];
            return row ? row.email : null;
        }
        catch (error) {
            console.error('[PgUserGroupRepository][findParentsEmail] ❌ Lỗi:', error);
            throw new Error('Không thể lấy email phụ huynh');
        }
    }
    /**
     * Lấy danh sách học sinh của phụ huynh
     */
    async getStudentsByParentId(parentId) {
        try {
            const res = await db_postgres_1.pool.query(`SELECT 
           u.id, 
           u.full_name, 
           p.avatar_image, 
           p.slogen
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.parent_id = $1 AND u.role = 'student'`, [parentId]);
            return res.rows.map((row) => ({
                id: Number(row.id),
                fullName: row.full_name,
                avatarUrl: row.avatar_image || null,
                slogan: row.slogen || '',
            }));
        }
        catch (error) {
            console.error('[PgUserGroupRepository][getStudentsByParentId] ❌ Lỗi:', error);
            throw new Error('Không thể lấy danh sách học sinh');
        }
    }
}
exports.PgUserGroupRepository = PgUserGroupRepository;
