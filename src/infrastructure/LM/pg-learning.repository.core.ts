// src/infrastructure/repositories/pg-learning.repository.core.ts
import { pool } from '../common/db-postgres';
import { WorksheetSubmission } from '../../domain/LM/models/worksheet-submission.model';
import { WeeklyLearningStats } from '../../domain/LM/models/week-learning-stat';
import { StudentNearProgressData } from '../../application/dtos/student-near-progress-data.dto';

export class PgLearningRepositoryCore {
    async getStudentBadgeCountForCourse(studentId: number, courseId: number): Promise<number> {

        const res = await pool.query(
            `SELECT COUNT(1) AS count
       FROM student_badges
       WHERE student_id = $1 AND course_id = $2`,
            [studentId, courseId]
        );

        const count = parseInt(res.rows[0]?.count || '0', 10);

        return count;
    }

    // tặng huy hiệu cho học sinh
    async giveBadgeForStudent(studentId: number, courseId: number, weekId: number, videoId: number
        , badgeType: string, adwardedReason: string
    ): Promise<void> {
        await pool.query(
            `INSERT INTO student_badges (id, student_id, course_id, course_week_id, event_id, badge_type, awarded_reason, awarded_at)
       VALUES (nextval('student_badges_id_seq'::regclass), $1, $2, $3, $4, $5, $6, NOW())`,
            [studentId, courseId, weekId, videoId, badgeType, adwardedReason]
        );
    }

    async getSumWeekProgressOfStudentInCourse(studentId: number, courseId: number): Promise<number> {

        const res = await pool.query(
            `
      SELECT 
        SUM(COALESCE(b.week_scores, 0) * 1.0 / a.week_max_scores) AS total_ratio
      FROM (
        SELECT course_week_id, SUM(max_score) AS week_max_scores 
        FROM week_contents
        WHERE course_id = $1
        GROUP BY course_week_id
      ) a
      LEFT JOIN (
        SELECT course_week_id, average_best_score AS week_scores
        FROM course_week_progress
          WHERE student_id = $2 AND course_id = $1
        ) b 
      ON a.course_week_id = b.course_week_id
      `,
            [courseId, studentId]
        );

        const ratio = res.rows[0]?.total_ratio ?? 0;

        return Number(ratio);
    }

    async getWeeklyProgressOfStudentInCourse(studentId: number, courseId: number): Promise<
        {
            week_id: number;
            week_title: string;
            week_number: number;
            week_progress: number;
            week_scores: number;
            week_total_score: number;
        }[]
    > {

        const res = await pool.query(
            `
      SELECT a.course_week_id AS week_id, a.title AS week_title, a.week_number,
            b.average_best_score as week_scores, b.week_progress as week_progress,
            a.week_max_scores AS week_total_score
      FROM ( SELECT  wc.course_week_id, c.title, c.week_number, SUM(wc.max_score) AS week_max_scores 
             FROM week_contents wc LEFT JOIN course_weeks c ON wc.course_week_id = c.id 
            WHERE wc.course_id = $1
            GROUP BY wc.course_week_id, c.title, c.week_number ) a
      LEFT JOIN course_week_progress b on a.course_week_id = b.course_week_id and student_id = $2 AND course_id = $1
      ORDER BY a.course_week_id
      `,
            [courseId, studentId]
        );

        return res.rows.map((row) => ({
            week_id: row.week_id,
            week_title: row.week_title,
            week_number: row.week_number,
            week_progress: Number(row.week_progress ?? 0),
            week_scores: Number(row.week_scores ?? 0),
            week_total_score: Number(row.week_total_score ?? 0),
        }));
    }

