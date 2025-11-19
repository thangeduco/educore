"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHomeUserGuide = parseHomeUserGuide;
exports.parseHomeCourses = parseHomeCourses;
exports.parseHomeImageSlides = parseHomeImageSlides;
exports.parseHomeQAs = parseHomeQAs;
exports.parseHomeVideoTutorial = parseHomeVideoTutorial;
function parseHomeUserGuide(input) {
    assertObject(input, 'home_user_guide must be an object');
    const { serviceTitle, serviceSummaryMd, serviceGuideFileUrl, userTitle, userSummaryMd, userGuideFileUrl } = input;
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
function parseHomeCourses(input) {
    if (!Array.isArray(input))
        throw new Error('home_courses must be an array');
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
function parseHomeImageSlides(input) {
    if (!Array.isArray(input))
        throw new Error('home_image_slides must be an array');
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
function parseHomeQAs(input) {
    if (!Array.isArray(input))
        throw new Error('home_qas must be an array');
    return input.map((it, idx) => {
        assertObject(it, `home_qas[${idx}] must be an object`);
        const { id, prompt, answers, display_order } = it;
        assertString(id, `id[${idx}] is required`);
        assertString(prompt, `prompt[${idx}] is required`);
        assertObject(answers, `answers[${idx}] must be an object`);
        const { no, yes } = answers;
        assertObject(no, `answers.no[${idx}] must be an object`);
        assertObject(yes, `answers.yes[${idx}] must be an object`);
        const parseAns = (a, label) => {
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
function parseHomeVideoTutorial(input) {
    assertObject(input, 'home_video_tutorial must be an object');
    const { title, embedUrl, platform, videoUrl, youtubeId, thumbnailUrl, durationSeconds } = input;
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
function safeJsonParse(text, fallback) {
    try {
        return JSON.parse(text);
    }
    catch {
        return fallback;
    }
}
function assertObject(val, msg) {
    if (typeof val !== 'object' || val === null || Array.isArray(val))
        throw new Error(msg);
}
function assertString(val, msg) {
    if (typeof val !== 'string' || val.length === 0)
        throw new Error(msg);
}
function assertInteger(val, msg) {
    if (!Number.isInteger(val))
        throw new Error(msg);
}
