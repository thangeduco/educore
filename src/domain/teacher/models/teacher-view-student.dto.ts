// src/models/teacher.model.ts

// === Kiểu dữ liệu học sinh cần xử lý trong lớp học ===
export interface StudentTaskItem {
  id: string;
  studentName: string;
  weekNumber: number;
  weekTitle: string;
  homeworkTitle: string;
  homeworkFileUrl: string;
  taskType: 'Chờ chấm BTVN' | 'Chờ nhận xét tuần' | 'Chờ cập nhật nhận xét tuần';
}

export interface NeedTeacherReviewSummary {
  numOfStudentNeedReviewHomework: number;
  numOfHomeworkNeedReview: number;

  numOfStudentNeedWeekReview: number;
  numOfWeekNeedReview: number;

  numOfStudentNeedUpdateWeekReview: number;
  numOfWeekNeedUpdateReview: number;
}


// === Kiểu dữ liệu lớp học mà giáo viên phụ trách ===
export interface ClassSummaryNeedTeacher {
  classId: string;
  className: string;

  numOfStudentNeedReviewHomework: number;
  numOfHomeworkNeedReview: number;

  numOfStudentNeedWeekReview: number;
  numOfWeekNeedReview: number;

  numOfStudentNeedUpdateWeekReview: number;
  numOfWeekNeedUpdateReview: number;
}

// === Kiểu dữ liệu tổng quan dashboard của giáo viên ===
export interface WorksheetNeedReviewOfStudent {
  studentName: string;
  weekId: number;
  weekNumber: number;
  weekTitle: string;
  worksheetId: number;
  worksheetTitle: string;
  submissionId: number;
  submissionFileUrl: string;
  attemptNnumber: number;
}

export interface WeekNeedReviewOfStudent {
  studentName: string;
  weekId: number;
  weekNumber: number;
  teacherReviews: string;
  reviewNumber: number;
  reviewAt: number;  
}
