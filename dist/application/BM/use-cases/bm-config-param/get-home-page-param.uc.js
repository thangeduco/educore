"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHomePageParamUC = void 0;
/**
 * Use Case: GetHomePageParamUC
 * Lấy toàn bộ cấu hình trang chủ của 1 tenant.
 */
class GetHomePageParamUC {
    constructor(repo) {
        this.repo = repo;
    }
    async getHomeUserGuide(tenantCode) {
        console.info(`[GetHomeUserGuide] Lấy userGuide cho tenant=${tenantCode}`);
        const homeUserGuide = await this.repo.findHomeUserGuide(tenantCode);
        if (!homeUserGuide) {
            return null;
        }
        // Map từ domain model → DTO (object phẳng gồm cả service & user)
        const dto = {
            serviceTitle: homeUserGuide.serviceTitle,
            serviceSummaryMd: homeUserGuide.serviceSummaryMd,
            serviceGuideFileUrl: homeUserGuide.serviceGuideFileUrl,
            userTitle: homeUserGuide.userTitle,
            userSummaryMd: homeUserGuide.userSummaryMd,
            userGuideFileUrl: homeUserGuide.userGuideFileUrl
        };
        return dto;
    }
    async getHomeCourses(tenantCode) {
        console.info(`[GetHomeCourses] Lấy homeCourses cho tenant=${tenantCode}`);
        const homeCourses = await this.repo.findHomeCourses(tenantCode);
        if (!homeCourses || homeCourses.length === 0) {
            return [];
        }
        const dto = homeCourses.map((item) => ({
            grade: item.grade,
            title: item.title,
            courseId: item.courseId,
            coverUrl: item.coverUrl,
            localPath: item.localPath,
            display_order: item.display_order
        }));
        return dto;
    }
    async getHomeImageSlides(tenantCode) {
        console.info(`[GetHomeImageSlides] Lấy homeImageSlides cho tenant=${tenantCode}`);
        const homeImageSlides = await this.repo.findHomeImageSlides(tenantCode);
        if (!homeImageSlides || homeImageSlides.length === 0) {
            return [];
        }
        const dto = homeImageSlides.map((item) => ({
            title: item.title,
            linkUrl: item.linkUrl,
            imageUrl: item.imageUrl,
            subtitle: item.subtitle,
            display_order: item.display_order
        }));
        return dto;
    }
    async getHomeQAs(tenantCode) {
        console.info(`[GetHomeQAs] Lấy homeQAs cho tenant=${tenantCode}`);
        const homeQAs = await this.repo.findHomeQAs(tenantCode);
        if (!homeQAs || homeQAs.length === 0) {
            return [];
        }
        const dto = homeQAs.map((item) => ({
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
    async getHomeVideoTutorial(tenantCode) {
        console.info(`[GetHomeVideoTutorial] Lấy homeVideoTutorial cho tenant=${tenantCode}`);
        const homeVideoTutorial = await this.repo.findHomeVideoTutorial(tenantCode);
        if (!homeVideoTutorial) {
            return null;
        }
        const dto = {
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
exports.GetHomePageParamUC = GetHomePageParamUC;
