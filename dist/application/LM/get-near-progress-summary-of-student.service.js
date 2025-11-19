"use strict";
// src/application/learning/get-near-progress-summary-of-student.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNearProgressSummaryOfStudent = void 0;
class GetNearProgressSummaryOfStudent {
    constructor(learningRepo) {
        this.learningRepo = learningRepo;
    }
    async execute(studentId, courseId) {
        if (!studentId || !courseId) {
            throw new Error('Invalid studentId or courseId');
        }
        // Gọi đúng tên hàm trong repository (theo các hàm bạn đang dùng)
        const [recentTeacherReviews, // expect fields: get_day (YYYY-MM-DD), teacher_reviews (string | string[])
        recentBadges, // expect fields: get_day (YYYY-MM-DD) or submitted_day, badge_count
        recentVideoSessions, // expect fields: get_day (YYYY-MM-DD), video_count
        recentHomework, // expect fields: get_day|submitted_day (YYYY-MM-DD), worksheet_count
        recentEffortRank, // expect fields: get_day (YYYY-MM-DD), ranking (number)
        recentVideoQuiz // expect fields: get_day (YYYY-MM-DD), correct_count
        ] = await Promise.all([
            this.learningRepo.get7DayTeacherReviewsOfStudent(studentId, courseId),
            this.learningRepo.get7DayBadgesOfStudent(studentId, courseId),
            this.learningRepo.get7DayVideosOfStudent(studentId, courseId),
            this.learningRepo.get7DayHomeworkOfStudent(studentId, courseId),
            this.learningRepo.get7DayEffortRankingOfStudent(studentId, courseId),
            this.learningRepo.get7DayVideoChoiceQuizCorrectCountOfStudent(studentId, courseId),
        ]);
        // === Helpers ===
        // Lấy ngày từ nhiều khả năng alias (đều là chuỗi YYYY-MM-DD do SQL đã to_char)
        const getDay = (row) => row?.get_day ?? row?.submitted_day ?? row?.date;
        // Format YYYY-MM-DD theo LOCAL DATE, tránh lệch UTC
        const toLocalYMD = (d) => {
            const y = d.getFullYear();
            const m = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        // Tạo danh sách 7 ngày gần nhất (bao gồm hôm nay), tăng dần
        const buildLast7Days = () => {
            const now = new Date();
            const base = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // strip time
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(base);
                d.setDate(base.getDate() - i);
                days.push(toLocalYMD(d));
            }
            return days;
        };
        // === Build maps ===
        // 1) Teacher reviews: gộp theo ngày (nếu array thì join, nếu string thì lấy string)
        const reviewsMap = recentTeacherReviews.reduce((acc, r) => {
            const day = getDay(r);
            if (!day)
                return acc;
            const val = Array.isArray(r.teacher_reviews)
                ? r.teacher_reviews.filter(Boolean).join('\n')
                : (r.teacher_reviews ?? '');
            if (!val)
                return acc;
            acc[day] = acc[day] ? `${acc[day]}\n${val}` : val;
            return acc;
        }, {});
        // 2) Badges per day
        const badgesMap = recentBadges.reduce((acc, b) => {
            const day = getDay(b);
            if (!day)
                return acc;
            const cnt = Number(b.badge_count ?? b.count ?? 0);
            acc[day] = (acc[day] ?? 0) + cnt;
            return acc;
        }, {});
        // 3) Video sessions per day
        const vsMap = recentVideoSessions.reduce((acc, v) => {
            const day = getDay(v);
            if (!day)
                return acc;
            const cnt = Number(v.video_count ?? v.count ?? 0);
            acc[day] = (acc[day] ?? 0) + cnt;
            return acc;
        }, {});
        // 4) Homework per day
        const hwMap = recentHomework.reduce((acc, h) => {
            const day = getDay(h);
            if (!day)
                return acc;
            const cnt = Number(h.worksheet_count ?? h.count ?? 0);
            acc[day] = (acc[day] ?? 0) + cnt;
            return acc;
        }, {});
        // 5) Effort rank: nếu nhiều record một ngày → lấy min (tốt nhất)
        const rankMap = recentEffortRank.reduce((acc, e) => {
            const day = getDay(e);
            if (!day)
                return acc;
            const r = Number(e.ranking ?? e.rank);
            if (Number.isNaN(r))
                return acc;
            acc[day] = acc[day] == null ? r : Math.min(acc[day], r);
            return acc;
        }, {});
        // 6) Video quiz correct count
        const quizMap = recentVideoQuiz.reduce((acc, q) => {
            const day = getDay(q);
            if (!day)
                return acc;
            const cnt = Number(q.correct_count ?? q.count ?? 0);
            acc[day] = (acc[day] ?? 0) + cnt;
            return acc;
        }, {});
        // === Merge theo khung 7 ngày ===
        const last7Days = buildLast7Days();
        const result = last7Days.map((day) => ({
            label: day, // date
            highlight: reviewsMap[day] ?? '', // teacherReviews (gộp)
            badges: badgesMap[day] ?? 0,
            videoSessions: vsMap[day] ?? 0,
            quizzes: quizMap[day] ?? 0,
            homework: hwMap[day] ?? 0,
            rank: rankMap[day] != null ? `Rank ${rankMap[day]}` : 'N/A',
        }));
        return result;
    }
}
exports.GetNearProgressSummaryOfStudent = GetNearProgressSummaryOfStudent;
