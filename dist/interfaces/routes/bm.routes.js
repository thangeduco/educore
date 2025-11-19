"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bm_config_param_controller_1 = require("../controllers/BM/bm-config-param.controller");
const bm_user_event_logs_controller_1 = require("../controllers/BM/bm-user-event-logs.controller");
const bm_product_controller_1 = require("../controllers/BM/bm-product.controller");
const router = (0, express_1.Router)();
/** Nhóm 1: API cho sub-domain config param  */
////////////////////// API FOR HOME PAGE start //////////////////////////////////////////////////
router.get('/:tenantCode/home-page-user-guide', bm_config_param_controller_1.bmConfigParamController.getHomePageUserGuide);
router.get('/:tenantCode/home-page-courses', bm_config_param_controller_1.bmConfigParamController.getHomePageCourses);
router.get('/:tenantCode/home-page-image-slides', bm_config_param_controller_1.bmConfigParamController.getHomePageImageSlides);
router.get('/:tenantCode/home-page-qas', bm_config_param_controller_1.bmConfigParamController.getHomePageQAs);
//router.get('/:tenantCode/home-page-video-tutorial', bmConfigParamController.getHomePageVideoTutorial);
////////////////////// API FOR HOME PAGE end //////////////////////////////////////////////////
////////////////////// API FOR USER LOGS start //////////////////////////////////////////////////
router.post('/user-event-logs', bm_user_event_logs_controller_1.bmUserEventLogsController.createUserEventLog);
////////////////////// API FOR USER LOGS end //////////////////////////////////////////////////
////////////////////// API FOR PRODUCT MANAGEMENT start //////////////////////////////////////////////////
router.get('/products/courses', bm_product_controller_1.bmProductController.getCourses);
////////////////////// API FOR PRODUCT MANAGEMENT end //////////////////////////////////////////////////
/** Nhóm 2: API cho sub-domain account management: Tài khoản, xác thực, phân quyền */
/** Nhóm 3: API cho sub-domain user-group management: Thông tin học sinh, phụ huynh, lớp, nhóm, profile, avatar, slogen, Vào ra nhóm  */
/** Nhóm 4: API cho sub-domain product, service management: Lấy sản phẩm, active dịch vụ, chặn dịch vụ, mở dịch vụ, gia hạn dịch vụ */
/** Nhóm 5: API cho sub-domain tích hợp công cụ giao tiếp: email, sms, mobile push, web push */
/** Nhóm 6: API cho sub-domain thanh toán: tích hợp bank, đối soát */
/** Nhóm 7: API cho sub-domain quản lý bán hàn: kênh bán, hoa hồng */
/** Nhóm 8: API cho sub-domain tiện ích add-on như AI simulator ... */
exports.default = router;
