"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVideoDurationService = void 0;
class GetVideoDurationService {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(videoId) {
        const video = await this.repo.findById(videoId);
        if (!video) {
            console.warn(`[GetVideoDurationService] ❌ Không tìm thấy video với ID: ${videoId}`);
            throw new Error('Không tìm thấy video');
        }
        return video.duration ?? 0;
    }
}
exports.GetVideoDurationService = GetVideoDurationService;
