"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequest = exports.safeParseInt = exports.nowISOString = void 0;
exports.safeParseArray = safeParseArray;
exports.sanitizeUser = sanitizeUser;
const nowISOString = () => new Date().toISOString();
exports.nowISOString = nowISOString;
const safeParseInt = (value, fallback = 0) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
};
exports.safeParseInt = safeParseInt;
const logRequest = (label, data) => {
    console.log(`[${label}]`, JSON.stringify(data, null, 2));
};
exports.logRequest = logRequest;
function safeParseArray(value) {
    if (!value)
        return [];
    try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
;
function sanitizeUser(user) {
    const { passwordHash, email, phone, profile, ...rest } = user;
    return {
        ...rest,
        email: email ?? undefined,
        phone: phone ?? undefined,
        profile: profile
            ? {
                avatarImage: profile.avatarImage ?? undefined,
                dob: profile.dob ?? undefined,
                gender: profile.gender ?? undefined,
                grade: profile.grade ?? undefined,
                slogen: profile.slogen ?? undefined,
            }
            : undefined,
    };
}
