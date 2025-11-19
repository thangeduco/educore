// week-learning-stat.ts

// Interface cha chứa các thuộc tính chung cho video và worksheet
export interface LearningContent {
  content_id: string;
  content_step: number; // dùng để sắp xếp thứ tự hiển thị
  content_type: string;
}

// Interface mô tả thông tin video học tập
export interface VideoLearning extends LearningContent {
  video_title: string;
  video_url: string;
  watched_duration_minutes: number; // Thời lượng video tính bằng giây
}

// Interface mô tả thông tin worksheet (bài tập)
export interface WorksheetLearning extends LearningContent {
  worksheet_title: string;
  worksheet_url: string;
  submission_count: number;
  highest_score: number;
}

// Interface chính chứa thông tin học tập theo tuần
export interface WeeklyLearningStats {
  week_id: number;
  week_description: string;
  week_number: number;
  videos: VideoLearning[];
  worksheets: WorksheetLearning[];
}

// (Tùy chọn) Union type nếu frontend muốn gom tất cả nội dung vào chung 1 danh sách
export type LearningItem =
  | (VideoLearning & { type: 'video' })
  | (WorksheetLearning & { type: 'worksheet' });

// Interface thông tin overview của khoá học của học sinh cho phụ huynh xem
export interface StudentCourseViewForParent {
  courseId: string;
  studentId: string;
  studentName: string;
  studentAvatarUrl: string;
  studentSlogan: string;
  courseTitle: string;
  courseProgress: number;
  courseBadgeCount: number;
  courseWeekDetails: StudentCourseWeekForParent[];
}

// Interface mô tả thông tin chi tiết các tuần học cho phụ huynh
export interface StudentCourseWeekForParent {
  weekId: number; // ID của tuần học
  weekTitle: string; // Tiêu đề của tuần học
  weekDescription: string; // Nội dung của tuần học
  weekNumber: number; // Số thứ tự của tuần học
  weekProgress: number; // Tiến độ học tập của tuần (0-1)
  averageBestScore: number; // Trung bình điểm cao nhất các bài tập về nhà
  teacherReviews: string; // Nhận xét của giáo viên về tuần học
  videos: VideoLearning[]; // Danh sách video học tập trong tuần
  worksheets: WorksheetLearning[]; // Danh sách bài tập về nhà trong tuần
} 
