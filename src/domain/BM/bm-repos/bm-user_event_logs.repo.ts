// src/domain/BM/bm-repos/bm-user_event_logs.repo.ts

import { UserEventLogCreateDto } from '../../../application/BM/dtos/user_event_logs.dto';

/**
 * BMUserEventLogsRepository
 * Interface repository cấp domain cho bảng user_event_logs.
 * Hạ tầng (Postgres, v.v.) sẽ implement interface này.
 */
export interface BMUserEventLogsRepository {
  createUserEventLog(input: UserEventLogCreateDto): Promise<void>;
}
