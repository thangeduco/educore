"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWeekDetailContentsService = void 0;
class GetWeekDetailContentsService {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(courseId) {
        const weeks = await this.repo.getCourseWeekDetailContents(courseId);
        return weeks;
    }
}
exports.GetWeekDetailContentsService = GetWeekDetailContentsService;
