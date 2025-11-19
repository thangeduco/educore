import {StudentCourseWeekForParent, WeeklyLearningStats} from '../models/week-learning-stat';
import { WorksheetSubmission } from '../models/worksheet-submission.model';
import { NeedTeacherReviewSummary, ClassSummaryNeedTeacher, StudentTaskItem } from '../../teacher/models/teacher-view-student.dto';
import { StudentNearProgressData } from '../../../application/dtos/student-near-progress-data.dto';

export interface LearningRepository {
  getStudentBadgeCountForCourse(studentId: number, courseId: number): Promise<number>;

  getSumWeekProgressOfStudentInCourse(studentId: number, courseId: number): Promise<number>;

  getWeeklyProgressOfStudentInCourse(studentId: number, courseId: number): Promise<
    {
      week_id: number;
      week_title: string;
      week_number: number;
      week_progress: number;
      week_scores: number;
      week_total_score: number;
    }[]
  >;

  getWeeklyLearningStatsForStudent(
    studentId: number,
    courseId: number,
    weekId: number
  ): Promise<WeeklyLearningStats>;

  getCurrentWeekId (studentId: number, courseId: number) : Promise<number>; 

  getFirstWeekId(courseId: number): Promise<number> ;
  
  // ✅ Thêm mới: bắt đầu session video
  startVideoSession(params: {
    studentId: number;
    courseId: number;
    weekId: number;
    videoId: number;
    startSecond: number;
  }): Promise<number>;

  // ✅ Thêm mới: kết thúc session video
  stopVideoSession(params: {
    sessionId: number;
    stopSecond: number;
    actualDuration: number;
  }): Promise<void>;

  getLatestAttemptNumber(studentId: number, worksheetId: number): Promise<number | null>;

  submitWorksheet(submission: WorksheetSubmission): Promise<void>;

  insertCourseWeekProgress(data: {
    student_id: number;
    course_id: number;
    course_week_id: number;
    item_score: number;
    item_type: number;
    item_id?: number;
  }): Promise<void> | null;

  /** Submits a worksheet for a student. */
  submitWorksheet(submission: WorksheetSubmission): Promise<void>;

  /** Updates review info for a submitted worksheet. */
  reviewWorksheet(data: {
    submission_id: number;
    score: number;
    review: string | null;
    teacher_id: number;
    review_file_url: string | null;
  }): Promise<void>;

  // Tặng huy hiệu cho học sinh
  giveBadgeForStudent(studentId: number, courseId: number, weekId: number, videoId: number
    , badgeType: string, adwardedReason: string
  ): Promise<void>;

  // Lấy thông tin nộp bài worksheet theo ID
  getWorksheetSubmissionById(submissionId: number): Promise<WorksheetSubmission | null>;

  //getParentViewCourseDetail(studentId, courseId) return StudentCourseViewForParent
  getCourseWeekLearningStatsForParent(
    studentId: number,
    courseId: number
  ): Promise<StudentCourseWeekForParent[]>;

  getSummaryNeedReviewsForTeacher(teacherId: number): Promise<NeedTeacherReviewSummary>;

  getSummaryNeedReviewEachClassForTeacher(teacherId: number): Promise<ClassSummaryNeedTeacher[]> ;

  getDetailNeedReviewOfOneClassForTeacher(teacherId: number, classId: number): Promise<StudentTaskItem[]>

  //getClassViewForTeacher
  getClassViewForTeacher(teacherId: number, classId: number): Promise<any>;

  //getClassSummaryForTeacher
  getClassSummaryForTeacher(teacherId: number, classId: number): Promise<any>;

  //getClassSummaryForTeacher
  getClassSummaryForTeacher(teacherId: number): Promise<ClassSummaryNeedTeacher[]>;

  //getNearProgressSummaryForStudent
  getNearProgressSummaryForStudent(studentId: number, courseId: number): Promise<StudentNearProgressData[]>;

  //createVideoChoiceQuizLog
  createVideoChoiceQuizLog(params: {
    studentId: number;
    choiceQuizId: number;
    selectedOption: string;
    isCorrect: boolean;
    answeredInSeconds: number;
    courseId: number;
  }): Promise<void>;

  //get7DayTeacherReviewsOfStudent
  get7DayTeacherReviewsOfStudent(
        studentId: number,
        courseId: number
    ): Promise<Array<{ get_day: string; teacher_reviews: string }>>;

  // Lấy số lượng huy hiệu học sinh đã nhận trong 7 ngày gần đây theo từng ngày
  get7DayBadgesOfStudent(studentId: number, courseId: number): Promise<Array<{ get_day: string; badge_count: number }>>;

    // Lấy số lượng video học sinh đã xem trong 7 ngày gần đây
  get7DayVideosOfStudent(studentId: number, courseId: number): Promise<Array<{ get_day: string; video_count: number }>>;

    // Lấy số lượng bài tập về nhà học sinh đã hoàn thành trong 7 ngày gần đây
  get7DayHomeworkOfStudent(studentId: number, courseId: number): Promise<Array<{ get_day: string; homework_count: number }>>;

    // Lấy xếp hạng mức độ nỗ lực của học sinh trong 7 ngày gần đây
  get7DayEffortRankingOfStudent(studentId: number, courseId: number): Promise<Array<{ get_day: string; effort_ranking: number }>>;

  // Lấy số lượng câu hỏi trả lời đúng ở phần choi quiz
  get7DayVideoChoiceQuizCorrectCountOfStudent(studentId: number, courseId: number): Promise<Array<{ get_day: string; correct_count: number }>>;

}
