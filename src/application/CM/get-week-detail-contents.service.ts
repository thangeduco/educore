import { CMCourseRepository } from '../../domain/CM/repositories/cm-course.repo';
import { WeekDetailContent } from '../dtos/week-detail-content.dto';

export class GetWeekDetailContentsService {
  constructor(private repo: CMCourseRepository) {}

  async execute(courseId: number): Promise<WeekDetailContent[]> {
    const weeks = await this.repo.getCourseWeekDetailContents(courseId);
    return weeks;
  }
}
