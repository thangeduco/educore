"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const login_service_1 = require("../../../application/BM/login.service");
const register_service_1 = require("../../../application/BM/register.service");
const logout_service_1 = require("../../../application/BM/logout.service");
const auth_info_service_1 = require("../../../application/BM/auth-info.service");
const pg_auth_repository_1 = require("../../../infrastructure/BM/pg-auth.repository");
// ⚙️ Khởi tạo repository và service
const authRepo = new pg_auth_repository_1.PgAuthRepository();
const loginService = new login_service_1.LoginService(authRepo);
const registerService = new register_service_1.RegisterService(authRepo);
const logoutService = new logout_service_1.LogoutService(authRepo);
const authInfoService = new auth_info_service_1.AuthInfoService(authRepo);
exports.authController = {
    async login(req, res) {
        try {
            const { emailOrPhone, password } = req.body;
            if (!emailOrPhone || !password) {
                return res.status(400).json({ error: 'Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu' });
            }
            const result = await loginService.execute(emailOrPhone, password);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error('[authController][login] ❌ Lỗi:', error);
            return res.status(401).json({ error: error.message || 'Đăng nhập không thành công' });
        }
    },
    async register(req, res) {
        try {
            const result = await registerService.execute(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            console.error('[authController][register] ❌ Lỗi:', error);
            return res.status(400).json({ error: error.message || 'Đăng ký không thành công' });
        }
    },
    async logout(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1]; // Bearer <token>
            if (!token) {
                return res.status(400).json({ error: 'Không tìm thấy token trong header' });
            }
            await logoutService.execute(token);
            return res.status(200).json({ message: 'Đăng xuất thành công' });
        }
        catch (error) {
            console.error('[authController][logout] ❌ Lỗi:', error);
            return res.status(500).json({ error: 'Đăng xuất không thành công' });
        }
    },
    async getUserInfo(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'userId không hợp lệ' });
            }
            const user = await authInfoService.execute(userId);
            return res.status(200).json(user);
        }
        catch (err) {
            console.error('[authController][getUserInfo] ❌ Lỗi:', err);
            return res.status(404).json({ error: err.message || 'Không tìm thấy người dùng' });
        }
    },
    // isFirstLoginToday
    async isFirstLoginToday(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'userId không hợp lệ' });
            }
            const isFirstLogin = true;
            //const isFirstLogin = await authInfoService.isFirstLoginToday(userId);
            return res.status(200).json({ isFirstLogin });
        }
        catch (err) {
            console.error('[authController][isFirstLoginToday] ❌ Lỗi:', err);
            return res.status(500).json({ error: err.message || 'Lỗi kiểm tra đăng nhập lần đầu' });
        }
    }
};
