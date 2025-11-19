"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgLearningRepository = void 0;
const pg_learning_repository_core_1 = require("./pg-learning.repository.core");
const pg_learning_repository_parent_1 = require("./pg-learning.repository.parent");
const pg_learning_repository_teacher_1 = require("./pg-learning.repository.teacher");
class PgLearningRepository extends pg_learning_repository_core_1.PgLearningRepositoryCore {
    constructor() {
        super(...arguments);
        this.parentStatsRepo = new pg_learning_repository_parent_1.PgLearningRepositoryParentStats();
        this.teacherStatsRepo = new pg_learning_repository_teacher_1.PgLearningRepositoryTeacherStats();
        // Các phương thức khác từ PgLearningRepositoryCore sẽ được kế thừa
        // và không cần phải định nghĩa lại ở đây.
        // Ví dụ:
        // insertCourseWeekProgress, submitWorksheet, reviewWorksheet, etc.
    }
    async getCourseWeekLearningStatsForParent(studentId, courseId) {
        return this.parentStatsRepo.getCourseWeekLearningStatsForParent(studentId, courseId);
    }
    //getSummaryNeedReviewsForTeacher; Các nội dung cần giáo viên review
    async getSummaryNeedReviewsForTeacher(teacherId) {
        return this.teacherStatsRepo.getSummaryNeedReviewsForTeacher(teacherId);
    }
    //getSummaryNeedReviewEachClassForTeacher: Các nội dung của từng lớp học cần giáo viên review
    async getSummaryNeedReviewEachClassForTeacher(teacherId) {
        return this.teacherStatsRepo.getSummaryNeedReviewEachClassForTeacher(teacherId);
    }
    // getDetailNeedReviewOfOneClassForTeacher: Chi tiết các nội dung của 1 lớp học cần giáo viên reivew
    async getDetailNeedReviewOfOneClassForTeacher(teacherId, classId) {
        return this.teacherStatsRepo.getDetailNeedReviewOfOneClassForTeacher(teacherId, classId);
    }
    //getClassViewForTeacher
    async getClassViewForTeacher(teacherId, classId) {
        return []; // Chưa triển khai
    }
    //getClassSummaryForTeacher
    async getClassSummaryForTeacher(teacherId) {
        return []; // Chưa triển khai
    }
}
exports.PgLearningRepository = PgLearningRepository;
