"use strict";
// src/application/learning/record-video-session-stop.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordVideoSessionStopService = void 0;
class RecordVideoSessionStopService {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    async execute(params) {
        const { sessionId, stopSecond, actualDuration, } = params;
        await this.learningRepo.stopVideoSession({
            sessionId,
            stopSecond,
            actualDuration,
        });
    }
}
exports.RecordVideoSessionStopService = RecordVideoSessionStopService;
