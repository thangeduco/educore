// src/infrastructure/repositories/pg-learning.repository.ts
import { LearningRepository } from '../../domain/LM/repositories/learning.repository';
import { PgLearningRepositoryCore } from './pg-learning.repository.core';
import { PgLearningRepositoryParentStats } from './pg-learning.repository.parent';
import { PgLearningRepositoryTeacherStats } from './pg-learning.repository.teacher';
import { StudentCourseWeekForParent } from '../../domain/LM/models/week-learning-stat';
import { ClassSummaryNeedTeacher, StudentTaskItem, NeedTeacherReviewSummary } from '../../domain/teacher/models/teacher-view-student.dto';

export class PgLearningRepository
  extends PgLearningRepositoryCore
  implements LearningRepository {

  private parentStatsRepo = new PgLearningRepositoryParentStats();
  private teacherStatsRepo = new PgLearningRepositoryTeacherStats();

  async getCourseWeekLearningStatsForParent(
    studentId: number,
    courseId: number
  ): Promise<StudentCourseWeekForParent[]> {
    return this.parentStatsRepo.getCourseWeekLearningStatsForParent(studentId, courseId);
  }
//getSummaryNeedReviewsForTeacher; Các nội dung cần giáo viên review
  async getSummaryNeedReviewsForTeacher(teacherId: number): Promise<NeedTeacherReviewSummary> {
    return this.teacherStatsRepo.getSummaryNeedReviewsForTeacher(teacherId);
  }

//getSummaryNeedReviewEachClassForTeacher: Các nội dung của từng lớp học cần giáo viên review
  async getSummaryNeedReviewEachClassForTeacher(teacherId: number): Promise<ClassSummaryNeedTeacher[]> {
    return this.teacherStatsRepo.getSummaryNeedReviewEachClassForTeacher(teacherId);
  }
// getDetailNeedReviewOfOneClassForTeacher: Chi tiết các nội dung của 1 lớp học cần giáo viên reivew
  async getDetailNeedReviewOfOneClassForTeacher(teacherId: number, classId: number): Promise<StudentTaskItem[]> {
    return this.teacherStatsRepo.getDetailNeedReviewOfOneClassForTeacher(teacherId, classId);
  }
//getClassViewForTeacher
  async getClassViewForTeacher(teacherId: number, classId: number): Promise<any> {
    return []; // Chưa triển khai
  }
//getClassSummaryForTeacher
  async getClassSummaryForTeacher(teacherId: number): Promise<ClassSummaryNeedTeacher[]> {
    return []; // Chưa triển khai
  }

  // Các phương thức khác từ PgLearningRepositoryCore sẽ được kế thừa
  // và không cần phải định nghĩa lại ở đây.

  // Ví dụ:
  // insertCourseWeekProgress, submitWorksheet, reviewWorksheet, etc.
} 
