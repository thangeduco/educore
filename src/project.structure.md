Cấu trúc project:

1. src/application - Chứa các domain chính của hệ thống, mỗi domain được tổ chức trong một thư mục riêng biệt.
   - CM - Content Management
   - LM - Learning Management
   - IM - Interaction Management
   - BM - Business Management
   - BF - Backend for Frontend

2. Mỗi 1 domain gồm các thư mục con:
   - use-cases - Chứa các sub-domain. Trong mỗi sub-domain chứa các use-case xử lý nghiệp vụ chính của sub-domain đó.
   - dtos - Chứa các định nghĩa DTOs (Data Transfer Objects) để truyền dữ liệu giữa các use-cases. Chung cho toàn bộ các sub-domain của domain đó.


3. src/domain - Chứa các interface nghiệp vụ chính. Bao gồm các thư mục con, mỗi thư mục là 1 domain như BM, CM, LM, IM, BF.

4. Mỗi domain trong src/domain gồm các thư mục con:
   - models - Chứa các entity, value object của domain đó.
   - irepos - Chứa các interface repository (irepo) để định nghĩa các phương thức truy cập dữ liệu cho domain đó.

5. src/infrastructure chứa các thư mục BM, CM, LM, IM, BF và thư mục common.

6. src/infrastructure/BM chứa các file implement các irepos trong src/business/bm-irepos.

7. src/infrastructure/common/db-postgres chứa các file cấu hình kết nối database Postgres chung cho toàn hệ thống.

8. src/interfaces/routes chứa các file route của toàn hệ thống, mỗi domain có một file route riêng biệt, ví dụ bm.routes.ts, cm.routes.ts ...

9. src/interfaces/controllers chứa các thư mục BM, CM, LM, IM, BF

10. src/interfaces/controllers/BM chứa các file controllers, mỗi file là 1 sub-domain xử lý các API của sub-domain đó, ví dụ bm-sale.controller.ts, bm-communication.controller.ts ...