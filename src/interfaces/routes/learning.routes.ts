import { Router } from 'express';
import { learningController } from '../controllers/LM/learning.controller';
import path from 'path';
import multer from 'multer';

const router = Router();

const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// for students

router.get('/student/:studentId/courses/:courseId/progress-detail', learningController.getCourseProgressDetailOfStudent);

router.get('/student/:studentId/courses/:courseId/weeks/:weekId/weekly-stats', learningController.getWeeklyLearningStatsOfStudent);

router.post('/video-sessions/start', learningController.startVideoSession);
router.patch('/video-sessions/:sessionId/stop', learningController.stopVideoSession);

router.post(
  '/worksheet-submissions/submit',
  upload.single('submission_file'), // Thêm dòng này để nhận file từ FormData
  learningController.submitWorksheet
);
//router.post('/worksheet-submissions/review', upload.single('review_file'), controller.submitWorksheetReview);
router.post(
  '/worksheet-submissions/review',
  upload.single('review_file'),
  learningController.submitWorksheetReview
);

//learning/student/${studentId}/progress-summary
router.get('/student/:studentId/courses/:courseId/near-progress-summary', learningController.getNearProgressSummaryOfStudent);

//apiEducoreBE.post(`/learning/student/${payload.student_id}/courses/${payload.course_id}/video-choice-quiz-logs`, payload);
router.post('/student/:studentId/courses/:courseId/video-choice-quiz-logs', learningController.submitVideoChoiceQuizLogs);








// for parents

//const response = await apiEducoreBE.get(`/learning/parent-view/students/${studentId}/courses/${courseId}`);
router.get('/parent-view-stat/students/:studentId/courses/:courseId', learningController.getParentViewCourseStat);

// for teacher-view
//apiEducoreBE.get('/learning/teacher-view/class-summary');
router.get('/learning/teacher-view/class-summary', learningController.getClassSummaryForTeacher);
//apiEducoreBE.get(`/learning/teacher-view/class/${classId}/students`);
router.get('/learning/teacher-view/class/:classId/students', learningController.getClassViewForTeacher);

export default router;