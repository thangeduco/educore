import { CMCourseRepository } from '../../domain/CM/repositories/cm-course.repo';

export class GetVideoDurationService {
  constructor(private repo: CMCourseRepository) {}

  async execute(videoId: number): Promise<number> {
    const video = await this.repo.findById(videoId);

    if (!video) {
      console.warn(`[GetVideoDurationService] ❌ Không tìm thấy video với ID: ${videoId}`);
      throw new Error('Không tìm thấy video');
    }
    return video.duration ?? 0;
  }
}
