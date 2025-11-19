import { Router } from 'express';
import { cmCourseController } from '../controllers/CM/cm-course.controller';

const router = Router();

// GET /courses/:courseCode
router.get('/courses/:courseCode', cmCourseController.getCourseByCode);











//to do refactor






router.get('/:courseId/week-detail-contents', cmCourseController.getWeekDetailContents);

router.get('/:studentId/:videoId/video-events', cmCourseController.getVideoEvents);
router.get('/:videoId/duration', cmCourseController.getVideoDuration);

// Tự động unitest giúp tôi API router.get('/:videoId/duration', courseController.getVideoDuration);
// GET /courses/:courseId/teachers


export default router;
