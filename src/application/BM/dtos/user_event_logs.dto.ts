// src/application/BM/dtos/user_event_logs.dto.ts

export interface UserEventLogCreateDto {
  tenant_code: string | null;

  user_id: number | null;
  user_role: string | null;

  session_id: string | null;
  event_name: string;
  event_type: string;
  event_category: string | null;
  event_label: string | null;
  event_value: string | null;

  object_type: string | null;
  object_id: number | null;

  page_url: string | null;
  referrer_url: string | null;

  client_ip: string | null;
  client_user_agent: string | null;
  client_device_type: string | null;
  client_device_id: string | null;

  client_os_name: string | null;
  client_os_version: string | null;

  client_browser_name: string | null;
  client_browser_version: string | null;

  client_app_name: string | null;
  client_app_version: string | null;

  client_language: string | null;
  client_timezone: string | null;
  client_screen_width: number | null;
  client_screen_height: number | null;

  metadata_json: any | null;

  event_time: Date | null;
}
