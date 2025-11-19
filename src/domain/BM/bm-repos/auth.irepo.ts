import { User } from '../bm-models/user.model';

export interface AuthRepository {
  /**
   * Tìm user theo email hoặc số điện thoại
   * @param identifier Email hoặc số điện thoại
   */
  findUserByEmailOrPhone(identifier: string): Promise<User | null>;

  /**
   * Tìm user theo ID
   * @param userId ID người dùng
   */
  getUserById(userId: number): Promise<User | null>;

  /**
   * Tạo mới một user (bao gồm profile nếu có)
   * @param user Thông tin user cần tạo
   */
  createUser(user: Partial<User>): Promise<User>;

  /**
   * Tạo mới session khi đăng nhập thành công
   * @param userId ID người dùng
   * @param token Access token
   * @param device Thiết bị (web/mobile...)
   * @param expiredAt Ngày hết hạn token (ISO)
   */
  createSession(userId: number, token: string, device: string, expiredAt: string): Promise<void>;

  /**
   * Xoá session khi logout
   * @param token Access token
   */
  deleteSessionByToken(token: string): Promise<void>;

}
