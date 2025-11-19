// src/application/learning/record-video-session-stop.service.ts

import { LearningRepository } from '../../domain/LM/repositories/learning.repository';

export class RecordVideoSessionStopService {
  constructor(
    private readonly learningRepo: LearningRepository,
  ) {}

  async execute(params: {
    sessionId: number;
    stopSecond: number;
    actualDuration: number;
  }): Promise<void> {
    const {
      sessionId,
      stopSecond,
      actualDuration,
    } = params;

    await this.learningRepo.stopVideoSession({
      sessionId,
      stopSecond,
      actualDuration,
    });
  }
}
