import { AuthRepository } from '../../domain/BM/bm-repos/auth.irepo';
import { PublicUser} from '../dtos/public-user.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sanitizeUser } from '../../shared/utils';

export class LoginService {
  constructor(private repo: AuthRepository) { }

  async execute(
    identifier: string,
    password: string
  ): Promise<{ user: PublicUser; access_token: string }> {

    const user = await this.repo.findUserByEmailOrPhone(identifier);
    if (!user) {
      console.warn(`[LoginService] Không tìm thấy người dùng với identifier: ${identifier}`);
      throw new Error('Tài khoản không tồn tại');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.warn(`[LoginService] Mật khẩu sai cho userId: ${user.id}`);
      throw new Error('Mật khẩu không đúng');
    }

    const token = this.generateToken(user.id);
    const expiry = this.getExpiryDate();
    await this.repo.createSession(user.id, token, 'web', expiry);

    return {
      user: sanitizeUser(user),
      access_token: token,
    };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ sub: userId, scope: 'user' }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
  }

  private getExpiryDate(): string {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 ngày
  }
}
