import { pool } from '../common/db-postgres';
import { CMCourseRepository } from '../../domain/CM/repositories/cm-course.repo';
import { CMCourse, parseCMCourseRow } from '../../domain/CM/models/cm-course.model';
import { WeekDetailContent } from '../../application/dtos/week-detail-content.dto';
import { VideoEvent, VideoImageEventData, VideoChoiceQuiz, VideoAudioEventData, VideoVideoEventData, VideoChoice } from '../../domain/CM/models/video-events.model';
import { VideoLecture } from '../../domain/CM/models/video_lectures.model';
import { safeParseArray } from '../../shared/utils';
import { CourseWeek } from '../../domain/CM/models/course-week.model';
import { Worksheet } from '../../domain/CM/models/worksheets.model';

const TABLE_NAME = 'cm_courses';

export class CMPgCourseRepository implements CMCourseRepository {



  // bên trong class CMPgCourseRepository

  async getCourseByCode(courseCode: string): Promise<CMCourse | null> {
    try {
      const sql = `
      SELECT *
      FROM ${TABLE_NAME}
      WHERE course_code = $1
      LIMIT 1
    `;

      const result = await pool.query(sql, [courseCode]);

      if (!result.rows || result.rows.length === 0) {
        console.warn(
          '[CMPgCourseRepository][getCourseByCode] ❌ Không tìm thấy khoá học:',
          courseCode
        );
        return null;
      }

      // Dùng parser giống style bm-product
      return parseCMCourseRow(result.rows[0]);
    } catch (err) {
      console.error(
        '[CMPgCourseRepository][getCourseByCode] ❌ Lỗi khi query cm_course',
        err
      );
      throw err;
    }
  }



  async getNumberOfWeeksOfCourse(courseId: number): Promise<number> {

    const res = await pool.query(
      `SELECT COUNT(1) AS count FROM course_weeks WHERE course_id = $1`,
      [courseId]
    );

    const count = res.rows[0]?.count ?? 0;


    return Number(count);
  }

  async getCourseWeekDetailContents(courseId: number): Promise<WeekDetailContent[]> {
    const result = await pool.query(
      `
       SELECT 
         wc.id,
         wc.course_week_id,
         cw.week_number,
         cw.title AS week_title,
         cw.description AS week_description,
         wc.content_type,
         wc.content_id,
         wc.step,
 
         v.id AS video_id,
         v.title AS video_title,
         v.url AS video_url,
         v.duration AS video_duration,
 
         w.id AS worksheet_id,
         w.title AS worksheet_title,
         w.download_url as worksheet_download_url
 
       FROM week_contents wc
       JOIN course_weeks cw ON wc.course_week_id = cw.id
       LEFT JOIN video_lectures v ON wc.content_type = 'video' AND wc.content_id = v.id
       LEFT JOIN worksheets w ON wc.content_type = 'worksheet' AND wc.content_id = w.id
 
       WHERE cw.course_id = $1
       ORDER BY cw.week_number, wc.step
       `,
      [courseId]
    );

    return result.rows.map((row): WeekDetailContent => ({
      id: row.id,
      courseWeekId: row.course_week_id,
      weekNumber: row.week_number,
      weekTitle: row.week_title,
      weekDescription: row.week_description,
      contentType: row.content_type,
      contentId: row.content_id,
      step: row.step,
      videoLecture:
        row.content_type === 'video' && row.video_id
          ? {
            id: row.video_id,
            title: row.video_title,
            url: row.video_url,
            duration: row.video_duration,
          }
          : undefined,
      worksheet:
        row.content_type === 'worksheet' && row.worksheet_id
          ? {
            id: row.worksheet_id,
            title: row.worksheet_title,
            downloadUrl: row.worksheet_download_url,
          }
          : undefined,
    }));
  }

  async findById(videoId: number): Promise<VideoLecture | null> {
    const res = await pool.query(
      `SELECT * FROM video_lectures WHERE id = $1`,
      [videoId]
    );
    return res.rows[0] ?? null;
  }

  async getCourseWeekInfo(weekId: number): Promise<CourseWeek | null> {
    const res = await pool.query(
      `
    SELECT 
      a.id, 
      a.week_number AS "weekNumber", 
      a.title AS "weekTitle", 
      a.description AS "weekDescription", 
      a.course_id AS "courseId",
      b.title AS "courseTile", 
      b.description AS "courseDescription"
    FROM course_weeks a 
    LEFT JOIN courses b ON a.course_id = b.id 
    WHERE a.id = $1
    `,
      [weekId]
    );

    return res.rows[0] ?? null;
  }

