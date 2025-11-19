// src/infrastructure/repositories/pg-learning.repository.parent.ts
import { LearningRepository } from '../../domain/LM/repositories/learning.repository';
import { StudentCourseWeekForParent, WeeklyLearningStats, WorksheetLearning, VideoLearning } from '../../domain/LM/models/week-learning-stat';
import { pool } from '../common/db-postgres';
import { WorksheetSubmission } from '../../domain/LM/models/worksheet-submission.model';
import { StudentCourseViewForParent } from '../../domain/LM/models/week-learning-stat';

export class PgLearningRepositoryParentStats {
    async getCourseWeekLearningStatsForParent(
        studentId: number,
        courseId: number
    ): Promise<StudentCourseWeekForParent[]> {
        const res = await pool.query(
            `
    SELECT 
      a.id AS week_content_id,
      a.course_week_id AS week_id,
      e.title AS week_title,
      e.description AS week_description,
      e.week_number AS week_number,
      a.content_type AS content_type,

      d.week_progress AS week_progress,
      d.average_best_score AS average_best_score,
      d.teacher_reviews AS teacher_reviews,

      a.content_id AS content_id,
      a.step AS content_step,

      b.title AS video_title,
      b.url AS video_url,

      c.title AS worksheet_title,
      c.download_url AS worksheet_url,
      
      f.num_of_submission AS submission_count,
      f.highest_score AS highest_score,
      
      g.watched_duration_minutes AS watched_duration_minutes

    FROM week_contents a
    LEFT JOIN course_weeks e ON a.course_week_id = e.id
    LEFT JOIN video_lectures b ON a.content_id = b.id AND a.content_type = 'video'
    LEFT JOIN worksheets c ON a.content_id = c.id AND a.content_type = 'worksheet'

    LEFT JOIN (
      SELECT course_week_id, week_progress, average_best_score, teacher_reviews 
      FROM course_week_progress 
      WHERE student_id = $1
    ) d ON a.course_week_id = d.course_week_id

    LEFT JOIN (
      SELECT 
        course_week_id,
        worksheet_id,
        COUNT(1) AS num_of_submission,
        MAX(score) AS highest_score 
      FROM worksheet_submissions
      WHERE student_id = $1 AND course_id = $2
      GROUP BY course_week_id, worksheet_id
    ) f 
    ON a.course_week_id = f.course_week_id 
    AND a.content_id = f.worksheet_id 
    AND a.content_type = 'worksheet'

    LEFT JOIN (
      SELECT 
        course_week_id, 
        video_lecture_id, 
        SUM(actual_duration) AS watched_duration_minutes
      FROM video_sessions
      WHERE student_id = $1 AND course_id = $2
      GROUP BY course_week_id, video_lecture_id
    ) g 
    ON a.course_week_id = g.course_week_id 
    AND g.video_lecture_id = a.content_id 
    AND a.content_type = 'video'

    WHERE a.course_id = $2
    ORDER BY a.course_week_id, a.step
    `,
            [studentId, courseId]
        );

        // Group by weekId
        const weekMap = new Map<number, StudentCourseWeekForParent>();

        for (const row of res.rows) {
            const weekId = row.week_id;

            if (!weekMap.has(weekId)) {
                weekMap.set(weekId, {
                    weekId: weekId,
                    weekTitle: row.week_title,
                    weekDescription: row.week_description ?? '',
                    weekNumber: row.week_number,
                    weekProgress: row.week_progress ?? 0,
                    averageBestScore: row.average_best_score ?? 0,
                    teacherReviews: row.teacher_reviews ?? '',
                    videos: [],
                    worksheets: [],
                });
            }

            const contentBase = {
                content_id: row.content_id,
                content_step: row.content_step,
                content_type: row.content_type,
            };

            if (row.content_type === 'video') {
                const video: VideoLearning = {
                    ...contentBase,
                    video_title: row.video_title ?? '',
                    video_url: row.video_url ?? '',
                    watched_duration_minutes: Number(row.watched_duration_minutes ?? 0),
                };
                weekMap.get(weekId)!.videos.push(video);
            } else if (row.content_type === 'worksheet') {
                const worksheet: WorksheetLearning = {
                    ...contentBase,
                    worksheet_title: row.worksheet_title ?? '',
                    worksheet_url: row.worksheet_url ?? '',
                    submission_count: Number(row.submission_count ?? 0),
                    highest_score: Number(row.highest_score ?? 0),
                };
                weekMap.get(weekId)!.worksheets.push(worksheet);
            }
        }

        return Array.from(weekMap.values());
    }
}
