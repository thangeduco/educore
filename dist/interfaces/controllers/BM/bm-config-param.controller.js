"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bmConfigParamController = void 0;
// Gợi ý tên service/repo theo kiến trúc hiện có của bạn.
// Bạn có thể đổi lại đúng tên file/thư mục thực tế nếu đã có sẵn.
const get_home_page_param_uc_1 = require("../../../application/BM/use-cases/bm-config-param/get-home-page-param.uc");
const bm_pg_config_param_repository_1 = require("../../../infrastructure/BM/bm-pg-config-param.repository");
// Khởi tạo service
const bmConfigParamRepo = new bm_pg_config_param_repository_1.PgBMConfigParamRepository();
const getHomePageParamUC = new get_home_page_param_uc_1.GetHomePageParamUC(bmConfigParamRepo);
// Regex cơ bản để validate tenantCode (chữ, số, gạch dưới, gạch ngang, 2–64 ký tự)
const TENANT_CODE_REGEX = /^[a-zA-Z0-9_-]{2,64}$/;
exports.bmConfigParamController = {
    async getHomePageUserGuide(req, res) {
        try {
            const tenantCode = String(req.params.tenantCode || '').trim();
            if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
                return res.status(400).json({ error: 'tenantCode không hợp lệ' });
            }
            const userGuide = await getHomePageParamUC.getHomeUserGuide(tenantCode);
            return res.status(200).json(userGuide);
        }
        catch (err) {
            console.error('[bmController][getHomePageUserGuide]', err);
            return res
                .status(404)
                .json({ error: err?.message || 'Không tìm thấy tham số userGuide cho tenant' });
        }
    },
    async getHomePageCourses(req, res) {
        try {
            const tenantCode = String(req.params.tenantCode || '').trim();
            if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
                return res.status(400).json({ error: 'tenantCode không hợp lệ' });
            }
            const courses = await getHomePageParamUC.getHomeCourses(tenantCode);
            return res.status(200).json(courses);
        }
        catch (err) {
            console.error('[bmController][getHomePageCourses]', err);
            return res
                .status(404)
                .json({ error: err?.message || 'Không tìm thấy tham số courses cho tenant' });
        }
    },
    async getHomePageQAs(req, res) {
        try {
            const tenantCode = String(req.params.tenantCode || '').trim();
            if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
                return res.status(400).json({ error: 'tenantCode không hợp lệ' });
            }
            const qas = await getHomePageParamUC.getHomeQAs(tenantCode);
            return res.status(200).json(qas);
        }
        catch (err) {
            console.error('[bmController][getHomePageQAs]', err);
            return res
                .status(404)
                .json({ error: err?.message || 'Không tìm thấy tham số QAs cho tenant' });
        }
    },
    async getHomePageImageSlides(req, res) {
        try {
            const tenantCode = String(req.params.tenantCode || '').trim();
            if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
                return res.status(400).json({ error: 'tenantCode không hợp lệ' });
            }
            const imageSlides = await getHomePageParamUC.getHomeImageSlides(tenantCode);
            return res.status(200).json(imageSlides);
        }
        catch (err) {
            console.error('[bmController][getHomePageImageSlides]', err);
            return res
                .status(404)
                .json({ error: err?.message || 'Không tìm thấy tham số imageSlides cho tenant' });
        }
    },
    async getHomePageVideoTutorial(req, res) {
        try {
            const tenantCode = String(req.params.tenantCode || '').trim();
            if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
                return res.status(400).json({ error: 'tenantCode không hợp lệ' });
            }
            const videoTutorial = await getHomePageParamUC.getHomeVideoTutorial(tenantCode);
            return res.status(200).json(videoTutorial);
        }
        catch (err) {
            console.error('[bmController][getHomePageVideoTutorial]', err);
            return res
                .status(404)
                .json({ error: err?.message || 'Không tìm thấy tham số videoTutorial cho tenant' });
        }
    }
};
