"use strict";
// src/application/learning/submit-worksheet-review.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitWorksheetReviewService = void 0;
const learing_service_1 = require("../../domain/LM/services/learing.service");
//import { NotificationService } from '../IM/NotificationService';
class SubmitWorksheetReviewService {
    constructor(learningRepo, userGroupRepo, authRepo, courseRepo) {
        this.learningRepo = learningRepo;
        this.userGroupRepo = userGroupRepo;
        this.authRepo = authRepo;
        this.courseRepo = courseRepo;
    }
    async execute(params) {
        const submissionId = parseInt(params.submission_id, 10);
        const teacherId = parseInt(params.teacher_id, 10);
        await this.learningRepo.reviewWorksheet({
            submission_id: submissionId,
            score: params.score,
            review: params.review,
            teacher_id: teacherId,
            review_file_url: params.review_file_url,
        });
        // Tặng huy hiệu cho học sinh nộp bài nếu điểm >= 6
        const worksheetSubmission = await this.learningRepo.getWorksheetSubmissionById(submissionId);
        if (!worksheetSubmission) {
            console.warn(`[SubmitWorksheetReviewService][execute] Không tìm thấy nộp bài với ID ${submissionId}`);
            return;
        }
        const studentId = worksheetSubmission.student_id;
        const courseId = worksheetSubmission.course_id;
        const weekId = worksheetSubmission.course_week_id;
        const worksheetId = worksheetSubmission.worksheet_id;
        if (params.score > 6) {
            const giveBadgesService = new learing_service_1.GiveBadgesForStudent(this.learningRepo);
            if (!worksheetSubmission) {
                console.warn(`[SubmitWorksheetReviewService][execute] Không tìm thấy nộp bài với ID ${submissionId}`);
                return;
            }
            await giveBadgesService.forWorksheetHighScore(studentId, courseId, weekId, worksheetId);
        }
        // Gửi email thông báo cho phụ huynh học sinh
        const parentEmail = await this.userGroupRepo.findParentsEmail(studentId);
        if (parentEmail) {
            const student = await this.authRepo.getUserById(studentId);
            const studentName = student?.fullName ?? 'ngoan';
            const worksheet = await this.courseRepo.getWorksheetInfo(worksheetId);
            const worksheetTitle = worksheet?.title ?? ' bài tập về nhà ';
            const courseWeek = await this.courseRepo.getCourseWeekInfo(weekId);
            const weekNumber = courseWeek?.weekNumber ?? '';
            const courseTitle = courseWeek?.courseTile ?? '';
            const subject = 'Thông báo: Bài tập về nhà của học sinh được chấm điểm';
            const body = `Chúc mừng ba mẹ ! \n \n
                    Con ${studentName} đã được cô chấm bài ${worksheetTitle} 
                    tuần học số ${weekNumber} khóa học ${courseTitle} \n\n
                    Con đạt điểm số: ${params.score} \n
                    Ba mẹ hãy chúc mừng, khích lệ con nhé !`;
            // const notificationService = new NotificationService();
            // await notificationService.notifyEmail(parentEmail, subject, body);
        }
        else {
            console.warn(`[SubmitWorksheetReviewService][execute] Không tìm thấy email phụ huynh cho học sinh ID ${worksheetSubmission.student_id}`);
        }
        console.log('[SubmitWorksheetReviewService][execute] Đã lưu đánh giá bài tập');
    }
}
exports.SubmitWorksheetReviewService = SubmitWorksheetReviewService;
