// src/application/services/learning.service.ts

import { LearningRepository } from '../repositories/learning.repository';
import { io } from '../../../infrastructure/common/socket/socket.server'; // ✅ Import Socket.IO instance từ hạ tầng
import { CMCourseRepository } from '../../CM/repositories/cm-course.repo';

interface BadgeAwardedEvent {
  studentId: number;
  courseId: number;
  weekId: number;
  eventId: number;
  badgeType: string;
  message: string;
  timestamp: string;
}

export class GiveBadgesForStudent {
  constructor(private readonly learningRepo: LearningRepository) { }

  /**
   * 🎥 Tặng huy hiệu khi học sinh bắt đầu xem video
   */
  async forVideoSessionStart(studentId: number, courseId: number, weekId: number, videoId: number): Promise<void> {
    const badgeType = 'student_click_video_start';
    const reason = 'Khích lệ học sinh, tạo hào hứng xem video';
    await this.give(studentId, courseId, weekId, videoId, badgeType, reason);
  }

  /**
   * 📄 Tặng huy hiệu khi học sinh nộp bài worksheet
   */
  async forWorksheetSubmission(studentId: number, courseId: number, weekId: number, worksheetId: number): Promise<void> {
    const badgeType = 'student_submit_worksheet';
    const reason = 'Hoàn thành bài tập đầy đủ, khích lệ học sinh,';
    await this.give(studentId, courseId, weekId, worksheetId, badgeType, reason);
  }

  /**
   * 🧠 Tặng huy hiệu khi học sinh đạt điểm cao
   */
  async forWorksheetHighScore(studentId: number, courseId: number, weekId: number, worksheetId: number): Promise<void> {
    const badgeType = 'student_worksheet_high_score';
    const reason = 'Làm bài tập về nhà đạt điểm cao đáng khích lệ';
    await this.give(studentId, courseId, weekId, worksheetId, badgeType, reason);
  }

  /**
   * 🌟 Core logic: Ghi nhận huy hiệu và emit socket
   */
  private async give(
    studentId: number,
    courseId: number,
    weekId: number,
    eventId: number,
    badgeType: string,
    reason: string
  ): Promise<void> {
    // Ghi nhận badge trong DB
    await this.learningRepo.giveBadgeForStudent(
      studentId,
      courseId,
      weekId,
      eventId,
      badgeType,
      reason
    );

    // Emit socket
    this.emitBadgeAwarded({
      studentId,
      courseId,
      weekId,
      eventId,
      badgeType,
      message: reason,
      timestamp: new Date().toISOString()
    });
  }

  private emitBadgeAwarded(payload: BadgeAwardedEvent): void {
    const room = `student_${payload.studentId}`;
    io.to(room).emit('badge_awarded', payload);
    console.log(`[SOCKET] 🎖️ Badge "${payload.badgeType}" sent to ${room}`);
  }
}

export class CourseLearningService {
  constructor(
    private readonly learningRepo: LearningRepository,
    private readonly courseRepo: CMCourseRepository,
  ) { }

  //Lấy tiến độ khoá học của học sinh
  async getCourseProgress(studentId: number, courseId: number): Promise<number> {

    const numWeeksOfCourse = await this.courseRepo.getNumberOfWeeksOfCourse(courseId);

    const sumWeekProgressOfStudentInCourse = await this.learningRepo.getSumWeekProgressOfStudentInCourse(studentId, courseId);

    const courseProgress = numWeeksOfCourse > 0
      ? Number((sumWeekProgressOfStudentInCourse / numWeeksOfCourse).toFixed(4))
      : 0;

    return courseProgress;
  }
}
