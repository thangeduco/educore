// src/application/learning/record-video-session-start.service.ts

import { LearningRepository } from '../../domain/LM/repositories/learning.repository';
import { GiveBadgesForStudent } from '../../domain/LM/services/learing.service';

export class RecordVideoSessionStartService {
  constructor(
    private readonly learningRepo: LearningRepository,
  ) {}

  async execute(params: {
    studentId: number;
    courseId: number;
    weekId: number;
    videoId: number;
    startSecond: number;
  }): Promise<number> {
    const {
      studentId,
      courseId,
      weekId,
      videoId,
      startSecond,
    } = params;

    
    const sessionId = await this.learningRepo.startVideoSession({
      studentId,
      courseId,
      weekId,
      videoId,
      startSecond
    });

    // Tặng huy hiệu cho học sinh
    const giveBadgesService = new GiveBadgesForStudent(this.learningRepo);
    await giveBadgesService.forVideoSessionStart(studentId, courseId, weekId, videoId);

    return sessionId;
  }
}
