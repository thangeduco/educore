import { Request, Response } from 'express';
import { LoginService } from '../../../application/BM/login.service';
import { RegisterService } from '../../../application/BM/register.service';
import { LogoutService } from '../../../application/BM/logout.service';
import { AuthInfoService } from '../../../application/BM/auth-info.service';

import { PgAuthRepository } from '../../../infrastructure/BM/pg-auth.repository';
import { toUSVString } from 'util';


// ⚙️ Khởi tạo repository và service
const authRepo = new PgAuthRepository();
const loginService = new LoginService(authRepo);
const registerService = new RegisterService(authRepo);
const logoutService = new LogoutService(authRepo);
const authInfoService = new AuthInfoService(authRepo);

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { emailOrPhone, password } = req.body;

      if (!emailOrPhone || !password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu' });
      }

      const result = await loginService.execute(emailOrPhone, password);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('[authController][login] ❌ Lỗi:', error);
      return res.status(401).json({ error: error.message || 'Đăng nhập không thành công' });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const result = await registerService.execute(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      console.error('[authController][register] ❌ Lỗi:', error);
      return res.status(400).json({ error: error.message || 'Đăng ký không thành công' });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1]; // Bearer <token>

      if (!token) {
        return res.status(400).json({ error: 'Không tìm thấy token trong header' });
      }

      await logoutService.execute(token);
      return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error: any) {
      console.error('[authController][logout] ❌ Lỗi:', error);
      return res.status(500).json({ error: 'Đăng xuất không thành công' });
    }
  },
  async getUserInfo(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'userId không hợp lệ' });
      }

      const user = await authInfoService.execute(userId);
      return res.status(200).json(user);
    } catch (err: any) {
      console.error('[authController][getUserInfo] ❌ Lỗi:', err);
      return res.status(404).json({ error: err.message || 'Không tìm thấy người dùng' });
    }
  },

  // isFirstLoginToday
  async isFirstLoginToday(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'userId không hợp lệ' });
      }

      const isFirstLogin = true;
      //const isFirstLogin = await authInfoService.isFirstLoginToday(userId);
      return res.status(200).json({ isFirstLogin });
    } catch (err: any) {
      console.error('[authController][isFirstLoginToday] ❌ Lỗi:', err);
      return res.status(500).json({ error: err.message || 'Lỗi kiểm tra đăng nhập lần đầu' });
    }
  }
};
