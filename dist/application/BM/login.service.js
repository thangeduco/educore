"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../../shared/utils");
class LoginService {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(identifier, password) {
        const user = await this.repo.findUserByEmailOrPhone(identifier);
        if (!user) {
            console.warn(`[LoginService] Không tìm thấy người dùng với identifier: ${identifier}`);
            throw new Error('Tài khoản không tồn tại');
        }
        const match = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!match) {
            console.warn(`[LoginService] Mật khẩu sai cho userId: ${user.id}`);
            throw new Error('Mật khẩu không đúng');
        }
        const token = this.generateToken(user.id);
        const expiry = this.getExpiryDate();
        await this.repo.createSession(user.id, token, 'web', expiry);
        return {
            user: (0, utils_1.sanitizeUser)(user),
            access_token: token,
        };
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ sub: userId, scope: 'user' }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
    }
    getExpiryDate() {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 ngày
    }
}
exports.LoginService = LoginService;
