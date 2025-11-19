// src/interfaces/controllers/BM/bm-user-event-logs.controller.ts

import { Request, Response } from 'express';
import { UserLogUC } from '../../../application/BM/use-cases/bm-user-logs/user-log.uc';
import { PgUserEventLogsRepository } from '../../../infrastructure/BM/bm-pg-user-event-logs.repository';
import { UserEventLogCreateDto } from '../../../application/BM/dtos/user_event_logs.dto';
import { getClientIp } from '../../services/middware.service';

// Khởi tạo repository & use case
const userEventLogsRepo = new PgUserEventLogsRepository();
const userLogUC = new UserLogUC(userEventLogsRepo);

export const bmUserEventLogsController = {
  /**
   * API ghi log sự kiện người dùng
   * POST /bm/user-event-logs
   */
  async createUserEventLog(req: Request, res: Response) {
    try {
      const body = (req.body || {}) as any;

      // Một số field tối thiểu nên có, bạn có thể nới lỏng nếu muốn
      if (!body.event_name || !body.event_type) {
        return res.status(400).json({
          error: 'Thiếu event_name hoặc event_type trong payload',
        });
      }

      const clientIp = getClientIp(req);

      const input: UserEventLogCreateDto = {
        tenant_code: body.tenant_code || null,

        user_id:
          body.user_id !== undefined && body.user_id !== null
            ? Number(body.user_id)
            : null,
        user_role: body.user_role ?? null,

        session_id: body.session_id ?? null,
        event_name: String(body.event_name),
        event_type: String(body.event_type),
        event_category: body.event_category ?? null,
        event_label: body.event_label ?? null,
        event_value:
          body.event_value !== undefined && body.event_value !== null
            ? String(body.event_value)
            : null,

        object_type: body.object_type ?? null,
        object_id:
          body.object_id !== undefined && body.object_id !== null
            ? Number(body.object_id)
            : null,

        page_url: body.page_url ?? null,
        referrer_url: body.referrer_url ?? null,

        client_ip: clientIp,
        client_user_agent: (req.headers['user-agent'] as string) || null,
        client_device_type: body.client_device_type ?? null,
        client_device_id: body.client_device_id ?? null,

        client_os_name: body.client_os_name ?? null,
        client_os_version: body.client_os_version ?? null,

        client_browser_name: body.client_browser_name ?? null,
        client_browser_version: body.client_browser_version ?? null,

        client_app_name: body.client_app_name ?? null,
        client_app_version: body.client_app_version ?? null,

        client_language: body.client_language ?? null,
        client_timezone: body.client_timezone ?? null,
        client_screen_width:
          body.client_screen_width !== undefined &&
          body.client_screen_width !== null
            ? Number(body.client_screen_width)
            : null,
        client_screen_height:
          body.client_screen_height !== undefined &&
          body.client_screen_height !== null
            ? Number(body.client_screen_height)
            : null,

        metadata_json: body.metadata_json ?? null,

        // event_time có thể FE gửi dạng ISO string
        event_time: body.event_time ? new Date(body.event_time) : null,
      };

      await userLogUC.postUserEventLog(input);

      return res.status(201).json({
        success: true,
      });
    } catch (err: any) {
      console.error('[bmUserEventLogsController][createUserEventLog]', err);
      return res.status(500).json({
        error: 'Lỗi khi ghi log sự kiện người dùng',
        message: err?.message,
      });
    }
  },
};
