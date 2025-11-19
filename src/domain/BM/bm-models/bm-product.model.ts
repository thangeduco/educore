// src/domain/BM/bm-models/bm-product.model.ts

// Success stories của khoá học (map từ cột JSON success_stories)
export type SuccessStory = {
  imageUrl: string; // đã chuẩn hoá về camelCase từ image_url trong DB
  title: string;
  story: string;
};

export type BMProduct = {
  id: number;

  productCode: string;
  productType: string; // COURSE / BUNDLE / SUBSCRIPTION

  name: string;
  productTitle: string | null;
  tutorialVideoUrl: string | null;
  saleKitUrl: string | null;
  userGuideLink: string | null;

  // Trước đây: string | null (raw JSON). Giờ đổi sang mảng SuccessStory đã parse.
  successStories: SuccessStory[] | null;

  tagline: string | null;
  description: string | null;
  thumbnailUrl: string | null;

  grade: number | null;       // '6', '7-9', ...
  level: number | null;       // BASIC / ADVANCED / OLYMPIAD...
  category: string | null;    // MATH_PRIMARY / MATH_SECONDARY...
  subject: string | null;     // MATH, ENGLISH...

  priceAmount: number;
  listPriceAmount: number | null;
  priceCurrency: string;

  promotionFlag: boolean;
  promotionNote: string | null;

  saleStartAt: Date | null;
  saleEndAt: Date | null;
  accessStartAt: Date | null;
  accessEndAt: Date | null;
  accessDurationDays: number | null;

  status: string;             // ACTIVE / INACTIVE / DRAFT / ARCHIVED
  isVisible: boolean;
  displayOrder: number | null;

  targetStudentDesc: string | null;
  learningOutcome: string | null;
  metadata: any | null;

  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date | null;
  updatedBy: string | null;
};

/**
 * Parse 1 row từ DB (snake_case) sang domain model BMProduct (camelCase).
 */
