// src/application/CM/use-cases/cm-course.uc.ts

import { CMPgCourseRepository } from '../../../infrastructure/CM/cm-pg-course.repository';
import { CMCourseDto } from '../../dtos/course.dto';
import { CMCourse } from '../../../domain/CM/models/cm-course.model';

/**
 * Use Case: CMCourseUC
 * Chịu trách nhiệm lấy & map dữ liệu khoá học CM (cm_course)
 * sang DTO dùng cho tầng Presentation (API / FE).
 */
export class CMCourseUC {
  constructor(private repo: CMPgCourseRepository) {}

  /**
   * Lấy chi tiết khoá học theo course_code
   * (tương tự getCourses trong BMProductUC).
   */
  async getCourseByCode(courseCode: string): Promise<CMCourseDto> {
    console.info(
      `[CMCourseUC][getCourseByCode] 🔎 Lấy thông tin khoá học với course_code=${courseCode}`
    );

    const course: CMCourse | null = await this.repo.getCourseByCode(courseCode);

    if (!course) {
      console.warn(
        `[CMCourseUC][getCourseByCode] ❌ Không tìm thấy khoá học với course_code=${courseCode}`
      );
      throw new Error('Không tìm thấy khoá học');
    }

    // Map Domain → DTO (giống style map trong BMProductUC)
    const dto: CMCourseDto = {
      id: course.id,
      course_code: course.courseCode,
      title: course.title,
      description: course.description ?? null,
      grade: course.grade,
      subject: course.subject,

      // hình ảnh & asset
      sol_image_url: course.solImageUrl ?? null,
      teacher_profile_image_url: course.teacherProfileImageUrl ?? null,
      outcome_image_url: course.outcomeImageUrl ?? null,
      plan_image_url: course.planImageUrl ?? null,
      created_at: course.createdAt ?? null,
      updated_at: course.updatedAt ?? null,
    };

    return dto;
  }
}
