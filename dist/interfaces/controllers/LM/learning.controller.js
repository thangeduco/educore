"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningController = void 0;
const cm_pg_course_repository_1 = require("../../../infrastructure/CM/cm-pg-course.repository");
const pg_learning_repository_1 = require("../../../infrastructure/LM/pg-learning.repository");
const get_student_course_progress_detail_service_1 = require("../../../application/LM/get-student-course-progress-detail.service");
const get_weekly_learning_stats_of_student_service_1 = require("../../../application/LM/get-weekly-learning-stats-of-student.service");
const record_video_session_start_service_1 = require("../../../application/LM/record-video-session-start.service");
const record_video_session_stop_service_1 = require("../../../application/LM/record-video-session-stop.service");
const submit_worksheet_service_1 = require("../../../application/LM/submit-worksheet.service");
const submit_worksheet_review_service_1 = require("../../../application/LM/submit-worksheet-review.service");
const pg_user_group_repository_1 = require("../../../infrastructure/BM/pg-user-group.repository");
const pg_auth_repository_1 = require("../../../infrastructure/BM/pg-auth.repository");
const get_parent_view_course_stat_service_1 = require("../../../application/parent/get-parent-view-course-stat.service");
const get_class_summary_for_teacher_service_1 = require("../../../application/teacher/get-class-summary-for-teacher.service");
const get_class_view_for_teacher_service_1 = require("../../../application/teacher/get-class-view-for-teacher.service");
const get_near_progress_summary_of_student_service_1 = require("../../../application/LM/get-near-progress-summary-of-student.service");
const submit_video_choice_quiz_logs_service_1 = require("../../../application/LM/submit-video-choice-quiz-logs.service");
// 🔧 Khởi tạo repository và service
const courseRepo = new cm_pg_course_repository_1.CMPgCourseRepository();
const learningRepo = new pg_learning_repository_1.PgLearningRepository();
const userGroupRepo = new pg_user_group_repository_1.PgUserGroupRepository();
const authRepo = new pg_auth_repository_1.PgAuthRepository();
const getStudentCourseProgressDetailService = new get_student_course_progress_detail_service_1.GetStudentCourseProgressDetailService(learningRepo, courseRepo);
const getWeeklyLearningStatsOfStudent = new get_weekly_learning_stats_of_student_service_1.GetWeeklyLearningStatsOfStudent(learningRepo);
const recordVideoSessionStartService = new record_video_session_start_service_1.RecordVideoSessionStartService(learningRepo);
const recordVideoSessionStopService = new record_video_session_stop_service_1.RecordVideoSessionStopService(learningRepo);
const submitWorksheetService = new submit_worksheet_service_1.SubmitWorksheetService(learningRepo, userGroupRepo, authRepo, courseRepo);
const submitWorksheetReviewService = new submit_worksheet_review_service_1.SubmitWorksheetReviewService(learningRepo, userGroupRepo, authRepo, courseRepo);
const getParentViewCourseStatService = new get_parent_view_course_stat_service_1.GetParentViewCourseStatService(learningRepo, authRepo, courseRepo);
const getClassSummaryForTeacherService = new get_class_summary_for_teacher_service_1.GetClassSummaryForTeacherService(learningRepo);
const getClassViewForTeacherService = new get_class_view_for_teacher_service_1.GetClassViewForTeacherService(learningRepo);
const getNearProgressSummaryOfStudent = new get_near_progress_summary_of_student_service_1.GetNearProgressSummaryOfStudent(learningRepo);
const submitVideoChoiceQuizLogs = new submit_video_choice_quiz_logs_service_1.SubmitVideoChoiceQuizLogs(learningRepo);
exports.learningController = {
    async getCourseProgressDetailOfStudent(req, res) {
        try {
            const studentId = Number(req.params.studentId);
            const courseId = Number(req.params.courseId);
            if (isNaN(studentId) || isNaN(courseId)) {
                return res.status(400).json({ error: 'student_id hoặc course_id không hợp lệ' });
            }
            const result = await getStudentCourseProgressDetailService.execute(courseId, studentId);
            return res.status(200).json(result);
        }
        catch (err) {
            console.error('[learningController][getCourseProgressDetailOfStudent]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin tiến độ khoá học' });
        }
    },
    async getWeeklyLearningStatsOfStudent(req, res) {
        try {
            const studentId = Number(req.params.studentId);
            const courseId = Number(req.params.courseId);
            const weekId = Number(req.params.weekId);
            if (isNaN(studentId) || isNaN(courseId) || isNaN(weekId)) {
                return res.status(400).json({ error: 'student_id hoặc course_id hoặc week_Id không hợp lệ' });
            }
            const result = await getWeeklyLearningStatsOfStudent.execute(courseId, studentId, weekId);
            return res.status(200).json(result);
        }
        catch (err) {
            console.error('[learningController][getWeeklyLearningStatsOfStudent]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin tiến độ của tuần học' });
        }
    },
    async startVideoSession(req, res) {
        try {
            const { student_id, video_lecture_id, course_week_id, course_id, start_second, } = req.body;
            if (!student_id || !video_lecture_id || !course_week_id || !course_id || start_second == undefined || start_second == null) {
                console.log('Thiếu thông tin bắt buộc để tạo video session');
                return res.status(400).json({ error: 'Thiếu thông tin bắt buộc để tạo video session' });
            }
            const sessionId = await recordVideoSessionStartService.execute({
                studentId: student_id,
                videoId: video_lecture_id,
                weekId: course_week_id,
                courseId: course_id,
                startSecond: start_second
            });
            return res.status(201).json({ id: sessionId });
        }
        catch (err) {
            console.error('[learningController][startVideoSession]', err);
            return res.status(500).json({ error: 'Lỗi khi tạo video session' });
        }
    },
    async stopVideoSession(req, res) {
        try {
            const sessionId = Number(req.params.sessionId);
            const { stop_second, actual_duration, } = req.body;
            if (isNaN(sessionId)) {
                return res.status(400).json({ error: 'sessionId không hợp lệ' });
            }
            await recordVideoSessionStopService.execute({
                sessionId: sessionId,
                stopSecond: stop_second,
                actualDuration: actual_duration,
            });
            return res.status(200).json({ message: 'Đã cập nhật video session' });
        }
        catch (err) {
            console.error('[learningController][stopVideoSession]', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật video session' });
        }
    },
    async submitWorksheet(req, res) {
        try {
            const { student_id, worksheet_id, course_id, course_week_id, } = req.body;
            const { file } = req;
            // Kiểm tra tham số bắt buộc
            if (!student_id ||
                !worksheet_id ||
                !course_id ||
                !course_week_id) {
                console.warn('[learningController][submitWorksheet] Thiếu tham số bắt buộc:', {
                    student_id,
                    worksheet_id,
                    course_id,
                    course_week_id,
                });
                return res.status(400).json({ error: 'Thiếu tham số bắt buộc' });
            }
            if (!file) {
                return res.status(400).json({ error: 'Không có file được tải lên' });
            }
            const hostUrl = process.env.HOST_URL || 'http://localhost:3100';
            const fileUrl = `${hostUrl}/static/uploads/worksheet-submissions/${file.filename}`;
            console.log('[learningController][submitWorksheet][fileUrl]', fileUrl);
            await submitWorksheetService.execute({
                student_id,
                worksheet_id,
                course_id,
                course_week_id,
                submission_file_url: fileUrl,
            });
            return res.status(201).json({
                message: 'Nộp bài tập thành công',
                fileUrl,
            });
        }
        catch (err) {
            console.error('[learningController][submitWorksheet]', err);
            return res.status(500).json({ error: 'Lỗi khi nộp bài tập' });
        }
    },
    async submitWorksheetReview(req, res) {
        try {
            const { submission_id, score, review, teacher_id, } = req.body;
            const file = req.file;
            if (!submission_id || score === undefined || score === null || !teacher_id) {
                return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
            }
            const reviewFileUrl = file ? `/uploads/reviews/${file.filename}` : null;
            console.log('[learningController][submitWorksheetReview]', {
                submission_id,
                score,
                review,
                teacher_id,
                reviewFileUrl,
            });
            await submitWorksheetReviewService.execute({
                submission_id,
                score: parseInt(score, 10),
                review: review ?? null,
                teacher_id,
                review_file_url: reviewFileUrl,
            });
            return res.status(200).json({ message: 'Đã đánh giá bài tập thành công' });
        }
        catch (err) {
            console.error('[learningController][submitWorksheetReview][Error]', err);
            return res.status(500).json({ message: 'Lỗi khi đánh giá bài tập' });
        }
    },
    //getParentViewCourseDetail
    async getParentViewCourseStat(req, res) {
        try {
            const studentId = Number(req.params.studentId);
            const courseId = Number(req.params.courseId);
            if (isNaN(studentId) || isNaN(courseId)) {
                return res.status(400).json({ error: 'student_id hoặc course_id không hợp lệ' });
            }
            //Gọi vào get-parent-view-course-stat.service.ts
            const response = await getParentViewCourseStatService.execute({
                student_id: studentId,
                course_id: courseId,
            });
            return res.status(200).json(response);
        }
        catch (err) {
            console.error('[learningController][getParentViewCourseDetail]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin khoá học của phụ huynh' });
        }
    },
    //get-class-summary-for-teacher.service.ts
    async getClassSummaryForTeacher(req, res) {
        try {
            const teacherId = Number(req.params.teacherId);
            if (isNaN(teacherId)) {
                return res.status(400).json({ error: 'teacher_id không hợp lệ' });
            }
            const classSummaries = await getClassSummaryForTeacherService.execute({ teacher_id: teacherId });
            return res.status(200).json(classSummaries);
        }
        catch (err) {
            console.error('[learningController][getClassSummaryForTeacher]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin tóm tắt lớp học cho giáo viên' });
        }
    },
    //get-class-view-for-teacher.service.ts
    async getClassViewForTeacher(req, res) {
        try {
            const teacherId = Number(req.params.teacherId);
            const classId = Number(req.params.classId);
            if (isNaN(teacherId) || isNaN(classId)) {
                return res.status(400).json({ error: 'teacher_id hoặc class_id không hợp lệ' });
            }
            const studentTasks = await getClassViewForTeacherService.execute({ teacher_id: teacherId, class_id: classId });
            return res.status(200).json(studentTasks);
        }
        catch (err) {
            console.error('[learningController][getClassViewForTeacher]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin lớp học cho giáo viên' });
        }
    },
    //getNearProgressSummaryOfStudent
    async getNearProgressSummaryOfStudent(req, res) {
        try {
            const studentId = Number(req.params.studentId);
            const courseId = Number(req.params.courseId);
            if (isNaN(studentId) || isNaN(courseId)) {
                return res.status(400).json({ error: 'student_id hoặc course_id không hợp lệ' });
            }
            // You likely want to use getStudentCourseProgressDetailService for student progress
            const nearProgressSummary = await getNearProgressSummaryOfStudent.execute(studentId, courseId);
            return res.status(200).json(nearProgressSummary);
        }
        catch (err) {
            console.error('[learningController][getNearProgressSummaryOfStudent]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy thông tin tiến độ gần đây của học sinh' });
        }
    },
    //submitVideoChoiceQuizLogs
    async submitVideoChoiceQuizLogs(req, res) {
        try {
            const studentId = Number(req.params.studentId);
            const courseId = Number(req.params.courseId);
            const payload = req.body;
            if (isNaN(studentId) || isNaN(courseId)) {
                return res.status(400).json({ error: 'student_id hoặc course_id không hợp lệ' });
            }
            // Gọi service để xử lý việc nộp quiz logs
            await submitVideoChoiceQuizLogs.execute({
                studentId,
                choiceQuizId: payload.choice_quiz_id,
                selectedOption: payload.selected_option,
                isCorrect: payload.is_correct,
                answeredInSeconds: payload.answered_in_seconds,
                courseId,
            });
            return res.status(201).json({ message: 'Đã nộp quiz logs thành công' });
        }
        catch (err) {
            console.error('[learningController][submitVideoChoiceQuizLogs]', err);
            return res.status(500).json({ error: 'Lỗi khi nộp quiz logs' });
        }
    },
};
