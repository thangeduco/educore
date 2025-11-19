"use strict";
// src/application/BM/use-cases/bm-product-service/bm-product.uc.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BMProductUC = void 0;
class BMProductUC {
    constructor(repo) {
        this.repo = repo;
    }
    /**
     * getCourses
     * Trả về toàn bộ khóa học product_type = 'COURSE'
     */
    async getCourses() {
        console.info('[BMProductUC][getCourses] Lấy danh sách toàn bộ khóa học product_type=COURSE');
        const products = await this.repo.findAllCourses();
        if (!products || products.length === 0) {
            return [];
        }
        return products.map((item) => this.mapToDto(item));
    }
    // ======================================================
    // 🔥 MAP: Domain Model → DTO
    // ======================================================
    mapToDto(product) {
        return {
            id: product.id,
            product_code: product.productCode,
            product_type: product.productType,
            name: product.name,
            product_title: product.productTitle,
            tutorial_video_url: product.tutorialVideoUrl,
            sale_kit_url: product.saleKitUrl,
            user_guide_link: product.userGuideLink,
            // ⭐ successStories Domain → success_stories DTO
            success_stories: this.mapSuccessStories(product.successStories),
            tagline: product.tagline,
            description: product.description,
            thumbnail_url: product.thumbnailUrl,
            grade: product.grade,
            level: product.level,
            category: product.category,
            subject: product.subject,
            price_amount: product.priceAmount,
            list_price_amount: product.listPriceAmount,
            price_currency: product.priceCurrency,
            promotion_flag: product.promotionFlag,
            promotion_note: product.promotionNote,
            sale_start_at: product.saleStartAt,
            sale_end_at: product.saleEndAt,
            access_start_at: product.accessStartAt,
            access_end_at: product.accessEndAt,
            access_duration_days: product.accessDurationDays,
            status: product.status,
            is_visible: product.isVisible,
            display_order: product.displayOrder,
            target_student_desc: product.targetStudentDesc,
            learning_outcome: product.learningOutcome,
            metadata: product.metadata,
            created_at: product.createdAt,
            created_by: product.createdBy,
            updated_at: product.updatedAt,
            updated_by: product.updatedBy,
        };
    }
    // ======================================================
    // ⭐ MAP success stories (Domain camelCase → DTO snake_case)
    // ======================================================
    mapSuccessStories(list) {
        if (!list || list.length === 0)
            return null;
        return list.map((s) => ({
            image_url: s.imageUrl,
            title: s.title,
            story: s.story,
        }));
    }
}
exports.BMProductUC = BMProductUC;
