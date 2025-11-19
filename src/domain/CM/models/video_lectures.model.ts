// src/domain/models/video-lectures.model.ts

export interface VideoLecture {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: number; // tính theo giây
  tags: string[];   // mảng chuỗi, nếu bạn lưu kiểu ARRAY trong PostgreSQL
}