    async getWeeklyLearningStatsForStudent(
        studentId: number,
        courseId: number,
        weekId: number
    ): Promise<WeeklyLearningStats> {
        const res = await pool.query(
            `
    SELECT 
      a.course_week_id AS week_id,
      e.description AS week_description,
      e.week_number,
      a.content_id,
      a.step AS content_step,
      a.content_type,
      b.title AS video_title,
      b.url AS video_url,
      c.title AS worksheet_title,
      c.download_url AS worksheet_url,
      d.num_of_submission AS submission_count,
      d.highest_score
    FROM week_contents a
    LEFT JOIN course_weeks e ON a.course_week_id = e.id
    LEFT JOIN video_lectures b ON a.content_id = b.id AND a.content_type = 'video'
    LEFT JOIN worksheets c ON a.content_id = c.id AND a.content_type = 'worksheet'
    LEFT JOIN (
      SELECT 
        course_week_id,
        worksheet_id,
        COUNT(1) AS num_of_submission,
        MAX(score) AS highest_score 
      FROM worksheet_submissions
      WHERE student_id = $1 AND course_id = $2
      GROUP BY course_week_id, worksheet_id
    ) d 
    ON a.course_week_id = d.course_week_id 
    AND a.content_id = d.worksheet_id 
    AND a.content_type = 'worksheet'
    WHERE a.course_id = $2 AND a.course_week_id = $3
    ORDER BY a.course_week_id, a.step
    `,
            [studentId, courseId, weekId]
        );

        const rows = res.rows;

        if (rows.length === 0) {
            throw new Error('No learning data found for the specified week');
        }

        const { week_id, week_description, week_number } = rows[0];

        const videos = rows
            .filter(r => r.content_type === 'video')
            .map(r => ({
                content_id: r.content_id,
                content_step: r.content_step,
                content_type: r.content_type,
                video_title: r.video_title,
                video_url: r.video_url,
                watched_duration_minutes: parseFloat(r.watched_duration_minutes || '0')
            }));

        const worksheets = rows
            .filter(r => r.content_type === 'worksheet')
            .map(r => ({
                content_id: r.content_id,
                content_step: r.content_step,
                content_type: r.content_type,
                worksheet_title: r.worksheet_title,
                worksheet_url: r.worksheet_url,
                submission_count: parseInt(r.submission_count || '0', 10),
                highest_score: parseFloat(r.highest_score || '0')
            }));

        return {
            week_id,
            week_description,
            week_number,
            videos,
            worksheets
        };
    }


    async getCurrentWeekId(studentId: number, courseId: number): Promise<number> {

        const res = await pool.query(
            `SELECT course_week_id
      FROM video_sessions
      where student_id = $1 and course_id = $2
      ORDER BY start_at DESC
      LIMIT 1`,
            [studentId, courseId]
        );

        const courseWeekId = parseInt(res.rows[0]?.course_week_id || '0', 10);

        return courseWeekId;
    }

    async getFirstWeekId(courseId: number): Promise<number> {

        const res = await pool.query(
            `select id  from course_weeks
        where course_id = $1
        order by week_number
        limit 1`,
            [courseId]
        );
        const id = parseInt(res.rows[0]?.id || '0', 10);
        return id;
    }



    // ✅ Ghi nhận bắt đầu video session
    async startVideoSession(params: {
        studentId: number;
        courseId: number;
        weekId: number;
        videoId: number;
        startSecond: number;
    }): Promise<number> {

        const res = await pool.query(
            `
      INSERT INTO video_sessions (
        id,
        student_id, 
        course_id, 
        course_week_id, 
        video_lecture_id, 
        start_second, 
        start_at
      ) VALUES (nextval('video_sessions_id_seq'), $1, $2, $3, $4, $5, NOW())
      RETURNING id
      `,
            [params.studentId, params.courseId, params.weekId, params.videoId, params.startSecond]
        );

        const sessionId = parseInt(res.rows[0]?.id || '0', 10);
        return sessionId;
    }

    // ✅ Cập nhật khi kết thúc session
    async stopVideoSession(params: {
        sessionId: number;
        stopSecond: number;
        actualDuration: number;
    }): Promise<void> {
        await pool.query(
            `
      UPDATE video_sessions
      SET 
        stop_at = NOW(),
        stop_second = $2,
        actual_duration = $3
      WHERE id = $1
      `,
            [
                params.sessionId,
                params.stopSecond,
                params.actualDuration,
            ]
        );
    }

    async getLatestAttemptNumber(studentId: number, worksheetId: number): Promise<number | null> {
        const result = await pool.query(
            `SELECT attempt_number FROM worksheet_submissions
     WHERE student_id = $1 AND worksheet_id = $2
     ORDER BY submitted_at DESC NULLS LAST
     LIMIT 1`,
            [studentId, worksheetId]
        );

        const row = result.rows[0];
        return row ? Number(row.attempt_number) : null;
    }

