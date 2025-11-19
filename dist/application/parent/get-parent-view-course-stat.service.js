"use strict";
// src/application/learning/get-parent-view-course-stat.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParentViewCourseStatService = void 0;
const learing_service_1 = require("../../domain/LM/services/learing.service");
class GetParentViewCourseStatService {
    constructor(learningRepo, authRepo, courseRepo) {
        this.learningRepo = learningRepo;
        this.authRepo = authRepo;
        this.courseRepo = courseRepo;
    }
    async execute(params) {
        console.log('[GetParentViewCourseStatService][execute] Raw input:', params);
        if (!params.student_id || !params.course_id) {
            throw new Error('Thiếu tham số student_id hoặc course_id');
        }
        const studentId = params.student_id;
        const courseId = params.course_id;
        if (isNaN(studentId) || isNaN(courseId)) {
            throw new Error('student_id và course_id phải là số hợp lệ');
        }
        // Lấy thông tin học sinh
        const student = await this.authRepo.getUserById(studentId);
        if (!student) {
            throw new Error(`Không tìm thấy học sinh với ID ${studentId}`);
        }
        const studentName = student.fullName || 'Học sinh';
        const studentAvatarUrl = student.profile?.avatarImage ?? '';
        const studentSlogan = student.profile?.slogen ?? '';
        // Lấy thông tin khoá học
        const course = await this.courseRepo.getCourseByCode(String(courseId));
        if (!course) {
            throw new Error(`Không tìm thấy khoá học với ID ${courseId}`);
        }
        const courseTitle = course.title || 'Khoá học';
        // Lấy tiến độ khoá học của học sinh
        const courseLearningService = new learing_service_1.CourseLearningService(this.learningRepo, this.courseRepo);
        const courseProgress = await courseLearningService.getCourseProgress(studentId, courseId);
        // Lấy số huy hiệu học sinh đạt được
        const courseBadgeCount = await this.learningRepo.getStudentBadgeCountForCourse(studentId, courseId);
        // Lấy thống kê chi tiết stat các tuần học
        const courseWeekStats = await this.learningRepo.getCourseWeekLearningStatsForParent(studentId, courseId);
        // Chuyển đổi dữ liệu thành định dạng trả về StudentCourseViewForParent
        if (!courseWeekStats || courseWeekStats.length === 0) {
            throw new Error(`Không tìm thấy thông tin tuần học cho học sinh ${studentId} trong khoá học ${courseId}`);
        }
        console.log('[GetParentViewCourseStatService][execute] Course week stats:', courseWeekStats);
        if (!Array.isArray(courseWeekStats)) {
            throw new Error('Dữ liệu tuần học không hợp lệ');
        }
        courseWeekStats.forEach(week => {
            if (!week.videos || !Array.isArray(week.videos)) {
                week.videos = [];
            }
            if (!week.worksheets || !Array.isArray(week.worksheets)) {
                week.worksheets = [];
            }
        });
        const result = {
            courseId: String(courseId),
            studentId: String(studentId),
            studentName,
            studentAvatarUrl,
            studentSlogan,
            courseTitle,
            courseProgress: Number(courseProgress.toFixed(4)),
            courseBadgeCount,
            courseWeekDetails: courseWeekStats,
        };
        console.log('[GetParentViewCourseStatService][execute] Result:', result);
        return result;
    }
}
exports.GetParentViewCourseStatService = GetParentViewCourseStatService;
