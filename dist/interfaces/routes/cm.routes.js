"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cm_course_controller_1 = require("../controllers/CM/cm-course.controller");
const router = (0, express_1.Router)();
// GET /courses/:courseCode
router.get('/courses/:courseCode', cm_course_controller_1.cmCourseController.getCourseByCode);
//to do refactor
router.get('/:courseId/week-detail-contents', cm_course_controller_1.cmCourseController.getWeekDetailContents);
router.get('/:studentId/:videoId/video-events', cm_course_controller_1.cmCourseController.getVideoEvents);
router.get('/:videoId/duration', cm_course_controller_1.cmCourseController.getVideoDuration);
// Tự động unitest giúp tôi API router.get('/:videoId/duration', courseController.getVideoDuration);
// GET /courses/:courseId/teachers
exports.default = router;
