import { LearningRepository } from '../../domain/LM/repositories/learning.repository';
import {WeeklyLearningStats} from '../../domain/LM/models/week-learning-stat';

export class GetWeeklyLearningStatsOfStudent {
  constructor(
    private readonly learningRepo: LearningRepository,
  ) { }

  async execute(courseId: number, studentId: number, weekId: number): Promise<WeeklyLearningStats> {
    
    const weekDetailContent = await this.learningRepo.getWeeklyLearningStatsForStudent(studentId, courseId, weekId);

    // 6. Trả kết quả đầy đủ đúng theo StudentCourseDetailDto
    return weekDetailContent;
  }

}