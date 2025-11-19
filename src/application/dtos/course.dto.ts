export type CMCourseDto = {
  id: number;
  course_code: string;          // course_code
  title: string;               // title
  description: string | null;  // description
  grade: string;               // grade
  subject: string;             // subject
  sol_image_url: string | null;            // sol_image_url
  teacher_profile_image_url: string | null; // teacher_profile_image_url
  outcome_image_url: string | null;        // outcome_image_url
  plan_image_url: string | null;           // plan_image_url
  created_at: Date | null;
  updated_at: Date | null;
};