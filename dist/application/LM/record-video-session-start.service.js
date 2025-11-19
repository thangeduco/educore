"use strict";
// src/application/learning/record-video-session-start.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordVideoSessionStartService = void 0;
const learing_service_1 = require("../../domain/LM/services/learing.service");
class RecordVideoSessionStartService {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    async execute(params) {
        const { studentId, courseId, weekId, videoId, startSecond, } = params;
        const sessionId = await this.learningRepo.startVideoSession({
            studentId,
            courseId,
            weekId,
            videoId,
            startSecond
        });
        // Tặng huy hiệu cho học sinh
        const giveBadgesService = new learing_service_1.GiveBadgesForStudent(this.learningRepo);
        await giveBadgesService.forVideoSessionStart(studentId, courseId, weekId, videoId);
        return sessionId;
    }
}
exports.RecordVideoSessionStartService = RecordVideoSessionStartService;
