// src/application/learning/get-class-view-for-teacher.service.ts

import { LearningRepository } from '../../domain/LM/repositories/learning.repository';
import { StudentTaskItem } from '../../domain/teacher/models/teacher-view-student.dto';

export class GetClassViewForTeacherService {
  constructor(private readonly learningRepo: LearningRepository) {}

  async execute(params: {
    teacher_id: number;
    class_id: number;
  }): Promise<StudentTaskItem[]> {
    console.log('[GetClassViewForTeacherService][execute] Input:', params);

    const { teacher_id, class_id } = params;

    if (!teacher_id || isNaN(teacher_id)) {
      throw new Error('Tham số teacher_id không hợp lệ');
    }

    if (!class_id || isNaN(class_id)) {
      throw new Error('Tham số class_id không hợp lệ');
    }

    const studentTasks = await this.learningRepo.getClassViewForTeacher(
      teacher_id,
      class_id
    );

    if (!Array.isArray(studentTasks)) {
      throw new Error('Dữ liệu học sinh không hợp lệ');
    }

    console.log(
      `[GetClassViewForTeacherService][execute] Output (${studentTasks.length} học sinh):`,
      studentTasks
    );

    return studentTasks;
  }
}
