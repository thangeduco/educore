// src/application/learning/submit-worksheet-review.service.ts

import { LearningRepository } from '../../domain/LM/repositories/learning.repository';

export class SubmitVideoChoiceQuizLogs {
  constructor(
    private readonly learningRepo: LearningRepository,
  ) {}

  async execute(params: {
    studentId: number;
    choiceQuizId: number;
    selectedOption: string;
    isCorrect: boolean;
    answeredInSeconds: number;
    courseId: number;
  }): Promise<void> {
    const {
      studentId,
      choiceQuizId,
      selectedOption,
      isCorrect,
      answeredInSeconds,
      courseId,
    } = params;

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
