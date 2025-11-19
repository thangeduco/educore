// src/domain/BM/repos/bm-config-param.repo.ts

import {
  HomeUserGuide,
  HomeCourses,
  HomeImageSlides,
  HomeQAs,
  HomeVideoTutorial,
} from '../bm-models/bm-home-config-param.model';

/**
 * Repository interface cho bm_config_param
 * - Có 1 hàm nền findByTenantAndParamType(...)
 * - Và các hàm tiện ích đã typed cho từng param_type
 */
export interface BMConfigParamRepository {
  // //////////////////////// CONFIG FOR HOME PAGE start/////////////////////////////////////////////

  /** home_user_guide */
  findHomeUserGuide(tenantCode: string): Promise<HomeUserGuide | null>;

  /** home_courses */
  findHomeCourses(tenantCode: string): Promise<HomeCourses | null>;

  /** home_image_slides */
  findHomeImageSlides(tenantCode: string): Promise<HomeImageSlides | null>;

  /** home_qas */
  findHomeQAs(tenantCode: string): Promise<HomeQAs | null>;

  /** home_video_tutorial */
  findHomeVideoTutorial(tenantCode: string): Promise<HomeVideoTutorial | null>;

 // //////////////////////// CONFIG FOR HOME PAGE end/////////////////////////////////////////////
}
