"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmCourseController = void 0;
const cm_course_uc_1 = require("../../../application/CM/use-cases/cm-course.uc");
const cm_pg_course_repository_1 = require("../../../infrastructure/CM/cm-pg-course.repository");
const get_week_detail_contents_service_1 = require("../../../application/CM/get-week-detail-contents.service");
const get_video_events_service_1 = require("../../../application/CM/get-video-events.service");
const get_video_duration_service_1 = require("../../../application/CM/get-video-duration.service");
// Khởi tạo service
const courseRepo = new cm_pg_course_repository_1.CMPgCourseRepository();
const courseUC = new cm_course_uc_1.CMCourseUC(courseRepo);
const getWeekDetailContentsService = new get_week_detail_contents_service_1.GetWeekDetailContentsService(courseRepo);
const getVideoEventService = new get_video_events_service_1.GetVideoEventService(courseRepo);
const getVideoDurationService = new get_video_duration_service_1.GetVideoDurationService(courseRepo);
exports.cmCourseController = {
    async getCourseByCode(req, res) {
        try {
            const { courseCode } = req.params;
            if (!courseCode || typeof courseCode !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'courseCode không hợp lệ',
                });
            }
            console.info('[cmCourseController][getCourseByCode] Lấy thông tin khoá học với course_code =', courseCode);
            const course = await courseUC.getCourseByCode(courseCode);
            return res.status(200).json({
                success: true,
                data: course,
            });
        }
        catch (err) {
            console.error('[cmCourseController][getCourseByCode] ❌ Lỗi', err);
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy khoá học',
                message: err?.message,
            });
        }
    },
    async getWeekDetailContents(req, res) {
        try {
            const courseId = Number(req.params.courseId);
            if (isNaN(courseId)) {
                return res.status(400).json({ error: 'courseId không hợp lệ' });
            }
            const result = await getWeekDetailContentsService.execute(courseId);
            return res.status(200).json(result);
        }
        catch (err) {
            console.error('[courseController][getWeekDetailContents]', err);
            return res.status(500).json({ error: 'Lỗi khi lấy danh sách tuần học' });
        }
    },
    async getVideoEvents(req, res) {
        try {
            const studentId = Number(req.params.studentId);
            const videoId = Number(req.params.videoId);
            if (isNaN(videoId)) {
                return res.status(400).json({ error: 'VideoId  không hợp lệ' });
            }
            const events = await getVideoEventService.execute(studentId, videoId);
            res.status(200).json(events);
        }
        catch (err) {
            console.error('[courseController][getVideoEvents]', err);
            res.status(404).json({ error: err.message || 'Không tìm thấy video events' });
        }
    },
    async getVideoDuration(req, res) {
        try {
            const videoId = Number(req.params.videoId);
            if (isNaN(videoId)) {
                return res.status(400).json({ error: 'videoId không hợp lệ' });
            }
            const duration = await getVideoDurationService.execute(videoId);
            res.status(200).json({ videoId, duration });
        }
        catch (err) {
            console.error('[courseController][getVideoDuration]', err);
            res.status(404).json({ error: err.message || 'Không tìm thấy thời lượng video' });
        }
    },
};
