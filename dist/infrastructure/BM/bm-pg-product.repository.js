"use strict";
// src/infrastructure/BM/bm-pg-product.repository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BMPgProductRepository = void 0;
const db_postgres_1 = require("../common/db-postgres");
const bm_product_model_1 = require("../../domain/BM/bm-models/bm-product.model");
const TABLE_NAME = 'bm_product';
// Liệt kê cột rõ ràng (tránh SELECT *), bao gồm cả success_stories
const BASE_COLUMNS = `
  id,
  product_code,
  product_type,
  name,
  product_title,
  tutorial_video_url,
  sale_kit_url,
  user_guide_link,
  success_stories,
  tagline,
  description,
  thumbnail_url,
  grade,
  level,
  category,
  subject,
  price_amount,
  list_price_amount,
  price_currency,
  promotion_flag,
  promotion_note,
  sale_start_at,
  sale_end_at,
  access_start_at,
  access_end_at,
  access_duration_days,
  status,
  is_visible,
  display_order,
  target_student_desc,
  learning_outcome,
  metadata,
  created_at,
  created_by,
  updated_at,
  updated_by
`;
/**
 * BMPgProductRepository
 * Triển khai BMProductRepository sử dụng Postgres.
 */
class BMPgProductRepository {
    /**
     * Lấy toàn bộ khóa học product_type = 'COURSE'
     * Chỉ lấy những khóa ACTIVE (và có thể hiển thị được).
     */
    async findAllCourses() {
        try {
            const sql = `
        SELECT ${BASE_COLUMNS}
        FROM ${TABLE_NAME}
        WHERE product_type = 'COURSE'
          AND status = 'ACTIVE'
        ORDER BY grade ASC NULLS LAST, level ASC NULLS LAST, display_order ASC NULLS LAST, id ASC
      `;
            const result = await db_postgres_1.pool.query(sql);
            return (0, bm_product_model_1.parseBMProductRows)(result.rows);
        }
        catch (err) {
            console.error('[BMPgProductRepository][findAllCourses] ❌ Lỗi khi query bm_product', err);
            throw err;
        }
    }
    /**
     * Lấy toàn bộ sản phẩm mọi loại
     */
    async findAllProducts() {
        try {
            const sql = `
        SELECT ${BASE_COLUMNS}
        FROM ${TABLE_NAME}
        ORDER BY display_order ASC NULLS LAST, id ASC
      `;
            const result = await db_postgres_1.pool.query(sql);
            return (0, bm_product_model_1.parseBMProductRows)(result.rows);
        }
        catch (err) {
            console.error('[BMPgProductRepository][findAllProducts] ❌ Lỗi khi query bm_product', err);
            throw err;
        }
    }
    /**
     * Lấy danh sách sản phẩm theo product_type
     */
    async findByProductType(productType) {
        try {
            const sql = `
        SELECT ${BASE_COLUMNS}
        FROM ${TABLE_NAME}
        WHERE product_type = $1
        ORDER BY display_order ASC NULLS LAST, id ASC
      `;
            const result = await db_postgres_1.pool.query(sql, [productType]);
            return (0, bm_product_model_1.parseBMProductRows)(result.rows);
        }
        catch (err) {
            console.error('[BMPgProductRepository][findByProductType] ❌ Lỗi khi query bm_product', err);
            throw err;
        }
    }
    /**
     * Lấy sản phẩm theo id
     */
    async findById(id) {
        try {
            const sql = `
        SELECT ${BASE_COLUMNS}
        FROM ${TABLE_NAME}
        WHERE id = $1
        LIMIT 1
      `;
            const result = await db_postgres_1.pool.query(sql, [id]);
            if (result.rows.length === 0)
                return null;
            return (0, bm_product_model_1.parseBMProductRow)(result.rows[0]);
        }
        catch (err) {
            console.error('[BMPgProductRepository][findById] ❌ Lỗi khi query bm_product', err);
            throw err;
        }
    }
    /**
     * Lấy sản phẩm theo product_code
     */
    async findByProductCode(productCode) {
        try {
            const sql = `
        SELECT ${BASE_COLUMNS}
        FROM ${TABLE_NAME}
        WHERE product_code = $1
        LIMIT 1
      `;
            const result = await db_postgres_1.pool.query(sql, [productCode]);
            if (result.rows.length === 0)
                return null;
            return (0, bm_product_model_1.parseBMProductRow)(result.rows[0]);
        }
        catch (err) {
            console.error('[BMPgProductRepository][findByProductCode] ❌ Lỗi khi query bm_product', err);
            throw err;
        }
    }
}
exports.BMPgProductRepository = BMPgProductRepository;
