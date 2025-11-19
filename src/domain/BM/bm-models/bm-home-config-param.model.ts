  export type BmConfigParam = {
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

export type HomeUserGuide = {
  serviceTitle: string;
  serviceSummaryMd: string;
  serviceGuideFileUrl: string;

  userTitle: string;
  userSummaryMd: string;
  userGuideFileUrl: string;
};

export function parseHomeUserGuide(input: any): HomeUserGuide {
  assertObject(input, 'home_user_guide must be an object');

  const {
    serviceTitle,
    serviceSummaryMd,
    serviceGuideFileUrl,
    userTitle,
    userSummaryMd,
    userGuideFileUrl
  } = input;

  assertString(serviceTitle, 'serviceTitle is required');
  assertString(serviceSummaryMd, 'serviceSummaryMd is required');
  assertString(serviceGuideFileUrl, 'serviceGuideFileUrl is required');

  assertString(userTitle, 'userTitle is required');
  assertString(userSummaryMd, 'userSummaryMd is required');
  assertString(userGuideFileUrl, 'userGuideFileUrl is required');

  return {
    serviceTitle,
    serviceSummaryMd,
    serviceGuideFileUrl,
    userTitle,
    userSummaryMd,
    userGuideFileUrl
  };
}



export type HomeCourseItem = {
  grade: number;
  title: string;
  courseId: number;
  coverUrl: string;
  localPath: string | null;
  display_order: number;
};
export type HomeCourses = HomeCourseItem[];
export function parseHomeCourses(input: any): HomeCourses {
  if (!Array.isArray(input)) throw new Error('home_courses must be an array');
  return input.map((it, idx) => {
    assertObject(it, `home_courses[${idx}] must be an object`);
    const { grade, title, courseId, coverUrl, localPath, display_order } = it;
    assertInteger(grade, `grade[${idx}] must be integer`);
    assertString(title, `title[${idx}] is required`);
    assertInteger(courseId, `courseId[${idx}] must be integer`);
    assertString(coverUrl, `coverUrl[${idx}] is required`);
    if (!(localPath === null || typeof localPath === 'string')) {
      throw new Error(`localPath[${idx}] must be string or null`);
    }
    assertInteger(display_order, `display_order[${idx}] must be integer`);
    return { grade, title, courseId, coverUrl, localPath, display_order };
  });
}


export type HomeImageSlideItem = {
  title: string;
  linkUrl: string;
  imageUrl: string;
  subtitle?: string;
  display_order: number;
};
export type HomeImageSlides = HomeImageSlideItem[];
export function parseHomeImageSlides(input: any): HomeImageSlides {
  if (!Array.isArray(input)) throw new Error('home_image_slides must be an array');
  return input.map((it, idx) => {
    assertObject(it, `home_image_slides[${idx}] must be an object`);
    const { title, linkUrl, imageUrl, subtitle, display_order } = it;
    assertString(title, `title[${idx}] is required`);
    assertString(linkUrl, `linkUrl[${idx}] is required`);
    assertString(imageUrl, `imageUrl[${idx}] is required`);
    if (!(subtitle === undefined || typeof subtitle === 'string')) {
      throw new Error(`subtitle[${idx}] must be string if present`);
    }
    assertInteger(display_order, `display_order[${idx}] must be integer`);
    return { title, linkUrl, imageUrl, subtitle, display_order };
  });
}


export type HomeQAAnswer = {
  title: string;
  bodyMd: string;
  ctaUrl: string;
  ctaText: string;
};
export type HomeQAItem = {
  id: string;
  prompt: string;
  answers: {
    no: HomeQAAnswer;
    yes: HomeQAAnswer;
  };
  display_order: number;
};
export type HomeQAs = HomeQAItem[];

export function parseHomeQAs(input: any): HomeQAs {
  if (!Array.isArray(input)) throw new Error('home_qas must be an array');
  return input.map((it, idx) => {
    assertObject(it, `home_qas[${idx}] must be an object`);
    const { id, prompt, answers, display_order } = it;
    assertString(id, `id[${idx}] is required`);
    assertString(prompt, `prompt[${idx}] is required`);
    assertObject(answers, `answers[${idx}] must be an object`);

    const { no, yes } = answers;
    assertObject(no, `answers.no[${idx}] must be an object`);
    assertObject(yes, `answers.yes[${idx}] must be an object`);

    const parseAns = (a: any, label: 'no' | 'yes'): HomeQAAnswer => {
      const { title, bodyMd, ctaUrl, ctaText } = a ?? {};
      assertString(title, `answers.${label}.title[${idx}] is required`);
      assertString(bodyMd, `answers.${label}.bodyMd[${idx}] is required`);
      assertString(ctaUrl, `answers.${label}.ctaUrl[${idx}] is required`);
      assertString(ctaText, `answers.${label}.ctaText[${idx}] is required`);
      return { title, bodyMd, ctaUrl, ctaText };
    };

    assertInteger(display_order, `display_order[${idx}] must be integer`);
    return { id, prompt, answers: { no: parseAns(no, 'no'), yes: parseAns(yes, 'yes') }, display_order };
  });
}



export type HomeVideoTutorial = {
  title: string;
  embedUrl: string;
  platform: 'youtube' | 'vimeo' | string;
  videoUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
};


export function parseHomeVideoTutorial(input: any): HomeVideoTutorial {


  assertObject(input, 'home_video_tutorial must be an object');
  const {title,embedUrl, platform, videoUrl, youtubeId, thumbnailUrl, durationSeconds } = input;
  assertString(title, 'title is required');
  assertString(embedUrl, 'embedUrl is required');
  assertString(platform, 'platform is required');
  assertString(videoUrl, 'videoUrl is required');
  if (!(youtubeId === undefined || typeof youtubeId === 'string')) {
    throw new Error('youtubeId must be string if present');
  }
  if (!(thumbnailUrl === undefined || typeof thumbnailUrl === 'string')) {
    throw new Error('thumbnailUrl must be string if present');
  }
  if (!(durationSeconds === undefined || Number.isInteger(durationSeconds))) {
    throw new Error('durationSeconds must be integer if present');
  } 
  
  return { title, embedUrl, platform, videoUrl, youtubeId, thumbnailUrl, durationSeconds };
}

/* =========================================
 * Tiny utils
 * ========================================= */

function safeJsonParse<T = any>(text: string, fallback: T): T {
  try { return JSON.parse(text) as T; } catch { return fallback; }
}

function assertObject(val: any, msg: string): asserts val is Record<string, any> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) throw new Error(msg);
}

function assertString(val: any, msg: string): asserts val is string {
  if (typeof val !== 'string' || val.length === 0) throw new Error(msg);
}

function assertInteger(val: any, msg: string): asserts val is number {
  if (!Number.isInteger(val)) throw new Error(msg);
}
