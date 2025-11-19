"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learning_controller_1 = require("../controllers/LM/learning.controller");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: path_1.default.join(__dirname, '../../uploads'),
    limits: { fileSize: 50 * 1024 * 1024 },
});
// for students
router.get('/student/:studentId/courses/:courseId/progress-detail', learning_controller_1.learningController.getCourseProgressDetailOfStudent);
router.get('/student/:studentId/courses/:courseId/weeks/:weekId/weekly-stats', learning_controller_1.learningController.getWeeklyLearningStatsOfStudent);
router.post('/video-sessions/start', learning_controller_1.learningController.startVideoSession);
router.patch('/video-sessions/:sessionId/stop', learning_controller_1.learningController.stopVideoSession);
router.post('/worksheet-submissions/submit', upload.single('submission_file'), // Thêm dòng này để nhận file từ FormData
learning_controller_1.learningController.submitWorksheet);
//router.post('/worksheet-submissions/review', upload.single('review_file'), controller.submitWorksheetReview);
router.post('/worksheet-submissions/review', upload.single('review_file'), learning_controller_1.learningController.submitWorksheetReview);
//learning/student/${studentId}/progress-summary
router.get('/student/:studentId/courses/:courseId/near-progress-summary', learning_controller_1.learningController.getNearProgressSummaryOfStudent);
//apiEducoreBE.post(`/learning/student/${payload.student_id}/courses/${payload.course_id}/video-choice-quiz-logs`, payload);
router.post('/student/:studentId/courses/:courseId/video-choice-quiz-logs', learning_controller_1.learningController.submitVideoChoiceQuizLogs);
// for parents
//const response = await apiEducoreBE.get(`/learning/parent-view/students/${studentId}/courses/${courseId}`);
router.get('/parent-view-stat/students/:studentId/courses/:courseId', learning_controller_1.learningController.getParentViewCourseStat);
// for teacher-view
//apiEducoreBE.get('/learning/teacher-view/class-summary');
router.get('/learning/teacher-view/class-summary', learning_controller_1.learningController.getClassSummaryForTeacher);
//apiEducoreBE.get(`/learning/teacher-view/class/${classId}/students`);
router.get('/learning/teacher-view/class/:classId/students', learning_controller_1.learningController.getClassViewForTeacher);
exports.default = router;
