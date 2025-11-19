// home-page-param.dto.ts

// Nếu cần dùng chung ở nhiều module, file này nên nằm ở layer application/interface.
// Không import ngược lên domain để tránh circular dependency.

// ============================
// BmConfigParamDto
// ============================

export type BmConfigParamDto = {
  paramId: number;
  tenantCode: string;
  paramType: string;
  paramValue: any;
  paramVersion: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  inactivedAt?: Date | null;
};

// ============================
// HomeUserGuideDto
// ============================

export type HomeUserGuideDto = {
  serviceTitle: string;
  serviceSummaryMd: string;
  serviceGuideFileUrl: string;

  userTitle: string;
  userSummaryMd: string;
  userGuideFileUrl: string;
};

// ============================
// HomeCoursesDto & HomeCourseItemDto
// ============================

export type HomeCourseItemDto = {
  grade: number;
  title: string;
  courseId: number;
  coverUrl: string;
  localPath: string | null;
  display_order: number;
};

export type HomeCoursesDto = HomeCourseItemDto[];

// ============================
// HomeImageSlidesDto & HomeImageSlideItemDto
// ============================

export type HomeImageSlideItemDto = {
  title: string;
  linkUrl: string;
  imageUrl: string;
  subtitle?: string;
  display_order: number;
};

export type HomeImageSlidesDto = HomeImageSlideItemDto[];

// ============================
// HomeQAsDto, HomeQAItemDto, HomeQAAnswerDto
// ============================

export type HomeQAAnswerDto = {
  title: string;
  bodyMd: string;
  ctaUrl: string;
  ctaText: string;
};

export type HomeQAItemDto = {
  id: string;
  prompt: string;
  answers: {
    no: HomeQAAnswerDto;
    yes: HomeQAAnswerDto;
  };
  display_order: number;
};

export type HomeQAsDto = HomeQAItemDto[];

// ============================
// HomeVideoTutorialDto
// ============================

export type HomeVideoTutorialDto = {
  title: string;
  embedUrl: string;
  platform: 'youtube' | 'vimeo' | string;
  videoUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
};
