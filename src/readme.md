Kiến trúc hệ thống:

1. Toàn bộ backend được để trong 1 service cho phát triển nhanh gian đoạn 1

2. Hệ thống được thiết kế theo kiến trúc hexagon để dễ dàng chia tách thành các microservice giai đoạn scale users

 2.1. CM - Content Manaement: Các khoá học, tuần học, bài học, video bài giảng, bài tập về nhà

 2.2. LM - Learning Management: 
   (1) Goals, Plans, Progress, Ranking, Reports
   (2) Học online, làm BTVN, nộp BTVN, chấm điểm, nhận kết quả, xem điểm
   (3) Thiết lập mục tiêu, xây dựng kế hoạch học tập
   (4) Xem tiến độ, xem báo cáo đánh giá, Xem xếp hạng nhóm

 2.3. IM - Interaction Management
   (1) Direct Interaction: Popup 1 video, Popup flash, Popup audio, Popup image, Popup tin nhắn, Hiệu ứng web, Popup câu chuyện cảm hứng, Sticker cảm xúc, Popup command chỉ lệnh, Popup quick quiz selection, Popup quick quiz input answer
   (2) Hỏi đáp học sinh hỏi bài, hỏi đáp trao đổi vs phụ huynh học sinh
   (3) Social Interaction: Chat nhóm, feed nhóm, Thiết lập mục tiêu nhóm, 

2.4. BM - Business Management
   (1) Tài khoản, xác thực, phân quyền, trạng thái dịch vụ
   (2) Thông tin học sinh, phụ huynh, lớp, nhóm, profile, avatar, slogen, Vào ra nhóm
   (3) Common tích hợp Email, sms, mobile app noti, bank để thanh toán / active dịch vụ tự động.
   (4) Product catalog, Quản lý thanh toán, active dịch vụ, chặn dịch vụ, gia hạn dịch vụ
   (5) AI simulator: Gen ảnh thành công của học sinh, Gen video thành công của học sinh, Có giao diện để tương tác gen, Có backend để gen tự động bởi 1 event trigger
 
 2.5. EDUCO-WEB
   (1) Home, giới thiệu dịch vụ, đăng ký, dùng thử
   (2) Thiết lập mục tiêu, học tập, xem tiến độ học tập
   (3) Nhận tương tác

2.6. EDUCO-MOBILE
   (1) Home, giới thiệu dịch vụ, đăng ký, dùng thử
   (2) Xem tiến độ học tập
   (3) Nhận tương tác

 2.7. BF - Backend for Frontend:
   (1) Chỉ route → validate → mapping nhẹ (chuẩn hóa header, error, i18n, reshape field nhỏ)
   (2) Nếu đã login LM là orchestrator domain duy nhất cho tiến độ, điểm, xếp hạng, entitlement.
   (3) Nếu chưa login CM là orchestrator domain duy nhất cho tiến độ, điểm, xếp hạng, entitlement.
   (4) Nếu là BF phức tạp thì chạy qua các service, repo của chính BF và query join trong cơ sở dữ liệu
   (5) Tổ chức BF:
     - BF được tách ra cho các loại front end khác nhau để tối ưu trải nghiệm UI/UX người dùng tốt nhất.
     - Client => interfaces/routes/BF => interfaces/controllers/BF => application/BF => application/LM
     - Loại phức tạ, report: Client => interfaces/routes/BF => interfaces/controllers/BF => application/BF =>  repo của BF

Cấu trúc project theo file project.structure.md
