"use strict";
// src/application/learning/submit-worksheet.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitWorksheetService = void 0;
const learing_service_1 = require("../../domain/LM/services/learing.service"); // Adjust the path if needed
// Import your email service here. Adjust the path as needed.
class SubmitWorksheetService {
    constructor(learningRepo, userGroupRepo, authRepo, courseRepo) {
        this.learningRepo = learningRepo;
        this.userGroupRepo = userGroupRepo;
        this.authRepo = authRepo;
        this.courseRepo = courseRepo;
    }
    async execute(params) {
        console.log('[SubmitWorksheetService][execute] Raw input params:', params);
        // Kiểm tra tham số bắt buộc
        if (params.student_id == null ||
            params.worksheet_id == null ||
            params.course_id == null ||
            params.course_week_id == null) {
            console.error('[SubmitWorksheetService][execute] Thiếu tham số bắt buộc:', {
                student_id: params.student_id,
                worksheet_id: params.worksheet_id,
                course_id: params.course_id,
                course_week_id: params.course_week_id,
            });
            throw new Error('Thiếu tham số bắt buộc: student_id, worksheet_id, course_id, course_week_id');
        }
        const studentId = parseInt(params.student_id, 10);
        const worksheetId = parseInt(params.worksheet_id, 10);
        const courseId = parseInt(params.course_id, 10);
        const courseWeekId = parseInt(params.course_week_id, 10);
        // Kiểm tra giá trị sau khi parse
        if (isNaN(studentId) ||
            isNaN(worksheetId) ||
            isNaN(courseId) ||
            isNaN(courseWeekId)) {
            console.error('[SubmitWorksheetService][execute] Tham số không hợp lệ (NaN):', {
                student_id: params.student_id,
                worksheet_id: params.worksheet_id,
                course_id: params.course_id,
                course_week_id: params.course_week_id,
            });
            throw new Error('Tham số không hợp lệ: phải là số hợp lệ');
        }
        const previousAttempt = await this.learningRepo.getLatestAttemptNumber(studentId, worksheetId);
        const nextAttempt = (previousAttempt ?? 0) + 1;
        const domainSubmission = {
            id: 0,
            student_id: studentId,
            worksheet_id: worksheetId,
            course_id: courseId,
            course_week_id: courseWeekId,
            attempt_number: nextAttempt,
            submission_file_url: params.submission_file_url,
            score: null,
            review: null,
            submitted_at: new Date(),
            review_at: null,
            review_file_url: null,
            teacher_id: null,
        };
        console.log('[SubmitWorksheetService][execute] Dữ liệu sẽ lưu vào DB:', domainSubmission);
        await this.learningRepo.submitWorksheet(domainSubmission);
        if (nextAttempt === 1) {
            console.log('[SubmitWorksheetService][execute] Đây là lần nộp đầu tiên → lưu course_week_progress');
            await this.learningRepo.insertCourseWeekProgress({
                student_id: studentId,
                course_id: courseId,
                course_week_id: courseWeekId,
                item_score: 1,
                item_type: 2, // 2: worksheet
                item_id: worksheetId,
            });
        }
        else {
            console.log(`[SubmitWorksheetService][execute] Đây là lần nộp thứ ${nextAttempt}`);
        }
        // Tặng huy hiệu cho học sinh
        const giveBadgesService = new learing_service_1.GiveBadgesForStudent(this.learningRepo);
        await giveBadgesService.forWorksheetSubmission(studentId, courseId, courseWeekId, worksheetId);
        //Email to student parents
        const parentEmail = await this.userGroupRepo.findParentsEmail(studentId);
        if (parentEmail) {
            const student = await this.authRepo.getUserById(studentId);
            const studentName = student?.fullName ?? 'ngoan';
            const worksheet = await this.courseRepo.getWorksheetInfo(worksheetId);
            const worksheetTitle = worksheet?.title ?? ' bài tập về nhà ';
            const courseWeek = await this.courseRepo.getCourseWeekInfo(courseWeekId);
            const weekNumber = courseWeek?.weekNumber ?? '';
            const courseTitle = courseWeek?.courseTile ?? '';
            const subject = 'Thông báo: Học sinh đã nộp bài tập';
            const body = `Chúc mừng ba mẹ ! \n \n
                         Con ${studentName} vừa nộp bài ${worksheetTitle} 
                         tuần học số ${weekNumber} khóa học ${courseTitle} \n\n
                         Ba mẹ chúc mừng, khích lệ con nhé !`;
            // const notificationService = new NotificationService();
            // await notificationService.notifyEmail(parentEmail, subject, body);
        }
        else {
            console.warn(`[SubmitWorksheetService][execute] Không tìm thấy email phụ huynh cho học sinh ID ${studentId}`);
        }
    }
}
exports.SubmitWorksheetService = SubmitWorksheetService;
