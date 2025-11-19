// src/interfaces/routes/identity.routes.routes.ts
// API for the usecase of identification
import { Router } from 'express';
import { authController } from '../controllers/BM/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/:userId/info', authController.getUserInfo);

// thêm api kiểm tra xem có phải học sinh đăng nhập lần đầu trong ngày hay không
router.get('/:userId/first-login-today', authController.isFirstLoginToday);

export default router;