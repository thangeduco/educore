"use strict";
// src/interfaces/services/middware.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIp = getClientIp;
/**
 * Lấy IP phía client từ nhiều loại header/proxy khác nhau.
 * Ưu tiên:
 *  - X-Forwarded-For (chuỗi đầu tiên)
 *  - X-Real-IP
 *  - CF-Connecting-IP (Cloudflare)
 *  - req.socket.remoteAddress
 */
function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    let ip;
    if (typeof xForwardedFor === 'string') {
        ip = xForwardedFor.split(',')[0].trim();
    }
    else if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
        ip = xForwardedFor[0];
    }
    const xRealIp = req.headers['x-real-ip'] || undefined;
    const cfConnectingIp = req.headers['cf-connecting-ip'] || undefined;
    const remoteAddr = req.socket?.remoteAddress || undefined;
    return ip || xRealIp || cfConnectingIp || remoteAddr || null;
}