export function parseBMProductRow(input: any): BMProduct {
  assertObject(input, 'bm_product row must be an object');

  const {
    id,
    product_code,
    product_type,
    product_title,
    tutorial_video_url,
    sale_kit_url,
    user_guide_link,
    success_stories,
    category,
    subject,
    grade,
    level,
    name,
    tagline,
    description,
    thumbnail_url,
    price_amount,
    list_price_amount,
    price_currency,
    promotion_flag,
    promotion_note,
    sale_start_at,
    sale_end_at,
    access_start_at,
    access_end_at,
    access_duration_days,
    status,
    is_visible,
    display_order,
    target_student_desc,
    learning_outcome,
    metadata,
    created_at,
    created_by,
    updated_at,
    updated_by,
  } = input;

  // ===== Required numeric / string fields (chấp nhận string số) =====

  const idNum = toIntegerLike(id, 'id must be integer');
  const priceAmountNum = toNumberLike(price_amount, 'price_amount must be number');
  const listPriceAmountNum = toOptionalNumberLike(
    list_price_amount,
    'list_price_amount must be number or null',
  );

  if (!product_code) {
    throw new Error('product_code is required');
  }
  if (!product_type) {
    throw new Error('product_type is required');
  }
  if (!name) {
    throw new Error('name is required');
  }

  // Các field này tuỳ business bạn có thể nới lỏng sau, hiện vẫn để required như cũ
  if (!product_title) {
    throw new Error('product_title is required');
  }
  if (!tutorial_video_url) {
    throw new Error('tutorial_video_url is required');
  }
  if (!sale_kit_url) {
    throw new Error('sale_kit_url is required');
  }
  if (!user_guide_link) {
    throw new Error('user_guide_link is required');
  }
  // ⚠️ success_stories KHÔNG bắt buộc nữa để tránh vỡ các product cũ
  // if (!success_stories) {
  //   throw new Error('success_stories is required');
  // }

  if (!price_currency) {
    throw new Error('price_currency is required');
  }
  if (!status) {
    throw new Error('status is required');
  }
  if (typeof promotion_flag !== 'boolean') {
    throw new Error('promotion_flag must be boolean');
  }
  if (typeof is_visible !== 'boolean') {
    throw new Error('is_visible must be boolean');
  }
  if (!created_at) {
    throw new Error('created_at is required');
  }

  // ===== Optional string / numeric fields =====

  if (!(category === null || category === undefined || typeof category === 'string')) {
    throw new Error('category must be string or null');
  }
  if (!(subject === null || subject === undefined || typeof subject === 'string')) {
    throw new Error('subject must be string or null');
  }
  if (!(grade === null || grade === undefined || typeof grade === 'number')) {
    throw new Error('grade must be number or null');
  }
  if (!(level === null || level === undefined || typeof level === 'number')) {
    throw new Error('level must be number or null');
  }
  if (!(tagline === null || tagline === undefined || typeof tagline === 'string')) {
    throw new Error('tagline must be string or null');
  }
  
  if (!(description === null || description === undefined || typeof description === 'string')) {
    throw new Error('description must be string or null');
  }
  if (!(thumbnail_url === null || thumbnail_url === undefined || typeof thumbnail_url === 'string')) {
    throw new Error('thumbnail_url must be string or null');
  }
  if (!(promotion_note === null || promotion_note === undefined || typeof promotion_note === 'string')) {
    throw new Error('promotion_note must be string or null');
  }
  if (
    !(
      target_student_desc === null ||
      target_student_desc === undefined ||
      typeof target_student_desc === 'string'
    )
  ) {
    throw new Error('target_student_desc must be string or null');
  }
  if (
    !(
      learning_outcome === null ||
      learning_outcome === undefined ||
      typeof learning_outcome === 'string'
    )
  ) {
    throw new Error('learning_outcome must be string or null');
  }
  if (!(created_by === null || created_by === undefined || typeof created_by === 'string')) {
    throw new Error('created_by must be string or null');
  }
  if (!(updated_by === null || updated_by === undefined || typeof updated_by === 'string')) {
    throw new Error('updated_by must be string or null');
  }

  // ===== Optional integer fields (có thể là string) =====

  const accessDurationDaysNum = toOptionalIntegerLike(
    access_duration_days,
    'access_duration_days must be integer or null',
  );
  const displayOrderNum = toOptionalIntegerLike(
    display_order,
    'display_order must be integer or null',
  );

  // ===== Metadata (JSONB) =====

  let parsedMetadata: any | null = null;
  if (metadata !== null && metadata !== undefined) {
    if (typeof metadata === 'string') {
      parsedMetadata = safeJsonParse<any>(metadata, null);
    } else {
      parsedMetadata = metadata;
    }
  }

  // ===== Success Stories (JSON / JSONB / text) =====

  let parsedSuccessStories: SuccessStory[] | null = null;

  if (success_stories !== null && success_stories !== undefined) {
    let raw: any = success_stories;

    if (typeof success_stories === 'string') {
      raw = safeJsonParse<any>(success_stories, null);
    }

    if (Array.isArray(raw)) {
      const list: SuccessStory[] = [];

      raw.forEach((item, idx) => {
        if (!item) return;

        // Hỗ trợ cả image_url (snake_case) và imageUrl (camelCase)
        const imageUrlRaw =
          item.image_url !== undefined ? item.image_url : item.imageUrl;

        const titleRaw = item.title;
        const storyRaw = item.story;

        if (typeof titleRaw !== 'string' || typeof storyRaw !== 'string') {
          throw new Error(
            `success_stories[${idx}] must have title and story as string`,
          );
        }

        const imageUrl =
          typeof imageUrlRaw === 'string' && imageUrlRaw.trim().length > 0
            ? imageUrlRaw
            : '';

        list.push({
          imageUrl,
          title: titleRaw,
          story: storyRaw,
        });
      });

      parsedSuccessStories = list.length > 0 ? list : null;
    } else {
      parsedSuccessStories = null;
    }
  }

  const toDateOrNull = (v: any): Date | null => {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) {
      throw new Error(`Invalid date value: ${v}`);
    }
    return d;
  };

  const createdAt = toDateOrNull(created_at);
  if (!createdAt) {
    throw new Error('created_at is required and must be a valid date');
  }

  return {
    id: idNum,
    productCode: String(product_code),
    productType: String(product_type),

    name: String(name),
    productTitle: String(product_title),
    tutorialVideoUrl: tutorial_video_url ? String(tutorial_video_url) : null,
    saleKitUrl: sale_kit_url ? String(sale_kit_url) : null,
    userGuideLink: user_guide_link ? String(user_guide_link) : null,

    // Đã parse thành mảng SuccessStory[]
    successStories: parsedSuccessStories,

    tagline: tagline ?? null,
    description: description ?? null,
    thumbnailUrl: thumbnail_url ?? null,

    grade: grade ?? null,
    level: level ?? null,
    category: category ?? null,
    subject: subject ?? null,

    priceAmount: priceAmountNum,
    listPriceAmount: listPriceAmountNum,
    priceCurrency: String(price_currency),

    promotionFlag: promotion_flag,
    promotionNote: promotion_note ?? null,

    saleStartAt: toDateOrNull(sale_start_at),
    saleEndAt: toDateOrNull(sale_end_at),
    accessStartAt: toDateOrNull(access_start_at),
    accessEndAt: toDateOrNull(access_end_at),
    accessDurationDays: accessDurationDaysNum,

    status: String(status),
    isVisible: is_visible,
    displayOrder: displayOrderNum,

    targetStudentDesc: target_student_desc ?? null,
    learningOutcome: learning_outcome ?? null,
    metadata: parsedMetadata,

    createdAt,
    createdBy: created_by ?? null,
    updatedAt: toDateOrNull(updated_at),
    updatedBy: updated_by ?? null,
  };
}

/**
 * Parse danh sách row từ DB sang danh sách BMProduct.
 */
export function parseBMProductRows(input: any): BMProduct[] {
  if (!Array.isArray(input)) {
    throw new Error('bm_product rows must be an array');
  }
  return input.map((row, idx) => {
    try {
      return parseBMProductRow(row);
    } catch (e: any) {
      const msg = e?.message || 'unknown error';
      throw new Error(`Failed to parse bm_product row at index ${idx}: ${msg}`);
    }
  });
}

/* =========================================
 * Tiny utils
 * ========================================= */

function safeJsonParse<T = any>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function assertObject(val: any, msg: string): asserts val is Record<string, any> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) throw new Error(msg);
}

function toIntegerLike(val: any, msg: string): number {
  if (typeof val === 'number' && Number.isInteger(val)) return val;
  if (typeof val === 'string' && /^-?\d+$/.test(val.trim())) {
    return Number(val.trim());
  }
  throw new Error(msg);
}

function toOptionalIntegerLike(val: any, msg: string): number | null {
  if (val === null || val === undefined) return null;
  return toIntegerLike(val, msg);
}

function toNumberLike(val: any, msg: string): number {
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  if (typeof val === 'string') {
    const n = Number(val.trim());
    if (!Number.isNaN(n)) return n;
  }
  throw new Error(msg);
}

function toOptionalNumberLike(val: any, msg: string): number | null {
  if (val === null || val === undefined) return null;
  return toNumberLike(val, msg);
}
