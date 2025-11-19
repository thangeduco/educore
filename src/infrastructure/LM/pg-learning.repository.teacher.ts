// src/infrastructure/repositories/pg-learning.repository.teacher.ts
import { pool } from '../common/db-postgres';
import { ClassSummaryNeedTeacher, StudentTaskItem, NeedTeacherReviewSummary } from '../../domain/teacher/models/teacher-view-student.dto';

export class PgLearningRepositoryTeacherStats {

  async getSummaryNeedReviewsForTeacher(teacherId: number): Promise<NeedTeacherReviewSummary> {
    const res = await pool.query(
      `
      SELECT 
    COUNT(DISTINCT ws.student_id) AS numOfStudentNeedReviewHomework,
    COUNT(DISTINCT ws.worksheet_id || '-' || ws.student_id) AS numOfHomeworkNeedReview,

    COUNT(DISTINCT CASE 
        WHEN cwp.review_number = 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id 
    END) AS numOfStudentNeedWeekReview,

    COUNT(DISTINCT CASE 
        WHEN cwp.review_number = 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id || '-' || cwp.course_week_id 
    END) AS numOfWeekNeedReview,

    COUNT(DISTINCT CASE 
        WHEN cwp.review_number > 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id 
    END) AS numOfStudentNeedUpdateWeekReview,

    COUNT(DISTINCT CASE 
        WHEN cwp.review_number > 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id || '-' || cwp.course_week_id 
    END) AS numOfWeekNeedUpdateReview

FROM user_groups ug
JOIN groups g ON ug.group_id = g.id AND g.type = 'class'
LEFT JOIN worksheet_submissions ws 
    ON ws.student_id = ug.user_id 
    AND ws.course_id = g.course_id 
    AND ws.review IS NULL
LEFT JOIN course_week_progress cwp 
    ON cwp.student_id = ug.user_id 
    AND cwp.course_id = g.course_id
WHERE g.teacher_id = $1
      `,
      [teacherId]
    );

    // kiểm tra kết quả
    if (res.rows.length === 0) {
      throw new Error(`Không tìm thấy thông tin thống kê cho giáo viên với ID ${teacherId}`);
    }

    const teacherSummary: NeedTeacherReviewSummary = {
      numOfStudentNeedReviewHomework: parseInt(res.rows[0].numofstudentneedreviewhomework, 10),
      numOfHomeworkNeedReview: parseInt(res.rows[0].numofhomeworkneedreview, 10),
      numOfStudentNeedWeekReview: parseInt(res.rows[0].numofstudentneedweekreview, 10),
      numOfWeekNeedReview: parseInt(res.rows[0].numofweekneedreview, 10),
      numOfStudentNeedUpdateWeekReview: parseInt(res.rows[0].numofstudentneedupdateweekreview, 10),
      numOfWeekNeedUpdateReview: parseInt(res.rows[0].numofweekneedupdatereview, 10),
    };
    return teacherSummary;
  }

  // Thêm comment giúp tôi


  async getSummaryNeedReviewEachClassForTeacher(teacherId: number): Promise<ClassSummaryNeedTeacher[]> {
    const res = await pool.query(
      `
      SELECT 
    ug.group_id AS classId,
    g.name AS className,

    COUNT(DISTINCT ws.student_id) AS numOfStudentPendingReviewHomework,
    COUNT(DISTINCT ws.worksheet_id || '-' || ws.student_id) AS numOfHomeworkPendingReview,
    
    COUNT(DISTINCT CASE 
        WHEN cwp.review_number = 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id END) AS numOfStudentPendingWeekReview,
    COUNT(DISTINCT CASE 
        WHEN cwp.review_number = 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id || '-' || cwp.course_week_id 
    END) AS numOfWeekPendingReview,
    
    COUNT(DISTINCT CASE 
        WHEN cwp.review_number > 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id END) AS numOfStudentPendingUpdateWeekReview,
    COUNT(DISTINCT CASE 
        WHEN cwp.review_number > 1 AND cwp.teacher_reviews IS NULL THEN cwp.student_id || '-' || cwp.course_week_id 
    END) AS numOfWeekPendingUpdateReview

FROM user_groups ug
LEFT JOIN groups g ON ug.group_id = g.id
LEFT JOIN worksheet_submissions ws 
    ON ws.student_id = ug.user_id 
    AND ws.course_id = g.course_id 
    AND ws.review IS NULL
LEFT JOIN course_week_progress cwp 
    ON cwp.student_id = ug.user_id 
    AND cwp.course_id = g.course_id
WHERE g.type = 'class'
  AND g.teacher_id = $1
GROUP BY g.course_id, ug.group_id, g.name
ORDER BY g.course_id, ug.group_id
      `,
      [teacherId]
    );
    const arrayOfclassSummaryNeedTeacher: ClassSummaryNeedTeacher[] = res.rows.map(row => ({
      classId: row.classid,
      className: row.classname,
      numOfStudentNeedReviewHomework: parseInt(row.numofstudentpendingreviewhomework, 10),
      numOfHomeworkNeedReview: parseInt(row.numofhomeworkpendingreview, 10),
      numOfStudentNeedWeekReview: parseInt(row.numofstudentpendingweekreview, 10),
      numOfWeekNeedReview: parseInt(row.numofweekpendingreview, 10),
      numOfStudentNeedUpdateWeekReview: parseInt(row.numofstudentpendingupdateweekreview, 10),
      numOfWeekNeedUpdateReview: parseInt(row.numofweekpendingupdatereview, 10),
    }));

    return arrayOfclassSummaryNeedTeacher;
  }

  async getDetailNeedReviewOfOneClassForTeacher(teacherId: number, classId: number): Promise<StudentTaskItem[]> {
    const res = await pool.query(
      `
      SELECT 
        s.id AS student_id,
        s.full_name AS student_name,
        cw.course_week_id,
        cw.week_number,
        cw.week_title,
        ws.worksheet_id,
        ws.submission_file_url,
        ws.title AS homework_title,
        ws.score,
        cw.review,
        cw.review_at
      FROM students s
      LEFT JOIN worksheet_submissions ws ON ws.student_id = s.id
      LEFT JOIN course_week_progress cw ON cw.student_id = s.id
      WHERE s.class_id = $1
      `,
      [classId]
    );

    const result: StudentTaskItem[] = [];

    for (const row of res.rows) {
      if (!row.student_id || !row.week_number) continue;

      let taskType: StudentTaskItem['taskType'] | null = null;
      if (!row.score) {
        taskType = 'Chờ chấm BTVN';
      } else if (!row.review) {
        taskType = 'Chờ nhận xét tuần';
      } else if (row.review && !row.review_at) {
        taskType = 'Chờ cập nhật nhận xét tuần';
      }

      if (taskType) {
        result.push({
          id: `${row.student_id}-${row.course_week_id}-${taskType}`,
          studentName: row.student_name,
          weekNumber: row.week_number,
          weekTitle: row.week_title,
          homeworkTitle: row.homework_title,
          homeworkFileUrl: row.submission_file_url,
          taskType,
        });
      }
    }

    return result;
  }
}
