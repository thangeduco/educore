// src/application/BM/dtos/product.dto.ts

export interface BMProductSuccessStoryDto {
  image_url: string;
  title: string;
  story: string;
}

export interface BMProductDto {
  id: number;

  product_code: string;
  product_type: string; // COURSE / BUNDLE / SUBSCRIPTION

  name: string;
  product_title: string | null;
  tutorial_video_url: string | null;
  sale_kit_url: string | null;
  user_guide_link: string | null;

  // ⚠️ TRƯỜNG NÀY ĐÃ ĐƯỢC CHUYỂN TỪ string → JSON ARRAY
  success_stories: BMProductSuccessStoryDto[] | null;

  tagline: string | null;
  description: string | null;
  thumbnail_url: string | null;

  grade: number | null;
  level: number | null;
  category: string | null;
  subject: string | null;

  price_amount: number;
  list_price_amount: number | null;
  price_currency: string;

  promotion_flag: boolean;
  promotion_note: string | null;

  sale_start_at: Date | null;
  sale_end_at: Date | null;
  access_start_at: Date | null;
  access_end_at: Date | null;
  access_duration_days: number | null;

  status: string; // ACTIVE / INACTIVE / DRAFT / ARCHIVED
  is_visible: boolean;
  display_order: number | null;

  target_student_desc: string | null;
  learning_outcome: string | null;
  metadata: any | null;

  created_at: Date;
  created_by: string | null;
  updated_at: Date | null;
  updated_by: string | null;
}
