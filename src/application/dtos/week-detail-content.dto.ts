// src/application/course/dtos/week-detail-content.dto.ts
export interface VideoLecture {
  id: number;
  title: string;
  url: string;
  duration?: number;
}

export interface Worksheet {
  id: number;
  title: string;
  downloadUrl: string;
}

export interface WeekDetailContent {
  id: number;
  courseWeekId: number;
  weekNumber: number;
  weekTitle?: string;
  weekDescription?: string;
  contentType: 'video' | 'worksheet';
  contentId: number;
  step: number;
  videoLecture?: VideoLecture;
  worksheet?: Worksheet;
} 
