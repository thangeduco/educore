"use strict";
// src/application/services/learning.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLearningService = exports.GiveBadgesForStudent = void 0;
const socket_server_1 = require("../../../infrastructure/common/socket/socket.server"); // ✅ Import Socket.IO instance từ hạ tầng
class GiveBadgesForStudent {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    /**
     * 🎥 Tặng huy hiệu khi học sinh bắt đầu xem video
     */
    async forVideoSessionStart(studentId, courseId, weekId, videoId) {
        const badgeType = 'student_click_video_start';
        const reason = 'Khích lệ học sinh, tạo hào hứng xem video';
        await this.give(studentId, courseId, weekId, videoId, badgeType, reason);
    }
    /**
     * 📄 Tặng huy hiệu khi học sinh nộp bài worksheet
     */
    async forWorksheetSubmission(studentId, courseId, weekId, worksheetId) {
        const badgeType = 'student_submit_worksheet';
        const reason = 'Hoàn thành bài tập đầy đủ, khích lệ học sinh,';
        await this.give(studentId, courseId, weekId, worksheetId, badgeType, reason);
    }
    /**
     * 🧠 Tặng huy hiệu khi học sinh đạt điểm cao
     */
    async forWorksheetHighScore(studentId, courseId, weekId, worksheetId) {
        const badgeType = 'student_worksheet_high_score';
        const reason = 'Làm bài tập về nhà đạt điểm cao đáng khích lệ';
        await this.give(studentId, courseId, weekId, worksheetId, badgeType, reason);
    }
    /**
     * 🌟 Core logic: Ghi nhận huy hiệu và emit socket
     */
    async give(studentId, courseId, weekId, eventId, badgeType, reason) {
        // Ghi nhận badge trong DB
        await this.learningRepo.giveBadgeForStudent(studentId, courseId, weekId, eventId, badgeType, reason);
        // Emit socket
        this.emitBadgeAwarded({
            studentId,
            courseId,
            weekId,
            eventId,
            badgeType,
            message: reason,
            timestamp: new Date().toISOString()
        });
    }
    emitBadgeAwarded(payload) {
        const room = `student_${payload.studentId}`;
        socket_server_1.io.to(room).emit('badge_awarded', payload);
        console.log(`[SOCKET] 🎖️ Badge "${payload.badgeType}" sent to ${room}`);
    }
}
exports.GiveBadgesForStudent = GiveBadgesForStudent;
class CourseLearningService {
    constructor(learningRepo, courseRepo) {
        this.learningRepo = learningRepo;
        this.courseRepo = courseRepo;
    }
    //Lấy tiến độ khoá học của học sinh
    async getCourseProgress(studentId, courseId) {
        const numWeeksOfCourse = await this.courseRepo.getNumberOfWeeksOfCourse(courseId);
        const sumWeekProgressOfStudentInCourse = await this.learningRepo.getSumWeekProgressOfStudentInCourse(studentId, courseId);
        const courseProgress = numWeeksOfCourse > 0
            ? Number((sumWeekProgressOfStudentInCourse / numWeeksOfCourse).toFixed(4))
            : 0;
        return courseProgress;
    }
}
exports.CourseLearningService = CourseLearningService;
