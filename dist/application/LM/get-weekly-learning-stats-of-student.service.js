"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWeeklyLearningStatsOfStudent = void 0;
class GetWeeklyLearningStatsOfStudent {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    async execute(courseId, studentId, weekId) {
        const weekDetailContent = await this.learningRepo.getWeeklyLearningStatsForStudent(studentId, courseId, weekId);
        // 6. Trả kết quả đầy đủ đúng theo StudentCourseDetailDto
        return weekDetailContent;
    }
}
exports.GetWeeklyLearningStatsOfStudent = GetWeeklyLearningStatsOfStudent;
