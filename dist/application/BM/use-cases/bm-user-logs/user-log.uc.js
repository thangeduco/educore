"use strict";
// src/application/BM/use-cases/bm-user-logs/user-log.uc.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogUC = void 0;
/**
 * Use Case: UserLogUC
 * Nhóm các use-case liên quan đến User Log.
 * Hiện tại mới có hàm postUserEventLog, sau này có thể bổ sung thêm các hàm khác.
 */
class UserLogUC {
    constructor(repo) {
        this.repo = repo;
    }
    /**
     * postUserEventLog
     * Ghi lại log sự kiện người dùng vào bảng user_event_logs.
     */
    async postUserEventLog(input) {
        // Chuẩn hoá nhẹ dữ liệu đầu vào
        const normalized = {
            ...input,
            event_name: (input.event_name || '').toString().trim(),
            event_type: (input.event_type || '').toString().trim(),
            event_category: input.event_category
                ? input.event_category.toString().trim()
                : null,
            event_label: input.event_label
                ? input.event_label.toString().trim()
                : null,
            event_value: input.event_value
                ? input.event_value.toString().trim()
                : null,
            tenant_code: input.tenant_code
                ? input.tenant_code.toString().trim()
                : null,
        };
        if (!normalized.event_name || !normalized.event_type) {
            // Phòng hộ – controller đã check trước, nhưng vẫn giữ validate ở đây cho chắc chắn.
            throw new Error('event_name và event_type là bắt buộc');
        }
        console.info(`[UserLogUC][postUserEventLog] Ghi log event_name=${normalized.event_name}, event_type=${normalized.event_type}, tenant=${normalized.tenant_code}`);
        await this.repo.createUserEventLog(normalized);
    }
}
exports.UserLogUC = UserLogUC;
