import { AuthRepository } from '../../domain/BM/bm-repos/auth.irepo';
import { PublicUser } from '../dtos/public-user.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sanitizeUser } from '../../shared/utils';

type RegisterInput = {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
  profile?: {
    avatarImage?: string;
    dob?: string;
    gender?: string;
    grade?: number;
    slogen?: string;
  };
};

export class RegisterService {
  constructor(private repo: AuthRepository) { }

  async execute(input: RegisterInput): Promise<{ user: PublicUser; access_token: string }> {

    const existing = await this.repo.findUserByEmailOrPhone(input.email || input.phone!);
    if (existing) {
      console.warn(`[RegisterService] Tài khoản đã tồn tại: ${input.email || input.phone}`);
      throw new Error('Tài khoản đã tồn tại');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.repo.createUser({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      profile: input.profile,
    });

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
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }
}
