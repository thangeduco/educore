"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgAuthRepository = void 0;
const db_postgres_1 = require("../common/db-postgres");
class PgAuthRepository {
    async findUserByEmailOrPhone(identifier) {
        const res = await db_postgres_1.pool.query(`SELECT 
        u.*, 
        p.avatar_image, 
        p.grade, 
        p.gender, 
        p.dob,
        p.slogen
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = $1 OR u.phone = $1
      LIMIT 1`, [identifier]);
        const row = res.rows[0];
        if (!row)
            return null;
        return this.mapUserWithProfile(row);
    }
    async getUserById(userId) {
        const res = await db_postgres_1.pool.query(`SELECT 
        u.*, 
        p.avatar_image, 
        p.grade, 
        p.gender, 
        p.dob,
        p.slogen
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
      LIMIT 1`, [userId]);
        const row = res.rows[0];
        if (!row)
            return null;
        return this.mapUserWithProfile(row);
    }
    async createUser(user) {
        const client = await db_postgres_1.pool.connect();
        try {
            await client.query('BEGIN');
            const res = await client.query(`INSERT INTO users (full_name, email, phone, password_hash, role, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`, [
                user.fullName,
                user.email ?? null,
                user.phone ?? null,
                user.passwordHash,
                user.role ?? 'user',
                user.status ?? 'active',
            ]);
            const row = res.rows[0];
            const userId = row.id;
            const { avatarImage = null, grade = null, gender = null, dob = null, slogen = null, } = user.profile ?? {};
            await client.query(`INSERT INTO profiles (user_id, avatar_image, grade, gender, dob, slogen)
         VALUES ($1, $2, $3, $4, $5, $6)`, [userId, avatarImage, grade, gender, dob, slogen]);
            await client.query('COMMIT');
            return this.mapUserWithProfile({ ...row, avatar_image: avatarImage, grade, gender, dob, slogen });
        }
        catch (err) {
            await client.query('ROLLBACK');
            console.error('[PgAuthRepository][createUser] ❌ Lỗi khi tạo user:', err);
            throw err;
        }
        finally {
            client.release();
        }
    }
    async createSession(userId, token, device, expiredAt) {
        await db_postgres_1.pool.query(`INSERT INTO sessions (user_id, token, device, expired_at, created_at)
       VALUES ($1, $2, $3, $4, NOW())`, [userId, token, device, expiredAt]);
    }
    async deleteSessionByToken(token) {
        await db_postgres_1.pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    }
    // 🧩 Map từ DB row → domain model
    mapUserWithProfile(row) {
        return {
            id: row.id,
            fullName: row.full_name,
            email: row.email,
            phone: row.phone,
            passwordHash: row.password_hash,
            status: row.status,
            role: row.role,
            createdAt: row.created_at instanceof Date
                ? row.created_at.toISOString()
                : new Date(row.created_at).toISOString(),
            profile: {
                avatarImage: row.avatar_image ?? undefined,
                grade: row.grade ?? undefined,
                gender: row.gender ?? undefined,
                dob: row.dob ? new Date(row.dob).toISOString().split('T')[0] : undefined,
                slogen: row.slogen ?? undefined,
            },
        };
    }
}
exports.PgAuthRepository = PgAuthRepository;
