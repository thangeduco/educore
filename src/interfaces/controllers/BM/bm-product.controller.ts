// src/interfaces/controllers/BM/bm-product.controller.ts

import { Request, Response } from 'express';
import { BMPgProductRepository } from '../../../infrastructure/BM/bm-pg-product.repository';
import { BMProductUC } from '../../../application/BM/use-cases/bm-product-service/bm-product.uc';

// Khởi tạo repository & use case
const productRepo = new BMPgProductRepository();
const productUC = new BMProductUC(productRepo);

export const bmProductController = {
  /**
   * API lấy toàn bộ khóa học (product_type = COURSE)
   * GET /bm/products/courses
   */
  async getCourses(req: Request, res: Response) {
    try {
        //thêm console log
        console.info('[bmProductController][getCourses] Lấy danh sách toàn bộ khóa học');

      const courses = await productUC.getCourses();

      return res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (err: any) {
      console.error('[bmProductController][getCourses]', err);
      return res.status(500).json({
        error: 'Lỗi khi lấy danh sách khóa học',
        message: err?.message,
      });
    }
  },
};
