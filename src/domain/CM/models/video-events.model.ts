// ===== LOẠI SỰ KIỆN HỖ TRỢ =====
export type VideoEventType = 'quiz' | 'audio' | 'video' | 'image'; // add more here as needed

// ===== MÔ HÌNH EVENT TỔNG QUÁT =====
export interface VideoEvent {
  event_id: number;
  video_id: number;
  event_type: VideoEventType;
  trigger_ref_id: number;
  start_time: number;       // thời điểm sự kiện xảy ra trong video
  display_order: number;    // thứ tự sự kiện hiển thị.
  event_data:
    | VideoChoiceQuiz[] // Mảng các câu hỏi trắc nghiệm
    | VideoAudioEventData // Dữ liệu cho sự kiện audio
    | VideoVideoEventData // Dữ liệu cho sự kiện video
    | VideoImageEventData; // Dữ liệu cho sự kiện hình ảnh
}

// ===== 1. QUIZ EVENTS =====
export interface VideoChoiceQuiz {
  quiz_id : number; // ID của quiz. Quiz gắn với video bài giảng.
  video_event_id: number; // ID của event liên quan

  //Câu hỏi và điều khiển luồng câu hỏi.
  content: string; // Nội dung câu hỏi
  choices: VideoChoice[]; // Danh sách các lựa chọn
  next_quiz_on_correct?: number; // ID của quiz tiếp theo nếu trả lời đúng. Null thì dừng.
  next_quiz_on_wrong?: number; // ID của quiz tiếp theo nếu trả lời sai. Null thì dừng.

  //Hiệu ứng khi học sinh trả lời câu hỏi lấy từ kho user_choice_quiz_feedback_templates
  // Hiệu ứng gắn với học sinh
  template_id: number; // ID của template hiệu ứng
  student_id: number; // ID của học sinh 
  first_audio_url: string;
  correct_feedback_text: string;
  correct_feedback_audio_url: string;
  correct_feedback_animation: string;
  wrong_feedback_text: string;
  wrong_feedback_audio_url: string;
  wrong_feedback_animation: string;
  last_audio_url: string;
}

export interface VideoChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string; // Giải thích nếu cần
}


// ===== 2. AUDIO EVENTS DATA gắn với học sinh =====
export interface VideoAudioEventData {
  audio_profile_id: number; // ID của audio profile 
  audio_url: string; // URL của audio file
  display_text: string; // Văn bản hiển thị khi audio được phát
  animation_type?: string; // Loại animation sẽ sử dụng khi phát audio
  student_id: number; // ID của học sinh 
}

// ===== 3. VIDEO EVENTS =====
export interface VideoVideoEventData {
  video_profile_id: number; // ID của video profile 
  video_url: string; // URL của video file
  display_text: string; // Văn bản hiển thị khi video được phát
  animation_type?: string; // Loại animation sẽ sử dụng khi phát video
  student_id: number; // ID của học sinh 

}

// ===== 4. IMAGE EVENTS =====
export interface VideoImageEventData {
  iamge_profile_id: number; // ID của image profile
  image_url: string;
  display_text?: string;
  animation_type?: string;
  student_id: number; // ID của học sinh
}
