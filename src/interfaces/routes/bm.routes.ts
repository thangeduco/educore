import { Router } from 'express';
import { bmConfigParamController as bmConfigParamController } from '../controllers/BM/bm-config-param.controller';
import { bmUserEventLogsController } from '../controllers/BM/bm-user-event-logs.controller';
import { bmProductController } from '../controllers/BM/bm-product.controller';

const router = Router();


/** Nhóm 1: API cho sub-domain config param  */
////////////////////// API FOR HOME PAGE start //////////////////////////////////////////////////
router.get('/:tenantCode/home-page-user-guide', bmConfigParamController.getHomePageUserGuide);
router.get('/:tenantCode/home-page-courses', bmConfigParamController.getHomePageCourses);
router.get('/:tenantCode/home-page-image-slides', bmConfigParamController.getHomePageImageSlides);
router.get('/:tenantCode/home-page-qas', bmConfigParamController.getHomePageQAs);
//router.get('/:tenantCode/home-page-video-tutorial', bmConfigParamController.getHomePageVideoTutorial);
////////////////////// API FOR HOME PAGE end //////////////////////////////////////////////////

////////////////////// API FOR USER LOGS start //////////////////////////////////////////////////
router.post('/user-event-logs', bmUserEventLogsController.createUserEventLog);

////////////////////// API FOR USER LOGS end //////////////////////////////////////////////////



////////////////////// API FOR PRODUCT MANAGEMENT start //////////////////////////////////////////////////
router.get('/products/courses', bmProductController.getCourses);

////////////////////// API FOR PRODUCT MANAGEMENT end //////////////////////////////////////////////////

/** Nhóm 2: API cho sub-domain account management: Tài khoản, xác thực, phân quyền */
/** Nhóm 3: API cho sub-domain user-group management: Thông tin học sinh, phụ huynh, lớp, nhóm, profile, avatar, slogen, Vào ra nhóm  */
/** Nhóm 4: API cho sub-domain product, service management: Lấy sản phẩm, active dịch vụ, chặn dịch vụ, mở dịch vụ, gia hạn dịch vụ */
/** Nhóm 5: API cho sub-domain tích hợp công cụ giao tiếp: email, sms, mobile push, web push */
/** Nhóm 6: API cho sub-domain thanh toán: tích hợp bank, đối soát */
/** Nhóm 7: API cho sub-domain quản lý bán hàn: kênh bán, hoa hồng */
/** Nhóm 8: API cho sub-domain tiện ích add-on như AI simulator ... */


export default router;
