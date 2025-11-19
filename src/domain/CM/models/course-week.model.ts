export interface CourseWeek {
  id: number;
  weekNumber: number;
  weekTitle: string;
  weekDescription?: string;
  
  courseId: number;
  courseTile: string;
  courseDescription: string;
}
