"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/interfaces/routes/identity.routes.routes.ts
// API for the usecase of identification
const express_1 = require("express");
const auth_controller_1 = require("../controllers/BM/auth.controller");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authController.login);
router.post('/logout', auth_controller_1.authController.logout);
router.post('/register', auth_controller_1.authController.register);
router.get('/:userId/info', auth_controller_1.authController.getUserInfo);
// thêm api kiểm tra xem có phải học sinh đăng nhập lần đầu trong ngày hay không
router.get('/:userId/first-login-today', auth_controller_1.authController.isFirstLoginToday);
exports.default = router;
