"use strict";
// src/infrastructure/BM/bm-pg-config-param.repository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgBMConfigParamRepository = void 0;
const db_postgres_1 = require("../common/db-postgres");
const bm_home_config_param_model_1 = require("../../domain/BM/bm-models/bm-home-config-param.model");
const TABLE_NAME = 'bm_config_param';
/**
 * PgBMConfigParamRepository
 * Triển khai BMConfigParamRepository sử dụng Postgres.
 */
class PgBMConfigParamRepository {
    /**
     * Lấy param_value dạng JSON thô từ DB.
     */
    async findRawParamValue(tenantCode, paramType) {
        try {
            const sql = `
        SELECT param_value
        FROM ${TABLE_NAME}
        WHERE tenant_code = $1
          AND param_type = $2
          AND status = 1
        ORDER BY param_version DESC
        LIMIT 1
      `;
            const result = await db_postgres_1.pool.query(sql, [tenantCode, paramType]);
            if (result.rows.length === 0)
                return null;
            const raw = result.rows[0].param_value;
            return raw ?? null;
        }
        catch (err) {
            console.error('[PgBMConfigParamRepository][findRawParamValue] ❌ Lỗi khi truy vấn bm_config_param', err);
            throw err;
        }
    }
    // ================= CONFIG HOMEPAGE ======================
    async findHomeUserGuide(tenantCode) {
        const raw = await this.findRawParamValue(tenantCode, 'home_user_guide');
        if (!raw)
            return null;
        try {
            return (0, bm_home_config_param_model_1.parseHomeUserGuide)(raw);
        }
        catch (err) {
            console.error('[PgBMConfigParamRepository][findHomeUserGuide] ❌ Parse lỗi home_user_guide', err);
            return null;
        }
    }
    async findHomeCourses(tenantCode) {
        const raw = await this.findRawParamValue(tenantCode, 'home_courses');
        if (!raw)
            return [];
        try {
            return (0, bm_home_config_param_model_1.parseHomeCourses)(raw);
        }
        catch (err) {
            console.error('[PgBMConfigParamRepository][findHomeCourses] ❌ Parse lỗi home_courses', err);
            return [];
        }
    }
    async findHomeImageSlides(tenantCode) {
        const raw = await this.findRawParamValue(tenantCode, 'home_image_slides');
        if (!raw)
            return [];
        try {
            return (0, bm_home_config_param_model_1.parseHomeImageSlides)(raw);
        }
        catch (err) {
            console.error('[PgBMConfigParamRepository][findHomeImageSlides] ❌ Parse lỗi home_image_slides', err);
            return [];
        }
    }
    async findHomeQAs(tenantCode) {
        const raw = await this.findRawParamValue(tenantCode, 'home_qas');
        if (!raw)
            return [];
        try {
            return (0, bm_home_config_param_model_1.parseHomeQAs)(raw);
        }
        catch (err) {
            console.error('[PgBMConfigParamRepository][findHomeQAs] ❌ Parse lỗi home_qas', err);
            return [];
        }
    }
    async findHomeVideoTutorial(tenantCode) {
        const raw = await this.findRawParamValue(tenantCode, 'home_video_tutorial');
        if (!raw)
            return null;
        try {
            return (0, bm_home_config_param_model_1.parseHomeVideoTutorial)(raw);
        }
        catch (err) {
            console.error('[PgBMConfigParamRepository][findHomeVideoTutorial] ❌ Parse lỗi home_video_tutorial', err);
            return null;
        }
    }
}
exports.PgBMConfigParamRepository = PgBMConfigParamRepository;
