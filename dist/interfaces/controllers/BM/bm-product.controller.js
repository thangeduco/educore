"use strict";
// src/interfaces/controllers/BM/bm-product.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.bmProductController = void 0;
const bm_pg_product_repository_1 = require("../../../infrastructure/BM/bm-pg-product.repository");
const bm_product_uc_1 = require("../../../application/BM/use-cases/bm-product-service/bm-product.uc");
// Khởi tạo repository & use case
const productRepo = new bm_pg_product_repository_1.BMPgProductRepository();
const productUC = new bm_product_uc_1.BMProductUC(productRepo);
exports.bmProductController = {
    /**
     * API lấy toàn bộ khóa học (product_type = COURSE)
     * GET /bm/products/courses
     */
    async getCourses(req, res) {
        try {
            //thêm console log
            console.info('[bmProductController][getCourses] Lấy danh sách toàn bộ khóa học');
            const courses = await productUC.getCourses();
            return res.status(200).json({
                success: true,
                data: courses,
            });
        }
        catch (err) {
            console.error('[bmProductController][getCourses]', err);
            return res.status(500).json({
                error: 'Lỗi khi lấy danh sách khóa học',
                message: err?.message,
            });
        }
    },
};
