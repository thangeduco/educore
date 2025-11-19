// src/domain/CM/cm-repos/cm-course.repo.ts

import { CMCourse } from '../models/cm-course.model';
import { WeekDetailContent } from '../../../application/dtos/week-detail-content.dto';

import { VideoEvent } from '../models/video-events.model';
import { VideoLecture } from '../models/video_lectures.model';
import { CourseWeek } from '../models/course-week.model';
import { Worksheet } from '../models/worksheets.model';

/**
 * Repository interface cho cm_course và các thực thể liên quan.
 *
 * Định nghĩa các hàm typed để:
 *  - Lấy thông tin khóa học (CMCourse)
 *  - Lấy thông tin tuần học, worksheet
 *  - Lấy nội dung chi tiết của khóa theo tuần
 *  - Lấy các sự kiện tương tác video (quiz, audio, video, image)
 */
export interface CMCourseRepository {
  // =====================================================
  // KHÓA HỌC (COURSE)
  // =====================================================

  /**
   * Lấy thông tin khóa học (cm_course) theo course_code.
   *
   * @param courseCode Mã khóa học (cm_course.course_code)
   * @returns CMCourse hoặc null nếu không tìm thấy
   */
  getCourseByCode(courseCode: string): Promise<CMCourse | null>;

  /**
   * Lấy nội dung chi tiết theo tuần của một khóa học.
   * Bao gồm thông tin tuần, video, worksheet... (tùy theo DTO WeekDetailContent).
   *
   * @param courseId ID của khóa học (cm_course.id)
   */
  getCourseWeekDetailContents(courseId: number): Promise<WeekDetailContent[]>;

  /**
   * Lấy tổng số tuần học của một khóa.
   *
   * @param courseId ID khóa học
   * @returns Số tuần (number)
   */
  getNumberOfWeeksOfCourse(courseId: number): Promise<number>;

  // =====================================================
  // VIDEO LECTURE / WEEK / WORKSHEET
  // =====================================================

  /**
   * Lấy thông tin video bài giảng theo ID.
   *
   * Lưu ý: Hàm này hiện đang dùng tên findById (giữ nguyên để không phá code cũ),
   * nhưng thực chất là find VideoLecture by id.
   *
   * @param videoId ID video bài giảng
   */
  findById(videoId: number): Promise<VideoLecture | null>;

  /**
   * Lấy thông tin tuần học (course_week) theo ID.
   *
   * @param weekId ID tuần học
   */
  getCourseWeekInfo(weekId: number): Promise<CourseWeek | null>;

  /**
   * Lấy thông tin worksheet theo ID.
   *
   * @param worksheetId ID worksheet
   */
  getWorksheetInfo(worksheetId: number): Promise<Worksheet | null>;

  // =====================================================
  // VIDEO EVENTS (QUIZ / AUDIO / VIDEO / IMAGE)
  // =====================================================

  /**
   * Lấy danh sách sự kiện quiz (câu hỏi tương tác) cho 1 video
   * ứng với 1 học sinh.
   *
   * @param studentId ID học sinh
   * @param videoId ID video
   */
  getVideoQuizEvents(studentId: number, videoId: number): Promise<VideoEvent[]>;

  /**
   * Lấy danh sách sự kiện audio (âm thanh) cho 1 video
   * ứng với 1 học sinh.
   *
   * @param studentId ID học sinh
   * @param videoId ID video
   */
  getVideoAudioEvents(studentId: number, videoId: number): Promise<VideoEvent[]>;

  /**
   * Lấy danh sách sự kiện video (nhánh video) cho 1 video
   * ứng với 1 học sinh.
   *
   * @param studentId ID học sinh
   * @param videoId ID video
   */
  getVideoVideoEvents(studentId: number, videoId: number): Promise<VideoEvent[]>;

  /**
   * Lấy danh sách sự kiện image (ảnh / pop-up hình ảnh) cho 1 video
   * ứng với 1 học sinh.
   *
   * @param studentId ID học sinh
   * @param videoId ID video
   */
  getVideoImageEvents(studentId: number, videoId: number): Promise<VideoEvent[]>;
}
