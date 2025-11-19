import {WeeklyLearningStats} from '../../domain/LM/models/week-learning-stat';

export interface StudentCourseDetailDto {
  courseTitle: string;
  courseProgress: number;
  courseBadgeCount: number;
  weeksProgress: WeekProgressDto[];
  weekDetailContent: WeeklyLearningStats;
}

export interface WeekProgressDto {
  weekId: number;
  weekTitle: string;
  weekNumber: number;
  weekProgress: number;
  weekScore: number;
  weekTotalScore: number;
}
