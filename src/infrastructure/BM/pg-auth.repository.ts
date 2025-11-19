import { pool } from '../common/db-postgres';
import { AuthRepository } from '../../domain/BM/bm-repos/auth.irepo';
import { User } from '../../domain/BM/bm-models/user.model';

export class PgAuthRepository implements AuthRepository {
  async findUserByEmailOrPhone(identifier: string): Promise<User | null> {

    const res = await pool.query(
      `SELECT 
        u.*, 
        p.avatar_image, 
        p.grade, 
        p.gender, 
        p.dob,
        p.slogen
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.email = $1 OR u.phone = $1
      LIMIT 1`,
      [identifier]
    );

    const row = res.rows[0];
    if (!row) return null;

    return this.mapUserWithProfile(row);
  }

  async getUserById(userId: number): Promise<User | null> {
    const res = await pool.query(
      `SELECT 
        u.*, 
        p.avatar_image, 
        p.grade, 
        p.gender, 
        p.dob,
        p.slogen
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
      LIMIT 1`,
      [userId]
    );

    const row = res.rows[0];
    if (!row) return null;

    return this.mapUserWithProfile(row);
  }

  async createUser(user: Partial<User>): Promise<User> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const res = await client.query(
        `INSERT INTO users (full_name, email, phone, password_hash, role, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [
          user.fullName,
          user.email ?? null,
          user.phone ?? null,
          user.passwordHash,
          user.role ?? 'user',
          user.status ?? 'active',
        ]
      );

      const row = res.rows[0];
      const userId = row.id;

      const {
        avatarImage = null,
        grade = null,
        gender = null,
        dob = null,
        slogen = null,
      } = user.profile ?? {};

      await client.query(
        `INSERT INTO profiles (user_id, avatar_image, grade, gender, dob, slogen)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, avatarImage, grade, gender, dob, slogen]
      );

      await client.query('COMMIT');

      return this.mapUserWithProfile({ ...row, avatar_image: avatarImage, grade, gender, dob, slogen });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[PgAuthRepository][createUser] ❌ Lỗi khi tạo user:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async createSession(userId: number, token: string, device: string, expiredAt: string): Promise<void> {
    await pool.query(
      `INSERT INTO sessions (user_id, token, device, expired_at, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [userId, token, device, expiredAt]
    );
  }

  async deleteSessionByToken(token: string): Promise<void> {
    await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
  }

  // 🧩 Map từ DB row → domain model
  private mapUserWithProfile(row: any): User {
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
