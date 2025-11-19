// src/infrastructure/BM/bm-pg-config-param.repository.ts

import { pool } from '../common/db-postgres';

import {
  HomeUserGuide,
  HomeCourses,
  HomeImageSlides,
  HomeQAs,
  HomeVideoTutorial,
  parseHomeUserGuide,
  parseHomeCourses,
  parseHomeImageSlides,
  parseHomeQAs,
  parseHomeVideoTutorial,
} from '../../domain/BM/bm-models/bm-home-config-param.model';

import { BMConfigParamRepository } from '../../domain/BM/bm-repos/bm-config-param.repo';

const TABLE_NAME = 'bm_config_param';

/**
 * PgBMConfigParamRepository
 * Triển khai BMConfigParamRepository sử dụng Postgres.
 */
export class PgBMConfigParamRepository implements BMConfigParamRepository {
  /**
   * Lấy param_value dạng JSON thô từ DB.
   */
  private async findRawParamValue(
    tenantCode: string,
    paramType: string
  ): Promise<any | null> {
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

      const result = await pool.query(sql, [tenantCode, paramType]);

      if (result.rows.length === 0) return null;

      const raw = result.rows[0].param_value;
      return raw ?? null;
    } catch (err) {
      console.error(
        '[PgBMConfigParamRepository][findRawParamValue] ❌ Lỗi khi truy vấn bm_config_param',
        err
      );
      throw err;
    }
  }

  // ================= CONFIG HOMEPAGE ======================

  async findHomeUserGuide(tenantCode: string): Promise<HomeUserGuide | null> {
    const raw = await this.findRawParamValue(tenantCode, 'home_user_guide');
    if (!raw) return null;

    try {
      return parseHomeUserGuide(raw);
    } catch (err) {
      console.error(
        '[PgBMConfigParamRepository][findHomeUserGuide] ❌ Parse lỗi home_user_guide',
        err
      );
      return null;
    }
  }

  async findHomeCourses(tenantCode: string): Promise<HomeCourses | null> {
    const raw = await this.findRawParamValue(tenantCode, 'home_courses');
    if (!raw) return [];

    try {
      return parseHomeCourses(raw);
    } catch (err) {
      console.error(
        '[PgBMConfigParamRepository][findHomeCourses] ❌ Parse lỗi home_courses',
        err
      );
      return [];
    }
  }

  async findHomeImageSlides(tenantCode: string): Promise<HomeImageSlides | null> {
    const raw = await this.findRawParamValue(tenantCode, 'home_image_slides');
    if (!raw) return [];

    try {
      return parseHomeImageSlides(raw);
    } catch (err) {
      console.error(
        '[PgBMConfigParamRepository][findHomeImageSlides] ❌ Parse lỗi home_image_slides',
        err
      );
      return [];
    }
  }

  async findHomeQAs(tenantCode: string): Promise<HomeQAs | null> {
    const raw = await this.findRawParamValue(tenantCode, 'home_qas');
    if (!raw) return [];

    try {
      return parseHomeQAs(raw);
    } catch (err) {
      console.error(
        '[PgBMConfigParamRepository][findHomeQAs] ❌ Parse lỗi home_qas',
        err
      );
      return [];
    }
  }

  async findHomeVideoTutorial(
    tenantCode: string
  ): Promise<HomeVideoTutorial | null> {
    const raw = await this.findRawParamValue(tenantCode, 'home_video_tutorial');
    if (!raw) return null;

    try {
      return parseHomeVideoTutorial(raw);
    } catch (err) {
      console.error(
        '[PgBMConfigParamRepository][findHomeVideoTutorial] ❌ Parse lỗi home_video_tutorial',
        err
      );
      return null;
    }
  }

  // ================= END CONFIG HOMEPAGE ======================
}
