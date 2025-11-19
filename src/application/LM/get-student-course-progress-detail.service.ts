import { LearningRepository } from '../../domain/LM/repositories/learning.repository';
import { CMCourseRepository } from '../../domain/CM/repositories/cm-course.repo';
import { StudentCourseDetailDto } from '../dtos/student-course-detail.dto';
import { WeekProgressDto} from '../dtos/student-course-detail.dto';
import {CourseLearningService} from '../../domain/LM/services/learing.service';

export class GetStudentCourseProgressDetailService {
  constructor(
    private readonly learningRepo: LearningRepository,
    private readonly courseRepo: CMCourseRepository,

  ) { }

  async execute(courseId: number, studentId: number): Promise<StudentCourseDetailDto> {
    // 1. Lấy tiêu đề khoá học từ courseRepo
    const course = await this.courseRepo.getCourseByCode(String(courseId));
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    const courseTitle = course.title;

    // 2. Lấy số lượng huy hiệu của học sinh trong khoá học từ learningRepo
    const courseBadgeCount = await this.learningRepo.getStudentBadgeCountForCourse(studentId, courseId);

    // 3. Lấy tiến độ tổng thể khoá học từ gọi vào CourseLearningService ở file learing.service.ts
    const courseLearningService = new CourseLearningService(this.learningRepo, this.courseRepo);
    const courseProgress = await courseLearningService.getCourseProgress(studentId, courseId);

    // 4. Lấy danh sách tiến độ từng tuần học
    const rawWeeklyProgress = await this.learningRepo.getWeeklyProgressOfStudentInCourse(studentId, courseId);
    const weeksProgress: WeekProgressDto[] = rawWeeklyProgress.map((row) => ({
      weekId: row.week_id,
      weekTitle: row.week_title,
      weekNumber : row.week_number,
      weekProgress: Number(row.week_progress ?? 0),
      weekScore: Number(row.week_scores ?? 0),
      weekTotalScore: Number(row.week_total_score ?? 0),
    }));

    // 5. Lấy thông tin chi tiết nội dung của tuần học trước đó học sinh đang xem video
    let viewDetailWeekId = await this.learningRepo.getCurrentWeekId(studentId, courseId);
    if (!viewDetailWeekId || viewDetailWeekId < 1) {
      viewDetailWeekId = await this.learningRepo.getFirstWeekId(courseId );
    }
    const weekDetailContent = await this.learningRepo.getWeeklyLearningStatsForStudent(studentId, courseId, viewDetailWeekId);

    // 6. Trả kết quả đầy đủ đúng theo StudentCourseDetailDto
    return {
      courseTitle: courseTitle,  // lưu ý lỗi đánh máy ở đây: "courseTitle"
      courseProgress: Number(courseProgress.toFixed(4)),
      courseBadgeCount,
      weeksProgress,
      weekDetailContent,
    };
  }

}