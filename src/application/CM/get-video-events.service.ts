import { CMCourseRepository } from '../../domain/CM/repositories/cm-course.repo';
import { VideoEvent } from '../../domain/CM/models/video-events.model';

export class GetVideoEventService {
  constructor(private repo: CMCourseRepository) {}

  async execute(studentId: number, videoId: number): Promise<VideoEvent[]> {
    // Kiểm tra videoId hợp lệ
    if (isNaN(videoId) || videoId <= 0 || videoId === null) {
      throw new Error('videoId không hợp lệ');
    }

    // Kiểm tra studentId hợp lệ
    if (isNaN(studentId) || studentId <= 0 || studentId === null) {
      console.warn(`[GetVideoEventService] ⚠️ studentId mặc định`);
      studentId = -1; // Sử dụng studentId mặc định nếu không có giá trị hợp lệ
    }

    // Lấy các video event và event data loại quiz
    const quizEvents = await this.repo.getVideoQuizEvents(studentId, videoId);
    if (!quizEvents || quizEvents.length === 0) {
      console.warn(`[GetVideoEventService] ⚠️ Không tìm thấy quiz events cho videoId: ${videoId}`);
    }
    
    // Lấy các video event và event data loại audio
    const audioEvents = await this.repo.getVideoAudioEvents(studentId, videoId);
    if (!audioEvents || audioEvents.length === 0) {
      console.warn(`[GetVideoEventService] ⚠️ Không tìm thấy audio events cho videoId: ${videoId}`);
    }

    // Lấy các video event và event data loại video
    const videoEvents = await this.repo.getVideoVideoEvents(studentId, videoId);
    if (!videoEvents || videoEvents.length === 0) {
      console.warn(`[GetVideoEventService] ⚠️ Không tìm thấy video events cho videoId: ${videoId}`);
    } 

    // Lấy các video event và event data loại image
    const imageEvents = await this.repo.getVideoImageEvents(studentId, videoId);
    if (!imageEvents || imageEvents.length === 0) {
      console.warn(`[GetVideoEventService] ⚠️ Không tìm thấy image events cho videoId: ${videoId}`);
    } 

    // Kết hợp tất cả các sự kiện lại theo thứ tự display_order
    const events: VideoEvent[] = [
      ...quizEvents,
      ...audioEvents,
      ...videoEvents,
      ...imageEvents
    ].sort((a, b) => a.display_order - b.display_order);

    if (!events || events.length === 0) {
      console.warn(`[GetVideoEventService] ⚠️ Không tìm thấy video events cho videoId: ${videoId}`);
      return []; // hoặc có thể throw nếu muốn bắt buộc phải có dữ liệu
    }

    return events;
  }
}
