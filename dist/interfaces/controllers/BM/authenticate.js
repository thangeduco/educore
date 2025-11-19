"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'Thiếu token' });
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.sub;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
exports.authenticate = authenticate;
