// src/infrastructure/BM/bm-pg-user-event-logs.repository.ts

import { pool } from '../common/db-postgres';

import { BMUserEventLogsRepository } from '../../domain/BM/bm-repos/bm-user_event_logs.repo';
import { UserEventLogCreateDto } from '../../application/BM/dtos/user_event_logs.dto';

// Đổi nếu tên bảng thực tế khác
const TABLE_NAME = 'user_event_logs';

/**
 * PgUserEventLogsRepository
 * Triển khai BMUserEventLogsRepository sử dụng Postgres.
 */
export class PgUserEventLogsRepository implements BMUserEventLogsRepository {

  async createUserEventLog(input: UserEventLogCreateDto): Promise<void> {
    try {
      const query = `
        INSERT INTO ${TABLE_NAME} (
          tenant_code,
          user_id,
          user_role,

          session_id,
          event_name,
          event_type,
          event_category,
          event_label,
          event_value,

          object_type,
          object_id,

          page_url,
          referrer_url,

          client_ip,
          client_user_agent,
          client_device_type,
          client_device_id,
          client_os_name,
          client_os_version,
          client_browser_name,
          client_browser_version,
          client_app_name,
          client_app_version,
          client_language,
          client_timezone,
          client_screen_width,
          client_screen_height,

          metadata_json,
          event_time
        )
        VALUES (
          $1,  $2,  $3,
          $4,  $5,  $6,  $7,  $8,  $9,
          $10, $11,
          $12, $13,
          $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25,
          $26, $27,
          $28,
          $29
        )
      `;

      const values = [
        input.tenant_code,
        input.user_id,
        input.user_role,

        input.session_id,
        input.event_name,
        input.event_type,
        input.event_category,
        input.event_label,
        input.event_value,

        input.object_type,
        input.object_id,

        input.page_url,
        input.referrer_url,

        input.client_ip,
        input.client_user_agent,
        input.client_device_type,
        input.client_device_id,
        input.client_os_name,
        input.client_os_version,
        input.client_browser_name,
        input.client_browser_version,
        input.client_app_name,
        input.client_app_version,
        input.client_language,
        input.client_timezone,
        input.client_screen_width,
        input.client_screen_height,

        input.metadata_json,
        input.event_time,
      ];

      await pool.query(query, values);
    } catch (err) {
      console.error(
        '[PgUserEventLogsRepository][createUserEventLog] ❌ Lỗi khi insert user_event_logs',
        err
      );
      throw err;
    }
  }
}
