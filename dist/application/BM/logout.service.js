"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutService = void 0;
class LogoutService {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(token) {
        if (!token) {
            console.warn('[LogoutService] Token không hợp lệ');
            throw new Error('Token là bắt buộc');
        }
        await this.repo.deleteSessionByToken(token);
    }
}
exports.LogoutService = LogoutService;
