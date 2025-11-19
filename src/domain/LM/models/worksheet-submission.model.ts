export interface WorksheetSubmission {
  id: number;
  student_id: number;
  worksheet_id: number;
  course_id: number;
  course_week_id: number;
  attempt_number: number | null;
  score: number | null;
  review: string | null;
  submitted_at: Date | null;
  review_at: Date | null;
  submission_file_url: string | null;
  review_file_url: string | null;      // File nhận xét giáo viên đính kèm
  teacher_id: number | null;           // ID giáo viên chấm bài
}
