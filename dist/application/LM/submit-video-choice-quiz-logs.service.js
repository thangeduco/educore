"use strict";
// src/application/learning/submit-worksheet-review.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitVideoChoiceQuizLogs = void 0;
class SubmitVideoChoiceQuizLogs {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    async execute(params) {
        const { studentId, choiceQuizId, selectedOption, isCorrect, answeredInSeconds, courseId, } = params;
        await this.learningRepo.createVideoChoiceQuizLog({
            studentId,
            choiceQuizId,
            selectedOption,
            isCorrect,
            answeredInSeconds,
            courseId,
        });
    }
}
exports.SubmitVideoChoiceQuizLogs = SubmitVideoChoiceQuizLogs;
