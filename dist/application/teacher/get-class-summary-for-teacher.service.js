"use strict";
// src/application/learning/get-class-summary-for-teacher.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClassSummaryForTeacherService = void 0;
class GetClassSummaryForTeacherService {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    async execute(params) {
        console.log('[GetClassSummaryForTeacherService][execute] Input:', params);
        const teacherId = params.teacher_id;
        if (!teacherId || isNaN(teacherId)) {
            throw new Error('Tham số teacher_id không hợp lệ');
        }
        const classSummaries = await this.learningRepo.getClassSummaryForTeacher(teacherId);
        if (!Array.isArray(classSummaries) || classSummaries.length === 0) {
            console.warn(`[GetClassSummaryForTeacherService] Không tìm thấy lớp học nào cho teacher_id=${teacherId}`);
        }
        classSummaries.forEach(cls => {
            //cls.students = []; // dữ liệu chi tiết học sinh được lấy riêng khi cần  
        });
        console.log('[GetClassSummaryForTeacherService][execute] Output:', classSummaries);
        return classSummaries;
    }
}
exports.GetClassSummaryForTeacherService = GetClassSummaryForTeacherService;
