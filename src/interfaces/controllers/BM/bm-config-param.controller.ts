import { Request, Response } from 'express';

// Gợi ý tên service/repo theo kiến trúc hiện có của bạn.
// Bạn có thể đổi lại đúng tên file/thư mục thực tế nếu đã có sẵn.
import { GetHomePageParamUC } from '../../../application/BM/use-cases/bm-config-param/get-home-page-param.uc';
import { PgBMConfigParamRepository } from '../../../infrastructure/BM/bm-pg-config-param.repository';

// Khởi tạo service
const bmConfigParamRepo = new PgBMConfigParamRepository();
const getHomePageParamUC = new GetHomePageParamUC(bmConfigParamRepo);

// Regex cơ bản để validate tenantCode (chữ, số, gạch dưới, gạch ngang, 2–64 ký tự)
const TENANT_CODE_REGEX = /^[a-zA-Z0-9_-]{2,64}$/;

export const bmConfigParamController = {

  async getHomePageUserGuide(req: Request, res: Response) {
    try {
      const tenantCode = String(req.params.tenantCode || '').trim();

      if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
        return res.status(400).json({ error: 'tenantCode không hợp lệ' });
      }

      const userGuide = await getHomePageParamUC.getHomeUserGuide(tenantCode);

      return res.status(200).json(userGuide);

    } catch (err: any) {
      console.error('[bmController][getHomePageUserGuide]', err);
      return res
        .status(404)
        .json({ error: err?.message || 'Không tìm thấy tham số userGuide cho tenant' });
    }
  }
  ,

  async getHomePageCourses(req: Request, res: Response) {
    try {
      const tenantCode = String(req.params.tenantCode || '').trim();

      if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
        return res.status(400).json({ error: 'tenantCode không hợp lệ' });
      }

      const courses = await getHomePageParamUC.getHomeCourses(tenantCode);

      return res.status(200).json(courses);

    } catch (err: any) {
      console.error('[bmController][getHomePageCourses]', err);
      return res
        .status(404)
        .json({ error: err?.message || 'Không tìm thấy tham số courses cho tenant' });
    }
  },

  async getHomePageQAs(req: Request, res: Response) {
    try {
      const tenantCode = String(req.params.tenantCode || '').trim();

      if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
        return res.status(400).json({ error: 'tenantCode không hợp lệ' });
      }

      const qas = await getHomePageParamUC.getHomeQAs(tenantCode);

      return res.status(200).json(qas);

    } catch (err: any) {
      console.error('[bmController][getHomePageQAs]', err);
      return res
        .status(404)
        .json({ error: err?.message || 'Không tìm thấy tham số QAs cho tenant' });
    }
  },

  async getHomePageImageSlides(req: Request, res: Response) {
    try {
      const tenantCode = String(req.params.tenantCode || '').trim();

      if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
        return res.status(400).json({ error: 'tenantCode không hợp lệ' });
      }

      const imageSlides = await getHomePageParamUC.getHomeImageSlides(tenantCode);

      return res.status(200).json(imageSlides);

    } catch (err: any) {
      console.error('[bmController][getHomePageImageSlides]', err);
      return res
        .status(404)
        .json({ error: err?.message || 'Không tìm thấy tham số imageSlides cho tenant' });
    }
  },

  async getHomePageVideoTutorial(req: Request, res: Response) {
    try {
      const tenantCode = String(req.params.tenantCode || '').trim();

      if (!tenantCode || !TENANT_CODE_REGEX.test(tenantCode)) {
        return res.status(400).json({ error: 'tenantCode không hợp lệ' });
      }

      const videoTutorial = await getHomePageParamUC.getHomeVideoTutorial(tenantCode);

      return res.status(200).json(videoTutorial);

    } catch (err: any) {
      console.error('[bmController][getHomePageVideoTutorial]', err);
      return res
        .status(404)
        .json({ error: err?.message || 'Không tìm thấy tham số videoTutorial cho tenant' });
    }
  }
};