    async insertCourseWeekProgress(data: {
        student_id: number;
        course_id: number;
        course_week_id: number;
        item_score: number;
        item_type: number;
        item_id?: number;
    }): Promise<void> {
        await pool.query(
            `INSERT INTO course_week_progress
     (student_id, course_id, course_week_id, item_score, item_type, completed_at, item_id)
     VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
            [
                data.student_id,
                data.course_id,
                data.course_week_id,
                data.item_score,
                data.item_type,
                data.item_id ?? null // đảm bảo không undefined
            ]
        );
    }



    async submitWorksheet(submission: WorksheetSubmission): Promise<void> {
        await pool.query(
            `INSERT INTO worksheet_submissions (
       student_id, worksheet_id, course_id, course_week_id,
       attempt_number, score, review, submission_file_url, submitted_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())`,
            [
                submission.student_id,
                submission.worksheet_id,
                submission.course_id,
                submission.course_week_id,
                submission.attempt_number,
                submission.score ?? null,
                submission.review ?? null,
                submission.submission_file_url ?? null
            ]
        );
    }

    async reviewWorksheet(data: {
        submission_id: number;
        score: number;
        review: string | null;
        teacher_id: number;
        review_file_url: string | null;
    }): Promise<void> {
        await pool.query(
            `UPDATE worksheet_submissions
       SET score = $1,
           review = $2,
           review_at = now (),
           teacher_id = $3,
           review_file_url = $4
       WHERE id = $5`,
            [
                data.score,
                data.review,
                data.teacher_id,
                data.review_file_url,
                data.submission_id,
            ]
        );
    }

    //Code hàm lấy thông tin worksheet_submissions theo truy vấn dưới và trả lại kết quả là worksheet-submission.model.ts
    async getWorksheetSubmissionById(id: number): Promise<WorksheetSubmission | null> {
        const res = await pool.query(
            `SELECT id, student_id, worksheet_id, course_week_id, attempt_number, 
              score, review, submitted_at, course_id, review_at, 
              submission_file_url, review_file_url, teacher_id
       FROM worksheet_submissions
       WHERE id = $1`,
            [id]
        );

        if (res.rows.length === 0) {
            return null;
        }

        const row = res.rows[0];
        return {
            id: row.id,
            student_id: row.student_id,
            worksheet_id: row.worksheet_id,
            course_week_id: row.course_week_id,
            attempt_number: row.attempt_number,
            score: row.score,
            review: row.review,
            submitted_at: row.submitted_at,
            course_id: row.course_id,
            review_at: row.review_at,
            submission_file_url: row.submission_file_url,
            review_file_url: row.review_file_url,
            teacher_id: row.teacher_id
        };
    }

    //getClassViewForTeacher. Need to move to pg-learning.repository.teacher.ts
    async getClassViewForTeacher(teacherId: number, classId: number): Promise<any> {
        const res = await pool.query(
            `SELECT * FROM class_views WHERE teacher_id = $1 AND class_id = $2`,
            [teacherId, classId]
        );
        return res.rows;
    }
    //getClassSummaryForTeacher
    async getClassSummaryForTeacher(teacherId: number, classId: number): Promise<any> {
        const res = await pool.query(
            `SELECT * FROM class_summaries WHERE teacher_id = $1 AND class_id = $2`,
            [teacherId, classId]
        );
        return res.rows;
    }

    //getNearProgressSummaryForStudent(studentId: number, courseId: number): Promise<StudentCourseWeekForParent[]>
    async getNearProgressSummaryForStudent(studentId: number, courseId: number): Promise<StudentNearProgressData[]> {
        const res = await pool.query(
            `SELECT * FROM student_course_week_progress
       WHERE student_id = $1 AND course_id = $2
       ORDER BY course_week_id DESC`,
            [studentId, courseId]
        );
        return res.rows;
    }

    //createVideoChoiceQuizLog
    async createVideoChoiceQuizLog(params: {
        studentId: number;
        choiceQuizId: number;
        selectedOption: string;
        isCorrect: boolean;
        answeredInSeconds: number;
        courseId: number;
    }): Promise<void> {
        await pool.query(
            `INSERT INTO video_choice_quiz_logs (
        student_id, choice_quiz_id, selected_option, is_correct, answered_in_seconds, course_id, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [
                params.studentId,
                params.choiceQuizId,
                params.selectedOption,
                params.isCorrect,
                params.answeredInSeconds,
                params.courseId
            ]
        );
    }

    //get7DayTeacherReviewsOfStudent
    async get7DayTeacherReviewsOfStudent(
        studentId: number,
        courseId: number
    ): Promise<Array<{ get_day: string; teacher_reviews: string }>> {
        const sql = `
    WITH base AS (
      SELECT 
        teacher_reviews,
        COALESCE(updated_at, created_at) AS ts
      FROM course_week_progress
      WHERE COALESCE(updated_at, created_at) >= date_trunc('day', now()) - interval '6 days' -- 7 ngày gần nhất
        AND student_id = $1
        AND course_id  = $2
    )
    SELECT DISTINCT ON (date_trunc('day', ts))
      to_char(date_trunc('day', ts), 'YYYY-MM-DD') AS get_day,
      teacher_reviews
    FROM base
    ORDER BY date_trunc('day', ts), ts DESC;  -- mỗi ngày lấy bản ghi mới nhất
  `;
        const res = await pool.query(sql, [studentId, courseId]);
        return res.rows.map((row: any) => ({
            get_day: row.get_day,           // đã là 'YYYY-MM-DD'
            teacher_reviews: row.teacher_reviews
        }));
    }

    // Lấy số lượng huy hiệu học sinh đã nhận trong 7 ngày gần đây theo từng ngày
    async get7DayBadgesOfStudent(
        studentId: number,
        courseId: number
    ): Promise<Array<{ badge_count: number; get_day: string }>> {
        const sql = `
    SELECT 
      COUNT(*) AS badge_count,
      to_char(date_trunc('day', awarded_at), 'YYYY-MM-DD') AS get_day
    FROM student_badges
    WHERE awarded_at >= date_trunc('day', now()) - interval '6 days' -- 7 ngày gần nhất
      AND student_id = $1
      AND course_id = $2
    GROUP BY get_day
    ORDER BY get_day ASC
  `;
        const res = await pool.query(sql, [studentId, courseId]);
        return res.rows.map((row: any) => ({
            badge_count: Number(row.badge_count),
            get_day: row.get_day // đã là string YYYY-MM-DD
        }));
    }



    // Lấy số lượng video học sinh đã xem trong 7 ngày gần đây
    async get7DayVideosOfStudent(studentId: number, courseId: number): Promise<
        Array<{ video_count: number; get_day: string }>
    > {
        const sql = `
    SELECT 
      COUNT(DISTINCT video_lecture_id) AS video_count,
      to_char(date_trunc('day', COALESCE(start_at, stop_at)), 'YYYY-MM-DD') AS get_day
    FROM video_sessions
    WHERE COALESCE(start_at, stop_at) >= date_trunc('day', now()) - interval '6 days'
      AND student_id = $1
      AND course_id = $2
    GROUP BY get_day
    ORDER BY get_day ASC
  `;
        const res = await pool.query(sql, [studentId, courseId]);
        return res.rows.map((row: any) => ({
            video_count: Number(row.video_count),
            get_day: row.get_day, // đã là 'YYYY-MM-DD'
        }));
    }


    // Lấy lần nộp bài tập về nhà học sinh đã hoàn thành trong 7 ngày gần đây
    async get7DayHomeworkOfStudent(studentId: number, courseId: number): Promise<any[]> {
        const sql = `
    SELECT 
      COUNt(distinct worksheet_id) AS worksheet_count,
      to_char(date_trunc('day', submitted_at), 'YYYY-MM-DD') AS get_day
    FROM worksheet_submissions
    WHERE submitted_at > date_trunc('day', now() - interval '7 days')
      AND student_id = $1
      AND course_id = $2
    GROUP BY get_day
    ORDER BY get_day asc
    `;
        const res = await pool.query(sql, [studentId, courseId]);
        return res.rows.map(row => ({
            worksheet_count: parseInt(row.worksheet_count, 10),
            get_day: row.get_day as string, // đã là chuỗi YYYY-MM-DD
        }));
    }

    // Lấy xếp hạng mức độ nỗ lực của học sinh trong 7 ngày gần đây
    // Tạm trả về random, sau này implement sau.
    async get7DayEffortRankingOfStudent(studentId: number, courseId: number): Promise<any[]> {
        const sql = `
    SELECT 
      to_char(date_trunc('day', d), 'YYYY-MM-DD') AS get_day,
      FLOOR(2 + random() * 8)::int AS ranking -- 2..9
    FROM generate_series(current_date - interval '6 days', current_date, interval '1 day') AS d
    ORDER BY get_day
  `;
        const res = await pool.query(sql);

        return res.rows.map(row => ({
            get_day: row.get_day, // đã là string YYYY-MM-DD
            ranking: Number(row.ranking)
        }));
    }

    //get7DayVideoChoiceQuizCorrectCountOfStudent
    async get7DayVideoChoiceQuizCorrectCountOfStudent(studentId: number, courseId: number): Promise<any[]> {
        const sql = `
    SELECT 
      COUNT(*) AS correct_count,
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS get_day
    FROM video_choice_quiz_logs
    WHERE is_correct = true
      AND created_at >= date_trunc('day', now()) - interval '6 days'
      AND student_id = $1
      AND course_id = $2
    GROUP BY get_day
    ORDER BY get_day ASC
  `;
        const res = await pool.query(sql, [studentId, courseId]);
        return res.rows.map(row => ({
            correct_count: Number(row.correct_count),
            get_day: row.get_day // đã là string YYYY-MM-DD
        }));
    }

}
    