  async getWorksheetInfo(worksheetId: number): Promise<Worksheet | null> {
    const res = await pool.query(
      `
    SELECT 
      id, 
      title, 
      description, 
      tags, 
      download_url AS "downloadUrl"
    FROM worksheets
    WHERE id = $1
    `,
      [worksheetId]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];

    const worksheet: Worksheet = {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      tags: Array.isArray(row.tags)
        ? row.tags
        : typeof row.tags === 'string'
          ? JSON.parse(row.tags)
          : [],
      downloadUrl: row.downloadUrl,
    };

    return worksheet;
  }
  //getVideoQuizEvents(videoId: number): Promise<VideoEvent[]>;
  async getVideoQuizEvents(studentId: number, videoId: number): Promise<VideoEvent[]> {

    const res = await pool.query(
      `SELECT  
    ve.id AS video_event_id,
    ve.video_id,
    ve.event_type,
    ve.start_time,
    ve.trigger_ref_id,
    ve.display_order,

    vcqe.id AS quiz_event_id,
    vcqe.content,
    vcqe.choices,
    vcqe.next_quiz_on_correct,
    vcqe.next_quiz_on_wrong,

    f.id AS feedback_id,
    f.student_id,
    f.first_audio_url,
    f.last_audio_url,
    f.correct_feedback_text,
    f.correct_feedback_audio_url,
    f.correct_feedback_animation,
    f.wrong_feedback_text,
    f.wrong_feedback_audio_url,
    f.wrong_feedback_animation

FROM video_events ve
LEFT JOIN video_choice_quizs vcqe 
    ON ve.id = vcqe.video_event_id

-- Đây là phần cập nhật quan trọng: LATERAL JOIN phụ thuộc vào vcqe.id
LEFT JOIN LATERAL (
    SELECT *
    FROM user_choice_quiz_feedback_templates f
    WHERE f.student_id = $1
      AND f.student_id + vcqe.id > 0  -- phụ thuộc để ép join từng dòng
    ORDER BY RANDOM()
    LIMIT 1
) f ON true

WHERE ve.video_id =  $2 
  AND ve.event_type = 'quiz'

ORDER BY ve.id, ve.start_time`,
      [studentId, videoId]
    );

    // Chú ý: 1 video_id có nhiều video_event_id. 1 video_event_id có nhiều quiz_event_id.
    // Cần gộp lại các quiz_event_id có cùng video_event_id vào 1 mảng các VideoChoiceQuiz
    const videoEventsMap: { [key: number]: VideoEvent } = {};
    res.rows.forEach(row => {
      if (!videoEventsMap[row.video_event_id]) {
        videoEventsMap[row.video_event_id] = {
          event_id: row.video_event_id,
          video_id: row.video_id,
          event_type: row.event_type,
          start_time: row.start_time,
          trigger_ref_id: row.trigger_ref_id,
          display_order: row.display_order,
          event_data: [] as VideoChoiceQuiz[]
        };
      }

      if (row.quiz_event_id) {
        const quizStep: VideoChoiceQuiz = {
          quiz_id: row.quiz_event_id,
          video_event_id: row.video_event_id,
          content: row.content,
          choices: safeParseArray(row.choices).map((choice: any) => ({
            id: choice.id,
            text: choice.text,
            isCorrect: choice.isCorrect,
            explanation: choice.explanation ?? undefined
          })),
          next_quiz_on_correct: row.next_quiz_on_correct ?? null,
          next_quiz_on_wrong: row.next_quiz_on_wrong ?? null,
          template_id: row.feedback_id,
          student_id: row.student_id,
          first_audio_url: row.first_audio_url,
          correct_feedback_text: row.correct_feedback_text,
          correct_feedback_audio_url: row.correct_feedback_audio_url,
          correct_feedback_animation: row.correct_feedback_animation,
          wrong_feedback_text: row.wrong_feedback_text,
          wrong_feedback_audio_url: row.wrong_feedback_audio_url,
          wrong_feedback_animation: row.wrong_feedback_animation,
          last_audio_url: row.last_audio_url
        };

        if (Array.isArray(videoEventsMap[row.video_event_id].event_data)) {
          (videoEventsMap[row.video_event_id].event_data as VideoChoiceQuiz[]).push(quizStep);
        }
      }
    });
    // Chuyển đổi từ map sang mảng
    const videoEvents: VideoEvent[] = Object.values(videoEventsMap);
    if (!videoEvents || videoEvents.length === 0) {
      console.warn(`[CMPgCourseRepository] ⚠️ Không tìm thấy quiz events cho videoId: ${videoId}`);
      return []; // hoặc có thể throw nếu muốn bắt buộc phải có dữ liệu
    }
    return videoEvents;
  }

