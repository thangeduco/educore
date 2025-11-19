import { Request, Response } from 'express';
import { CMCourseUC } from '../../../application/CM/use-cases/cm-course.uc';
import { CMPgCourseRepository } from '../../../infrastructure/CM/cm-pg-course.repository';
import { GetWeekDetailContentsService } from '../../../application/CM/get-week-detail-contents.service';
import { GetVideoEventService } from '../../../application/CM/get-video-events.service';
import { GetVideoDurationService } from '../../../application/CM/get-video-duration.service';

// Khởi tạo service
const courseRepo = new CMPgCourseRepository();
const courseUC = new CMCourseUC(courseRepo);

const getWeekDetailContentsService = new GetWeekDetailContentsService(courseRepo);
const getVideoEventService = new GetVideoEventService(courseRepo);
const getVideoDurationService = new GetVideoDurationService(courseRepo);

export const cmCourseController = {

  async getCourseByCode(req: Request, res: Response) {
    try {
      const { courseCode } = req.params;

      if (!courseCode || typeof courseCode !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'courseCode không hợp lệ',
        });
      }

      console.info(
        '[cmCourseController][getCourseByCode] Lấy thông tin khoá học với course_code =',
        courseCode
      );

      const course = await courseUC.getCourseByCode(courseCode);

      return res.status(200).json({
        success: true,
        data: course,
      });
    } catch (err: any) {
      console.error('[cmCourseController][getCourseByCode] ❌ Lỗi', err);
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy khoá học',
        message: err?.message,
      });
    }
  },










  async getWeekDetailContents(req: Request, res: Response) {
    try {
      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: 'courseId không hợp lệ' });
      }

      const result = await getWeekDetailContentsService.execute(courseId);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error('[courseController][getWeekDetailContents]', err);
      return res.status(500).json({ error: 'Lỗi khi lấy danh sách tuần học' });
    }
  },
  async getVideoEvents(req: Request, res: Response) {
  try {
    const studentId = Number(req.params.studentId);
    const videoId = Number(req.params.videoId);
    
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'VideoId  không hợp lệ' });
    }

    const events = await getVideoEventService.execute(studentId, videoId);
    res.status(200).json(events);
  } catch (err: any) {
    console.error('[courseController][getVideoEvents]', err);
    res.status(404).json({ error: err.message || 'Không tìm thấy video events' });
  }
},

async getVideoDuration(req: Request, res: Response) {
  try {
    const videoId = Number(req.params.videoId);
    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'videoId không hợp lệ' });
    }

    const duration = await getVideoDurationService.execute(videoId);
    res.status(200).json({ videoId, duration });
  } catch (err: any) {
    console.error('[courseController][getVideoDuration]', err);
    res.status(404).json({ error: err.message || 'Không tìm thấy thời lượng video' });
  }
},

};
