# Task Breakdown - Case Study Web Quản Lý Acc Liên Quân

## 1. Mục tiêu

Chia case study web quản lý trạng thái acc Liên Quân thành các task nhỏ 30–90 phút để viết prompt.xml và giao cho AI Agent Code thực hiện đúng scope.

## Mục lục

- [2. Kiến trúc kỹ thuật đã chốt](#2-kiến-trúc-kỹ-thuật-đã-chốt)
  - [2.6. Kiến trúc thư mục dự án theo feature-first](#26-kiến-trúc-thư-mục-dự-án-theo-feature-first)
- [3. Mục tiêu sản phẩm](#3-mục-tiêu-sản-phẩm)
- [4. Phạm vi MVP](#4-phạm-vi-mvp)
- [5. Nhóm chức năng chính](#5-nhóm-chức-năng-chính)
- [6. Quy ước chung để viết task và prompt](#6-quy-ước-chung-để-viết-task-và-prompt)
- [7. Quy tắc nghiệp vụ chính](#7-quy-tắc-nghiệp-vụ-chính)
- [12. Task chi tiết 30–90 phút](#12-task-chi-tiết-3090-phút)

## 2. Kiến trúc kỹ thuật đã chốt

### 2.1. Tech Stack

- Frontend: React + Vite + TypeScript
- API: Node.js + Express + TypeScript
- Database: Supabase Free (PostgreSQL)
- ORM: Prisma
- Deploy: Vercel cho frontend; API deploy cùng nền tảng phù hợp với Vercel hoặc service riêng nếu cần

### 2.2. Auth flow

- User đăng ký bằng email
- Login bằng email/password
- Forgot password qua OTP/email
- Session nhớ 7 ngày nếu còn hợp lệ
- Dùng cookie/httpOnly hoặc cơ chế session tương đương để giữ phiên an toàn hơn local storage

### 2.3. Data model mức cao

- user: id, email, password_hash, display_name, created_at, updated_at
- acc: id, name, owner_user_id, status, note, created_at, updated_at
- membership: id, acc_id, user_id, role, member_status, joined_at, left_at
- invitation: id, acc_id, invited_user_id or invited_email, invited_by_user_id, status, expires_at, created_at, responded_at
- status_history: id, acc_id, user_id, action_type, from_status, to_status, created_at, note

### 2.4. Boundary gợi ý

- /auth/\*
- /accs
- /accs/:id
- /accs/:id/members
- /accs/:id/invitations
- /accs/:id/status
- /history

### 2.5. Decision notes

- Một acc chỉ có 1 người đang chơi tại một thời điểm.
- Chủ phòng cũng là member nhưng có quyền riêng.
- Lời mời hết hạn sau 24 giờ nếu chưa xác nhận.
- Mỗi acc tối đa 5 member.
- Acc của tôi = acc do tôi tạo hoặc đang làm chủ phòng.
- Acc đã tham gia = acc do người khác tạo mà tôi đã xác nhận tham gia.
- Chỉ chủ phòng mới được sửa/xóa acc, mời/kick member, và có quyền ép reset trạng thái nếu cần.

### 2.6. Kiến trúc thư mục dự án theo feature-based module

Chọn feature-based module vì đây là cấu trúc phổ biến, dễ hiểu, dễ quản lý và dễ mở rộng cho MVP. Cách này ít tầng hơn FSD, dễ chia theo màn hình và theo nghiệp vụ, nên hợp với team nhỏ và agent code.

#### Frontend

```text
apps/web/src/
  pages/
    login/
    acc-list/
    acc-detail/
    profile/
  components/
    common/
    layout/
    widgets/
  features/
    auth/
    acc-management/
    invite-member/
    play-session/
    membership/
  shared/
    api/
    ui/
    hooks/
    lib/
    constants/
    types/
```

#### Backend

```text
apps/api/src/
  app/
    server.ts
    routes.ts
    middleware/
    config/
  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      auth.schemas.ts
    accs/
      acc.routes.ts
      acc.controller.ts
      acc.service.ts
      acc.repository.ts
      acc.schemas.ts
    memberships/
    invitations/
    history/
  infra/
    prisma/
    db/
    logger/
  shared/
    errors/
    utils/
    constants/
    types/
```

#### Shared package nếu cần

```text
packages/shared/
  src/
    types/
    validators/
    constants/
    dto/
```

#### Giải thích từng thư mục

##### Frontend

- `pages`: mỗi folder là một màn hình chính như login, danh sách acc, chi tiết acc, profile. Đây là nơi ghép UI ở cấp trang, ít logic nghiệp vụ.
- `components`: chứa UI dùng lại nhiều nơi. `common` là component nhỏ dùng chung, `layout` là khung bố cục, `widgets` là khối UI lớn hơn như header, sidebar, panel trạng thái.
- `features`: chứa các luồng nghiệp vụ theo hành động, ví dụ đăng nhập, quản lý acc, mời member, xử lý phiên chơi, xử lý membership. Đây là nơi đặt logic tương tác chính của người dùng.
- `shared`: chứa phần dùng chung thật sự cho toàn app, như API client, UI primitives, hooks chung, helper, hằng số, và type dùng lại nhiều nơi.

##### Backend

- `app`: phần khởi động ứng dụng, khai báo server, routes chính, middleware và config nền.
- `modules`: nơi tách theo domain nghiệp vụ. Mỗi module như auth, accs, memberships, invitations, history sẽ gom route, controller, service, repository và schema liên quan.
- `infra`: phần hạ tầng kỹ thuật như Prisma, kết nối database, logger và các integration bên ngoài.
- `shared`: code dùng chung cho backend, ví dụ errors, utils, constants, types.

##### Shared package

- `packages/shared`: nếu cần chia sẻ type, validator, constant hoặc DTO giữa web và api thì để ở đây để tránh lặp và lệch kiểu dữ liệu.

#### Quy tắc áp dụng

- `pages` chỉ ghép màn hình, không chứa nghiệp vụ nặng.
- `components` chứa UI dùng lại, gồm layout và các widget nhỏ.
- `features` chứa các luồng hành động như mời member, đăng ký chơi, xác nhận logout.
- `shared` chỉ dùng cho code thật sự dùng lại ở nhiều feature.
- Nếu một nghiệp vụ lớn lên thì tách thành feature riêng, không cần thêm nhiều layer mới.
- Backend đi theo module theo domain, service giữ rule nghiệp vụ, repository chỉ bọc Prisma.
- Nếu một feature lớn lên, tách tiếp trong cùng module thay vì tạo kiến trúc nhiều tầng mới.

## 3. Mục tiêu sản phẩm

- Cho phép người dùng đăng nhập nội bộ đơn giản.
- Cho phép người dùng xem danh sách acc theo tab lọc.
- Cho phép người dùng xem chi tiết từng acc.
- Cho phép chủ phòng quản lý acc và thành viên trong acc.
- Cho phép thành viên đăng ký chơi, kết thúc phiên và xác nhận log out.
- Cho phép hiển thị rõ trạng thái acc và trạng thái từng thành viên.
- Hỗ trợ web responsive trên cả desktop web và mobile web.
- Hỗ trợ ghi nhớ đăng nhập để người dùng không phải đăng nhập lại nhiều lần khi quay lại web.

## 4. Phạm vi MVP

### Trong phạm vi

- Đăng nhập nội bộ đơn giản
- Giao diện responsive cho desktop web và mobile web
- Ghi nhớ đăng nhập cơ bản
- Trang danh sách acc
- Tab lọc: Tất cả, Acc của tôi, Acc đã tham gia
- Trang chi tiết acc
- Trạng thái acc và trạng thái thành viên
- Tạo acc
- Sửa acc
- Xóa acc
- Mời thành viên vào acc
- Kick thành viên
- Luồng mời thành viên phải chờ xác nhận
- Luồng đăng ký chơi và kết thúc phiên
- Lịch sử thay đổi trạng thái và lịch sử mời/kick

### Ngoài phạm vi

- Tích hợp trực tiếp với game
- Tự động xác minh trạng thái trong game
- Realtime phức tạp
- Notification nâng cao
- Bảo mật doanh nghiệp hoặc xác thực nhiều lớp
- Thanh toán, nạp tiền, quản lý tài khoản game thật

## 5. Nhóm chức năng chính

### 5.1. Xác thực và truy cập

- Đăng nhập bằng tài khoản nội bộ
- Ghi nhớ đăng nhập
- Giữ session khi phiên còn hợp lệ

### 5.2. Danh sách acc

- Hiển thị danh sách acc người dùng được xem
- Lọc theo:
  - Tất cả
  - Acc của tôi
  - Acc đã tham gia
- Hiển thị trạng thái acc và người đang giữ acc nếu có
- Hỗ trợ search acc theo tên

### 5.3. Chi tiết acc

- Hiển thị thông tin acc
- Hiển thị trạng thái acc
- Hiển thị danh sách thành viên
- Hiển thị trạng thái từng thành viên
- Hiển thị lịch sử gần nhất

### 5.4. Quản lý acc

- Tạo acc
- Sửa acc
- Xóa acc
- Chỉ chủ phòng có các quyền quản lý này

### 5.5. Quản lý thành viên

- Chủ phòng gửi lời mời
- Người được mời xác nhận trước khi trở thành thành viên
- Chủ phòng kick thành viên
- Ghi lịch sử lời mời, xác nhận và kick

### 5.6. Quản lý trạng thái sử dụng acc

- Đăng ký chơi khi acc còn rảnh
- Từ chối nếu acc đang có người giữ
- Kết thúc phiên
- Xác nhận đã log out
- Hiển thị trạng thái chờ xác nhận nếu người chơi chưa logout

## 6. Quy ước chung để viết task và prompt

- **Ghi nhớ đăng nhập**: phiên đăng nhập được xem là còn hợp lệ trong **7 ngày** kể từ lần đăng nhập gần nhất nếu user không chủ động đăng xuất và phiên chưa bị thu hồi.
- **Tên acc phải unique**: không cho phép tạo acc trùng tên trong toàn hệ thống.
- **Tab lọc danh sách acc**:
  - **Tất cả**: toàn bộ acc mà user có quyền xem.
  - **Acc của tôi**: acc do user tạo hoặc đang là chủ phòng.
  - **Acc đã tham gia**: acc mà user là thành viên nhưng không phải chủ phòng.
- **Luồng mời thành viên**: khi chủ phòng mời, member phải ở trạng thái **chờ xác nhận**; chỉ khi xác nhận chấp nhận mới chuyển thành thành viên chính thức.
- **Luồng mời thành viên**: lời mời hết hạn sau **24 giờ** nếu chưa xác nhận.
- **Giới hạn member**: mỗi acc chỉ có tối đa **5 member**.
- **Trạng thái chơi**: mỗi acc chỉ có tối đa **1 người đang chơi** tại một thời điểm.
- **Trạng thái chờ xác nhận log out**: không tự chuyển hết hạn trong MVP; chỉ đổi khi người chơi xác nhận đã log out hoặc có can thiệp quản trị/chủ phòng.
- **Quyền ép reset**: chủ phòng có thể ép reset trạng thái khi acc bị kẹt ở trạng thái không đúng.
- **Lịch sử gần nhất**: trên trang chi tiết acc, hiển thị lịch sử với khả năng xem thêm trong **3 ngày gần nhất**.
- **Quyền chủ phòng**: chỉ chủ phòng được tạo/sửa/xóa acc, mời/kick thành viên; chủ phòng vẫn là một thành viên bình thường trong acc.

## 7. Quy tắc nghiệp vụ chính

- Mỗi acc chỉ có một người đang chơi tại một thời điểm.
- Chủ phòng là một thành viên nhưng có thêm quyền riêng.
- Tên acc phải unique - không được trùng lặp trong toàn hệ thống.
- Lời mời chỉ có hiệu lực khi người được mời xác nhận chấp nhận.
- Thành viên chỉ trở thành member của acc sau khi xác nhận lời mời.
- Mọi thay đổi trạng thái phải được lưu lịch sử.
- Trạng thái acc và trạng thái thành viên phải đồng bộ.
- Giao diện phải rõ ràng trên cả desktop web và mobile web.

## 8. Dữ liệu lõi cần có

- User
- Acc
- Chủ phòng của acc
- Thành viên của acc
- Lời mời tham gia acc
- Trạng thái thành viên trong acc
- Trạng thái tổng quan của acc
- Lịch sử trạng thái
- Lịch sử lời mời và xác nhận
- Lịch sử kick
- Thời điểm cập nhật gần nhất

## 9. Cấu trúc màn hình dự kiến

### 9.1. Trang đăng nhập

- Login nội bộ đơn giản
- Ghi nhớ đăng nhập

### 9.2. Trang danh sách acc

- Tab lọc danh sách
- Card hoặc row acc
- Badge trạng thái
- Thông tin người đang giữ acc nếu có
- Search acc

### 9.3. Trang chi tiết acc

- Thông tin acc
- Danh sách thành viên
- Trạng thái từng thành viên
- Nút thao tác theo quyền
- Lịch sử gần nhất

### 9.4. Modal / luồng xác nhận

- Xác nhận mời
- Xác nhận đăng ký chơi
- Xác nhận kết thúc phiên / đã log out
- Xác nhận xóa acc
- Xác nhận kick thành viên

## 10. Chiến lược chia task

### Nhóm A - Nền tảng truy cập

- Tạo/chuẩn hóa đăng nhập nội bộ
- Ghi nhớ đăng nhập
- Bảo vệ route cơ bản

### Nhóm B - Danh sách acc

- Tab lọc
- Hiển thị danh sách acc
- Badge trạng thái và thông tin liên quan
- Search acc

### Nhóm C - Chi tiết acc

- Layout chi tiết acc
- Danh sách thành viên
- Trạng thái thành viên
- Lịch sử gần nhất

### Nhóm D - Quản lý acc và thành viên

- Tạo/sửa/xóa acc
- Mời thành viên
- Kick thành viên
- Luồng xác nhận lời mời

### Nhóm E - Quản lý trạng thái chơi

- Đăng ký chơi
- Chặn khi đang có người giữ acc
- Kết thúc phiên
- Xác nhận logout

## 11. Ưu tiên triển khai

### Ưu tiên 0

- Chốt kiến trúc, schema và công nghệ

### Ưu tiên 1

- Đăng nhập + ghi nhớ đăng nhập
- Danh sách acc + tab lọc
- Chi tiết acc + trạng thái hiển thị

### Ưu tiên 2

- Mời thành viên và xác nhận tham gia
- Luồng đăng ký chơi và xác nhận logout

### Ưu tiên 3

- Tạo/sửa/xóa acc
- Kick thành viên
- Lịch sử và audit các thao tác

## 12. Task chi tiết 30–90 phút

### Task 0 - Chốt kiến trúc, schema và công nghệ

**Mục tiêu**

- Chốt frontend, API, database, auth flow, data model và ranh giới hệ thống trước khi code.

**Scope được phép**

- Chốt React + Vite + TypeScript cho frontend.
- Chốt Node.js + Express + TypeScript cho API.
- Chốt Supabase Free (PostgreSQL) cho database.
- Chốt auth email/password, đăng ký bằng email và quên mật khẩu qua OTP/email.
- Chốt schema mức cao cho user, acc, member, invitation, status history, session.
- Chốt rule: 7 ngày session, 3 tab danh sách, 24h invitation, tối đa 5 member, chủ phòng là member có quyền riêng.

**Scope không được làm**

- Không code feature thực tế.
- Không xây dựng UI chi tiết.
- Không tối ưu performance sâu.

**Output cần có**

- Bản chốt kiến trúc ngắn gọn.
- Danh sách entity và quan hệ chính.
- Danh sách quyết định công nghệ.
- Danh sách rule nghiệp vụ cần bám theo ở các task sau.

**Acceptance Criteria**

- Team có thể dùng output này làm đầu vào để viết prompt.xml.
- Các task sau không phải tự đoán stack, auth, DB và rule chính.
- Có ít nhất 1 sơ đồ/ghi chú mô tả ranh giới frontend, API và DB.

**Test Plan**

- Review chéo tài liệu kiến trúc.
- Đối chiếu rule với FRS.
- Kiểm tra xem các task sau có thể trích xuất scope từ tài liệu này không.

**Ước lượng**

- 30–60 phút

### Task 1 - Thiết lập đăng nhập nội bộ và ghi nhớ phiên

**Mục tiêu**

- User đăng nhập bằng tài khoản nội bộ đơn giản.
- Phiên được ghi nhớ để quay lại web trong vòng 7 ngày vẫn đăng nhập nếu phiên còn hợp lệ.

**Scope được phép**

- Tạo hoặc chuẩn hóa flow đăng nhập nội bộ.
- Lưu trạng thái đăng nhập.
- Giữ session/token còn hợp lệ.
- Hiển thị trạng thái đăng nhập cơ bản.

**Scope không được làm**

- Không làm xác thực đa lớp.
- Không làm social login hoặc SSO.
- Không mở rộng sang cơ chế bảo mật doanh nghiệp.
- Không chỉnh luồng quản lý acc.

**Output cần có**

- Luồng đăng nhập hoạt động.
- Ghi nhớ đăng nhập cơ bản.
- Mô tả ngắn cách session/persistence được giữ.

**Acceptance Criteria**

- User đăng nhập được bằng tài khoản nội bộ.
- User quay lại web vẫn còn đăng nhập nếu phiên còn hợp lệ trong 7 ngày.
- Sau 7 ngày hoặc khi user đăng xuất thủ công, phải đăng nhập lại.
- Không bị yêu cầu đăng nhập lại liên tục khi reload trang hoặc mở lại tab trong thời gian phiên còn hợp lệ.

**Test Plan**

- Đăng nhập lần đầu và reload trang.
- Đóng/mở lại tab hoặc quay lại web.
- Kiểm tra phiên còn hợp lệ trong 7 ngày thì vẫn vào được.
- Kiểm tra khi session hết hạn hoặc đã đăng xuất thì hệ thống yêu cầu đăng nhập lại.

**Ước lượng**

- 30–60 phút

### Task 2 - Trang danh sách acc và tab lọc

**Mục tiêu**

- Hiển thị danh sách acc theo tab lọc: Tất cả, Acc của tôi, Acc đã tham gia.

**Scope được phép**

- Tạo hoặc chuẩn hóa UI danh sách acc.
- Thêm tab lọc.
- Hiển thị badge trạng thái acc.
- Hiển thị người đang giữ acc nếu có.
- Bảo đảm responsive trên desktop web và mobile web.
- Thêm search acc.

**Scope không được làm**

- Không làm chi tiết acc.
- Không làm xử lý mời thành viên.
- Không làm luồng đăng ký chơi.

**Output cần có**

- Danh sách acc hiển thị theo tab.
- Tab lọc hoạt động đúng.
- UI gọn, dễ dùng trên desktop và mobile.
- Search acc hoạt động theo tên acc.

**Acceptance Criteria**

- Có 3 tab: Tất cả, Acc của tôi, Acc đã tham gia.
- Tất cả hiển thị toàn bộ acc mà user có quyền xem.
- Acc của tôi chỉ hiển thị acc do user tạo hoặc đang là chủ phòng.
- Acc đã tham gia chỉ hiển thị acc mà user là thành viên nhưng không phải chủ phòng.
- Tab đổi đúng dữ liệu danh sách.
- Badge trạng thái và người đang giữ acc hiển thị đúng.
- Có ô search acc và nó lọc đúng danh sách.
- Giao diện dùng được tốt trên mobile web.

**Test Plan**

- Chuyển qua lại 3 tab và kiểm tra dữ liệu hiển thị.
- Kiểm tra trạng thái acc có badge rõ ràng.
- Kiểm tra search acc.
- Kiểm tra giao diện trên màn hình nhỏ.

**Ước lượng**

- 45–90 phút

### Task 3 - Trang chi tiết acc và trạng thái thành viên

**Mục tiêu**

- Hiển thị đầy đủ thông tin acc, danh sách thành viên và trạng thái từng thành viên.

**Scope được phép**

- Xây dựng hoặc chuẩn hóa layout trang chi tiết acc.
- Hiển thị thông tin acc.
- Hiển thị danh sách thành viên.
- Hiển thị trạng thái thành viên.
- Hiển thị lịch sử với khả năng xem thêm trong 3 ngày gần nhất.
- Hiển thị nút thao tác theo quyền.

**Scope không được làm**

- Không làm luồng mời thành viên.
- Không làm luồng đăng ký chơi.
- Không làm tạo/sửa/xóa acc.

**Output cần có**

- Trang chi tiết acc đầy đủ thông tin chính.
- Badge/trạng thái thành viên rõ ràng.
- Bố cục đáp ứng responsive.

**Acceptance Criteria**

- Trang chi tiết hiển thị đúng trạng thái acc.
- Hiển thị được chủ phòng, người đang giữ acc, và trạng thái tổng quan của acc.
- Danh sách thành viên và trạng thái từng thành viên nhìn rõ.
- Có phần lịch sử với khả năng xem thêm trong 3 ngày gần nhất.
- Nút thao tác hiển thị theo quyền.

**Test Plan**

- Mở chi tiết acc có dữ liệu khác nhau.
- Kiểm tra trạng thái thành viên.
- Kiểm tra hiển thị lịch sử và khả năng xem thêm.
- Kiểm tra quyền hiển thị nút theo vai trò.
- Kiểm tra giao diện desktop và mobile.

**Ước lượng**

- 60–90 phút

### Task 4 - Luồng mời thành viên vào acc

**Mục tiêu**

- Chủ phòng có thể mời thành viên vào acc.
- Lời mời phải chờ xác nhận trước khi người được mời trở thành thành viên.

**Scope được phép**

- Tạo luồng mời thành viên.
- Hiển thị trạng thái lời mời chờ xác nhận.
- Cho phép người được mời chấp nhận lời mời.
- Ghi lịch sử lời mời và xác nhận.

**Scope không được làm**

- Không cho thêm thẳng thành viên mà bỏ qua lời mời.
- Không làm luồng kick thành viên.
- Không làm luồng đăng ký chơi.

**Output cần có**

- Trạng thái invitation pending.
- Trạng thái accepted sau khi xác nhận.
- Người được mời chỉ trở thành member sau khi chấp nhận.
- Trạng thái member sau khi chấp nhận phải xuất hiện trong danh sách thành viên của acc.

**Acceptance Criteria**

- Lời mời không chuyển thành member ngay lập tức.
- Sau khi xác nhận, người được mời mới trở thành thành viên.
- Nếu chưa xác nhận thì user vẫn ở trạng thái chờ, không tính là thành viên chính thức của acc.
- Lời mời hết hạn sau 24 giờ nếu chưa xác nhận.
- Mỗi acc không vượt quá 5 member.
- Lịch sử mời và xác nhận được lưu lại.

**Test Plan**

- Tạo lời mời và kiểm tra trạng thái chờ.
- Xác nhận lời mời và kiểm tra member được thêm.
- Kiểm tra trường hợp lời mời chưa xác nhận thì không xuất hiện như member chính thức.
- Kiểm tra lời mời hết hạn sau 24 giờ.

**Ước lượng**

- 60–90 phút

### Task 5 - Luồng đăng ký chơi và xác nhận log out

**Mục tiêu**

- Thành viên có thể đăng ký chơi khi acc đang rảnh.
- Khi kết thúc phiên, hệ thống yêu cầu xác nhận đã log out.
- Nếu acc đang có người giữ thì người khác không được đăng ký chồng lên.

**Scope được phép**

- Tạo hoặc chuẩn hóa luồng đăng ký chơi.
- Chặn khi acc đang có người giữ.
- Chuyển trạng thái sang chờ xác nhận khi kết thúc phiên.
- Xác nhận log out để hoàn tất trả acc.
- Ghi lịch sử thay đổi trạng thái.

**Scope không được làm**

- Không tích hợp vào game thật.
- Không làm realtime phức tạp.
- Không làm thay đổi luồng mời thành viên.

**Output cần có**

- Trạng thái đang chơi.
- Trạng thái chờ xác nhận log out.
- Trạng thái rảnh sau khi xác nhận hoàn tất.
- Lịch sử trạng thái tương ứng.
- UI báo rõ nếu acc đang bị giữ bởi người khác thì không cho đăng ký.

**Acceptance Criteria**

- Khi acc đang rảnh, member có thể đăng ký chơi.
- Khi acc đang có người giữ, người khác bị từ chối.
- Khi kết thúc phiên, hệ thống yêu cầu xác nhận log out.
- Sau xác nhận, acc trở về trạng thái rảnh.
- Trạng thái chờ xác nhận log out không tự biến mất cho đến khi có hành động xác nhận hoặc can thiệp quản trị/chủ phòng.
- Chủ phòng có thể ép reset trạng thái khi acc bị kẹt ở trạng thái không đúng.

**Test Plan**

- Đăng ký chơi từ trạng thái rảnh.
- Thử đăng ký khi đang có người giữ.
- Kết thúc phiên và kiểm tra trạng thái chờ xác nhận.
- Xác nhận log out và kiểm tra trạng thái cuối.
- Kiểm tra hành vi ép reset trạng thái.

**Ước lượng**

- 60–90 phút

### Task 6 - CRUD Account (Tạo/Sửa/Xóa acc)

**Mục tiêu**

- Chủ phòng có thể quản lý thông tin acc: tạo mới, chỉnh sửa và xóa acc.

**Scope được phép**

- Tạo acc mới.
- Sửa thông tin acc (tên, note).
- Xóa acc.
- Hiển thị/ẩn nút theo quyền chủ phòng.
- Ghi lịch sử thao tác CRUD acc.
- Modal xác nhận trước khi xóa acc.

**Scope không được làm**

- Không làm kick thành viên (Task 7).
- Không thêm thẳng thành viên (Task 4).
- Không làm trạng thái chơi (Task 5).

**Output cần có**

- Form tạo acc mới.
- Form sửa thông tin acc.
- Nút và modal xóa acc.
- Lịch sử thao tác CRUD được lưu.

**Acceptance Criteria**

- Chỉ chủ phòng mới thấy và dùng được nút tạo/sửa/xóa acc.
- Khi tạo acc mới, người tạo tự động là chủ phòng.
- Sửa acc chỉ áp dụng cho tên và note.
- Khi xóa acc phải có modal xác nhận rõ ràng trước khi thực thi.
- Thành viên thường không thấy các nút quản lý acc.

**Test Plan**

- Kiểm tra nút với vai trò chủ phòng và thành viên thường.
- Tạo acc mới và kiểm tra quyền tự động.
- Sửa thông tin acc và kiểm tra cập nhật.
- Thử xóa acc và kiểm tra modal xác nhận.
- Verify lịch sử được ghi đúng.

**Ước lượng**

- 60–90 phút

### Task 7 - Kick thành viên

**Mục tiêu**

- Chủ phòng có thể loại thành viên ra khỏi acc/phòng.

**Scope được phép**

- Kick thành viên ra khỏi acc.
- Hiển thị/ẩn nút kick theo quyền chủ phòng.
- Ghi lịch sử kick thành viên.
- Modal xác nhận trước khi kick.
- Cập nhật trạng thái thành viên sau khi bị kick.

**Scope không được làm**

- Không làm CRUD acc (Task 6).
- Không làm mời thành viên (Task 4).
- Không làm trạng thái chơi (Task 5).

**Output cần có**

- Nút kick thành viên trong danh sách member.
- Modal xác nhận trước khi kick.
- Trạng thái member chuyển sang "KICKED".
- Lịch sử kick được lưu.
- Member bị kick không còn quyền thao tác trong acc.

**Acceptance Criteria**

- Chỉ chủ phòng mới thấy và dùng được nút kick.
- Thành viên bị kick không còn quyền thao tác trong acc đó.
- Khi kick phải có modal xác nhận rõ ràng trước khi thực thi.
- Nếu thành viên đang chơi hoặc chờ xác nhận logout, vẫn có thể kick nhưng phải hiển thị cảnh báo rõ.
- Lịch sử kick được ghi với thời điểm và người thực hiện.

**Test Plan**

- Kiểm tra nút kick với vai trò chủ phòng và thành viên thường.
- Thử kick thành viên và kiểm tra modal xác nhận.
- Verify thành viên bị kick không còn truy cập acc.
- Kiểm tra kick member đang trong trạng thái chơi.
- Verify lịch sử kick được ghi đúng.

**Ước lượng**

- 30–45 phút

## 13. Rủi ro chính

- Scope dễ phình nếu khi triển khai thực tế lại mở thêm realtime hoặc tích hợp game ngoài MVP.
- Agent hoặc engineer có thể hiểu sai rule đã chốt, đặc biệt ở các luồng xác nhận lời mời, trạng thái chơi và quyền chủ phòng.
- UI/UX có thể bị làm quá phức tạp trên mobile nếu không giữ bố cục gọn và ưu tiên thao tác chính.
- Ghi nhớ đăng nhập có thể hoạt động chưa ổn định nếu session/persistence chưa được kiểm thử đủ trên cả desktop web và mobile web.
- Nếu review và test không bám theo acceptance criteria, output của agent có thể đúng về code nhưng sai về hành vi mong muốn.

## 14. Output mong đợi từ mini plan này

- Có thể chia ngay thành task nhỏ 30–90 phút
- Có thể viết prompt.xml cho từng task
- Có thể giao task cho agent trong scope rõ ràng
- Có thể review, test và báo cáo sau mỗi task