  //getVideoAudioEvents(videoId: number): Promise<VideoEvent[]>;
  async getVideoAudioEvents(studentId: number, videoId: number): Promise<VideoEvent[]> {
    const res = await pool.query(
      `SELECT 
    ve.id AS video_event_id,
    ve.video_id,
    ve.event_type,
    ve.start_time,
    ve.trigger_ref_id,
    ve.display_order,

    f.id AS audio_profile_id,
    f.student_id,
    f.audio_url AS audio_url,
    f.display_text as display_text,
    f.animation_type as animation_type

    FROM video_events ve
   
    LEFT JOIN LATERAL (
        SELECT *
        FROM user_audio_templates f
        WHERE f.student_id = $1
        ORDER BY RANDOM()
        LIMIT 1
    ) f on 1 = 1
    where ve.video_id = $2 and ve.event_type = 'audio'
    order by ve.start_time`,
      [studentId, videoId]
    );
    return res.rows.map(row => {
      const videoEvent: VideoEvent = {
        event_id: row.video_event_id,
        video_id: row.video_id,
        event_type: row.event_type,
        start_time: row.start_time,
        trigger_ref_id: row.trigger_ref_id,
        display_order: row.display_order,
        event_data: {
          audio_profile_id: row.audio_profile_id,
          audio_url: row.audio_url,
          display_text: row.display_text,
          animation_type: row.animation_type ?? undefined,
          student_id: row.student_id
        } as VideoAudioEventData
      };
      return videoEvent;

    });

  }

  //getVideoVideoEvents(studentId: number, videoId: number): Promise<VideoEvent[]>
  async getVideoVideoEvents(studentId: number, videoId: number): Promise<VideoEvent[]> {
    const res = await pool.query(
      `SELECT 
    ve.id AS video_event_id,
    ve.video_id,
    ve.event_type,
    ve.start_time,
    ve.trigger_ref_id,
    ve.display_order,
      
    f.id AS video_profile_id,
    f.video_url AS video_url,
    f.display_text AS display_text,
    f.animation_type AS animation_type,
    f.student_id AS student_id  
    FROM video_events ve
    LEFT JOIN LATERAL (
        SELECT *
        FROM user_video_templates f
        WHERE f.student_id = $1
        ORDER BY RANDOM()
        LIMIT 1
    ) f on 1 = 1
    where ve.video_id = $2 and ve.event_type = 'video'
    order by ve.start_time`,

      [studentId, videoId]
    );
    return res.rows.map(row => {
      const videoEvent: VideoEvent = {
        event_id: row.video_event_id,
        video_id: row.video_id,
        event_type: row.event_type,
        start_time: row.start_time,
        trigger_ref_id: row.trigger_ref_id,
        display_order: row.display_order,
        event_data: {
          video_profile_id: row.video_profile_id,
          video_url: row.video_url,
          display_text: row.display_text,
          animation_type: row.animation_type ?? undefined,
          student_id: row.student_id
        } as VideoVideoEventData
      };
      return videoEvent;
    });
  }


  //getVideoImageEvents(studentId: number, videoId: number): Promise<VideoEvent[]>
  async getVideoImageEvents(studentId: number, videoId: number): Promise<VideoEvent[]> {
    const res = await pool.query(
      `SELECT 
    ve.id AS video_event_id,
    ve.video_id,
    ve.event_type,
    ve.start_time,
    ve.trigger_ref_id,
    ve.display_order,

    f.id AS image_profile_id,
    f.image_url AS image_url,
    f.display_text AS display_text,
    f.animation_type AS animation_type, 
    f.student_id AS student_id  
    FROM video_events ve
    LEFT JOIN LATERAL (
        SELECT *
        FROM user_image_templates f
        WHERE f.student_id = $1
        ORDER BY RANDOM()
        LIMIT 1
    ) f on 1 = 1
    where ve.video_id = $2 and ve.event_type = 'image'
    order by ve.start_time`,

      [studentId, videoId]
    );

    return res.rows.map(row => {
      const videoEvent: VideoEvent = {
        event_id: row.video_event_id,
        video_id: row.video_id,
        event_type: row.event_type,
        start_time: row.start_time,
        trigger_ref_id: row.trigger_ref_id,
        display_order: row.display_order,
        event_data: {
          iamge_profile_id: row.image_profile_id,
          image_url: row.image_url,
          display_text: row.display_text ?? undefined,
          animation_type: row.animation_type ?? undefined,
          student_id: row.student_id
        } as VideoImageEventData
      };
      return videoEvent;
    });
  }
}
