import { AuthRepository } from '../../domain/BM/bm-repos/auth.irepo';

export class LogoutService {
  constructor(private repo: AuthRepository) {}

  async execute(token: string): Promise<void> {
    if (!token) {
      console.warn('[LogoutService] Token không hợp lệ');
      throw new Error('Token là bắt buộc');
    }

    await this.repo.deleteSessionByToken(token);
  }
}
