import { BMConfigParamRepository } from '../../../../domain/BM/bm-repos/bm-config-param.repo';
import {
  HomeUserGuideDto,
  HomeCoursesDto,
  HomeImageSlidesDto,
  HomeQAsDto,
  HomeVideoTutorialDto
} from '../../dtos/home-page-param.dto';

/**
 * Use Case: GetHomePageParamUC
 * Lấy toàn bộ cấu hình trang chủ của 1 tenant.
 */
export class GetHomePageParamUC {
  constructor(private repo: BMConfigParamRepository) { }

  async getHomeUserGuide(tenantCode: string): Promise<HomeUserGuideDto | null> {
    console.info(`[GetHomeUserGuide] Lấy userGuide cho tenant=${tenantCode}`);

    const homeUserGuide = await this.repo.findHomeUserGuide(tenantCode);

    if (!homeUserGuide) {
      return null;
    }

    // Map từ domain model → DTO (object phẳng gồm cả service & user)
    const dto: HomeUserGuideDto = {
      serviceTitle: homeUserGuide.serviceTitle,
      serviceSummaryMd: homeUserGuide.serviceSummaryMd,
      serviceGuideFileUrl: homeUserGuide.serviceGuideFileUrl,

      userTitle: homeUserGuide.userTitle,
      userSummaryMd: homeUserGuide.userSummaryMd,
      userGuideFileUrl: homeUserGuide.userGuideFileUrl
    };

    return dto;
  }

  async getHomeCourses(tenantCode: string): Promise<HomeCoursesDto> {
    console.info(`[GetHomeCourses] Lấy homeCourses cho tenant=${tenantCode}`);

    const homeCourses = await this.repo.findHomeCourses(tenantCode);

    if (!homeCourses || homeCourses.length === 0) {
      return [];
    }

    const dto: HomeCoursesDto = homeCourses.map((item) => ({
      grade: item.grade,
      title: item.title,
      courseId: item.courseId,
      coverUrl: item.coverUrl,
      localPath: item.localPath,
      display_order: item.display_order
    }));

    return dto;
  }

  async getHomeImageSlides(tenantCode: string): Promise<HomeImageSlidesDto> {
    console.info(`[GetHomeImageSlides] Lấy homeImageSlides cho tenant=${tenantCode}`);

    const homeImageSlides = await this.repo.findHomeImageSlides(tenantCode);

    if (!homeImageSlides || homeImageSlides.length === 0) {
      return [];
    }

    const dto: HomeImageSlidesDto = homeImageSlides.map((item) => ({
      title: item.title,
      linkUrl: item.linkUrl,
      imageUrl: item.imageUrl,
      subtitle: item.subtitle,
      display_order: item.display_order
    }));

    return dto;
  }

  async getHomeQAs(tenantCode: string): Promise<HomeQAsDto> {
    console.info(`[GetHomeQAs] Lấy homeQAs cho tenant=${tenantCode}`);

    const homeQAs = await this.repo.findHomeQAs(tenantCode);

    if (!homeQAs || homeQAs.length === 0) {
      return [];
    }

    const dto: HomeQAsDto = homeQAs.map((item) => ({
      id: item.id,
      prompt: item.prompt,
      display_order: item.display_order,
      answers: {
        no: {
          title: item.answers.no.title,
          bodyMd: item.answers.no.bodyMd,
          ctaUrl: item.answers.no.ctaUrl,
          ctaText: item.answers.no.ctaText
        },
        yes: {
          title: item.answers.yes.title,
          bodyMd: item.answers.yes.bodyMd,
          ctaUrl: item.answers.yes.ctaUrl,
          ctaText: item.answers.yes.ctaText
        }
      }
    }));

    return dto;
  }

  async getHomeVideoTutorial(tenantCode: string): Promise<HomeVideoTutorialDto | null> {
    console.info(`[GetHomeVideoTutorial] Lấy homeVideoTutorial cho tenant=${tenantCode}`);

    const homeVideoTutorial = await this.repo.findHomeVideoTutorial(tenantCode);

    if (!homeVideoTutorial) {
      return null;
    }

    const dto: HomeVideoTutorialDto = {
      title: homeVideoTutorial.title,
      embedUrl: homeVideoTutorial.embedUrl,
      platform: homeVideoTutorial.platform,
      videoUrl: homeVideoTutorial.videoUrl,
      youtubeId: homeVideoTutorial.youtubeId,
      thumbnailUrl: homeVideoTutorial.thumbnailUrl,
      durationSeconds: homeVideoTutorial.durationSeconds
    };

    return dto;
  }
}
