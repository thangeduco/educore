"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../../shared/utils");
class RegisterService {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(input) {
        const existing = await this.repo.findUserByEmailOrPhone(input.email || input.phone);
        if (existing) {
            console.warn(`[RegisterService] Tài khoản đã tồn tại: ${input.email || input.phone}`);
            throw new Error('Tài khoản đã tồn tại');
        }
        const passwordHash = await bcrypt_1.default.hash(input.password, 10);
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
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
}
exports.RegisterService = RegisterService;
