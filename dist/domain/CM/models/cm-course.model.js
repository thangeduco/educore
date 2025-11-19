"use strict";
// src/domain/CM/cm-models/cm-course.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCMCourseRow = parseCMCourseRow;
exports.parseCMCourseRows = parseCMCourseRows;
/**
 * Parse 1 row từ DB sang domain CMCourse.
 * Row DB thường snake_case → FE cần camelCase.
 */
function parseCMCourseRow(input) {
    assertObject(input, 'cm_course row must be an object');
    const { id, course_code, title, description, grade, subject, sol_image_url, teacher_profile_image_url, outcome_image_url, plan_image_url, created_at, updated_at, } = input;
    // ===== Required fields =====
    const idNum = toIntegerLike(id, 'id must be an integer');
    if (!course_code)
        throw new Error('course_code is required');
    if (!title)
        throw new Error('title is required');
    if (!grade)
        throw new Error('grade is required');
    if (!subject)
        throw new Error('subject is required');
    // ===== Optional string or null =====
    const descriptionStr = toOptionalString(description, 'description must be string or null');
    const solImageUrlStr = toOptionalString(sol_image_url, 'sol_image_url must be string or null');
    const teacherProfileImageUrlStr = toOptionalString(teacher_profile_image_url, 'teacher_profile_image_url must be string or null');
    const outcomeImageUrlStr = toOptionalString(outcome_image_url, 'outcome_image_url must be string or null');
    const planImageUrlStr = toOptionalString(plan_image_url, 'plan_image_url must be string or null');
    const toDateOrNull = (v) => {
        if (!v)
            return null;
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) {
            throw new Error(`Invalid date value: ${v}`);
        }
        return d;
    };
    return {
        id: idNum,
        courseCode: String(course_code),
        title: String(title),
        description: descriptionStr,
        grade: String(grade),
        subject: String(subject),
        solImageUrl: solImageUrlStr,
        teacherProfileImageUrl: teacherProfileImageUrlStr,
        outcomeImageUrl: outcomeImageUrlStr,
        planImageUrl: planImageUrlStr,
        createdAt: toDateOrNull(created_at),
        updatedAt: toDateOrNull(updated_at),
    };
}
/**
 * Parse danh sách rows từ DB.
 */
function parseCMCourseRows(input) {
    if (!Array.isArray(input)) {
        throw new Error('cm_course rows must be an array');
    }
    return input.map((row, index) => {
        try {
            return parseCMCourseRow(row);
        }
        catch (e) {
            throw new Error(`Failed to parse cm_course row at index ${index}: ${e?.message || 'unknown error'}`);
        }
    });
}
/* =========================================
 * Tiny utils – copy chuẩn từ bm-product.model.ts
 * ========================================= */
function assertObject(val, msg) {
    if (typeof val !== 'object' || val === null || Array.isArray(val)) {
        throw new Error(msg);
    }
}
function toIntegerLike(val, msg) {
    if (typeof val === 'number' && Number.isInteger(val))
        return val;
    if (typeof val === 'string' && /^-?\d+$/.test(val.trim())) {
        return Number(val.trim());
    }
    throw new Error(msg);
}
function toOptionalString(val, msg) {
    if (val === null || val === undefined)
        return null;
    if (typeof val === 'string')
        return val;
    throw new Error(msg);
}
