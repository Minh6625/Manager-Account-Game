# Requirements FRS - Web Quản Lý Acc Liên Quân

## 1. Mục tiêu

Xây dựng một web nội bộ để các thành viên trong nhóm quản lý trạng thái acc game Liên Quân theo cách thủ công, giúp mọi người biết acc nào đang có người giữ, ai đang chơi, ai quên log out, và tránh tình trạng vào nhầm acc khi đã có người khác sử dụng.

## 2. Phạm vi

Hệ thống bao gồm:

- Đăng nhập nội bộ đơn giản
- Giao diện web responsive, dùng tốt trên cả desktop web và mobile web
- Trang danh sách acc
- Trang chi tiết từng acc
- Quản lý thành viên của acc
- Quản lý trạng thái sử dụng acc
- Lưu lịch sử thay đổi trạng thái

Hệ thống không kết nối trực tiếp với game.
Mọi trạng thái đều do người dùng khai báo thủ công trên web.

## 3. Đối tượng sử dụng

- Thành viên: xem acc, tham gia acc, đăng ký chơi, kết thúc phiên chơi
- Chủ phòng: cũng là một thành viên trong acc/phòng nhưng có thêm quyền riêng như tạo acc, sửa acc, xóa acc, mời thành viên, kick thành viên
- Không có admin hệ thống riêng trong MVP

## 4. Khái niệm chính

- **Acc**: một tài khoản game được nhóm cùng quản lý.
- **Phòng**: không gian quản lý của một acc hoặc nhóm liên quan tới acc đó.
- **Thành viên**: người dùng trong hệ thống có quyền tham gia acc/phòng.
- **Chủ phòng**: một thành viên trong acc/phòng nhưng đồng thời là người có quyền cao nhất trong phạm vi acc/phòng đó.
- Một user có thể là thành viên của nhiều acc và cũng có thể là chủ phòng của nhiều acc.
- **Trạng thái acc**: trạng thái tổng quan của acc tại thời điểm hiện tại.
- **Trạng thái thành viên trong acc**: trạng thái của từng thành viên khi gắn với một acc.

## 5. Cấu trúc màn hình

### 5.1. Trang đăng nhập

- Người dùng đăng nhập bằng tài khoản nội bộ đơn giản.
- Hệ thống hỗ trợ ghi nhớ đăng nhập để người dùng không phải đăng nhập lại nhiều lần khi quay lại web.
- Phiên đăng nhập nên được giữ ổn định khi người dùng truy cập từ cả desktop web và mobile web theo chính sách của hệ thống.
- Không yêu cầu số điện thoại.
- Không yêu cầu xác thực phức tạp cho MVP.

### 5.2. Trang danh sách acc

- Hiển thị danh sách toàn bộ acc mà người dùng có quyền xem.
- Mỗi acc hiển thị tối thiểu:
  - tên acc
  - trạng thái hiện tại
  - người đang giữ acc nếu có
  - thời điểm cập nhật gần nhất
- Cho phép vào trang chi tiết acc.
- Cho phép tạo acc mới nếu người dùng có quyền.

### 5.3. Trang chi tiết acc

- Hiển thị thông tin acc.
- Hiển thị trạng thái hiện tại của acc.
- Hiển thị danh sách thành viên trong acc.
- Hiển thị trạng thái của từng thành viên.
- Hiển thị lịch sử thay đổi trạng thái gần nhất.
- Cho phép thao tác theo quyền.

## 6. Chức năng quản lý acc

### 6.1. Tạo acc

- Người dùng có quyền tạo acc mới từ trang danh sách acc hoặc trang riêng.
- **Tên acc phải unique trong toàn hệ thống** - không cho phép tạo acc trùng tên.
- Khi tạo acc mới, người tạo mặc định là chủ phòng của acc đó.
- Sau khi tạo xong, chủ phòng có thể mời người khác tham gia acc.

### 6.2. Sửa acc

- Chỉ chủ phòng mới được sửa thông tin acc.
- Thông tin có thể sửa gồm tên acc, mô tả, ghi chú hoặc cấu hình hiển thị nếu có.
- Thành viên thường không có quyền sửa.

### 6.3. Xóa acc

- Chỉ chủ phòng mới được xóa acc.
- Khi xóa acc, hệ thống cần xác nhận lại trước khi thực hiện.
- Thành viên thường không có quyền xóa.

### 6.4. Mời thành viên vào acc

- Chủ phòng có thể gửi lời mời thành viên vào acc (theo email).
- Lời mời phải ở trạng thái chờ xác nhận cho đến khi người được mời đồng ý.
- Chỉ sau khi người được mời xác nhận chấp nhận lời mời thì người đó mới trở thành thành viên trong acc.
- Lịch sử mời thành viên và lịch sử xác nhận lời mời phải được ghi lại.
- **Thông báo email bắt buộc trong luồng mời:**
  - Khi chủ phòng **gửi lời mời**, hệ thống phải gửi **email thông báo lời mời** tới địa chỉ email người được mời (nội dung gồm tên acc, người mời, hạn xác nhận 24 giờ, hướng dẫn vào web để chấp nhận/từ chối).
  - Khi người được mời **chấp nhận lời mời**, hệ thống phải gửi **email chào mừng (welcome)** tới email của họ (nội dung xác nhận đã trở thành thành viên, tên acc).
  - Email là kênh bổ sung; người dùng vẫn thao tác accept/reject trên web (in-app). Không thay thế xác nhận trên web bằng link one-click bắt buộc trong MVP.
  - Nếu cấu hình SMTP chưa sẵn sàng ở môi trường dev, hệ thống có thể log nội dung email thay vì gửi thật, nhưng production phải gửi được email thật.

### 6.5. Kick thành viên

- Chủ phòng có thể kick thành viên ra khỏi acc/phòng.
- Sau khi bị kick, thành viên không còn quyền thao tác trong acc đó.
- Nếu thành viên đang ở trạng thái đang chơi hoặc chờ xác nhận log out, hệ thống phải hiển thị rõ trạng thái và ghi lịch sử.

## 7. Trạng thái

### 7.1. Trạng thái acc

- **Rảnh**: không có ai đang giữ acc.
- **Đang có người chơi**: có ít nhất một thành viên đang giữ acc.
- **Chờ xác nhận log out**: người chơi đã kết thúc phiên nhưng chưa xác nhận đã thoát game.
- **Có cảnh báo**: dùng khi có dấu hiệu bất thường hoặc quá hạn nếu team muốn mở rộng sau này.

### 7.2. Trạng thái thành viên trong acc

- **Rảnh**: thành viên chưa giữ acc.
- **Đang chơi**: thành viên hiện đang giữ acc.
- **Chờ xác nhận log out**: thành viên vừa kết thúc chơi nhưng chưa xác nhận đã log out.
- **Bị kick**: thành viên bị chủ phòng loại khỏi acc/phòng.

## 8. Luồng nghiệp vụ chính

### 8.1. Xem danh sách acc

- Người dùng đăng nhập.
- Hệ thống hiển thị danh sách acc mà người dùng có quyền xem, bao gồm acc của chính mình và acc mà mình đã tham gia.
- Trang danh sách acc có phần tab lọc để người dùng chuyển nhanh giữa các nhóm acc.
- Tên tab lọc đề xuất:
  - Tất cả
  - Acc của tôi
  - Acc đã tham gia
- Người dùng chọn một acc để vào trang chi tiết.

### 8.2. Đăng ký vào chơi

- Người dùng mở trang chi tiết acc.
- Nếu acc đang rảnh, người dùng có thể bấm đăng ký chơi.
- Hệ thống chuyển trạng thái thành viên sang đang chơi.
- Hệ thống hiển thị acc là đang có người chơi.

### 8.3. Trường hợp acc đã có người đang chơi

- Nếu acc đang có người giữ, hệ thống từ chối đăng ký mới.
- Hệ thống hiển thị thông báo acc đang có người chơi.
- Người dùng mới không được chuyển sang trạng thái đang chơi.

### 8.4. Kết thúc chơi

- Người dùng bấm kết thúc phiên.
- Hệ thống chuyển sang trạng thái chờ xác nhận log out.
- Hệ thống hỏi xác nhận đã log out acc/game chưa.

### 8.5. Xác nhận đã log out

- Khi người dùng xác nhận đã thoát game, hệ thống chuyển trạng thái về rảnh.
- Acc trở về trạng thái rảnh để người khác vào chơi.

### 8.6. Quên log out

- Nếu người dùng chưa xác nhận log out, trạng thái vẫn giữ là chờ xác nhận log out.
- Trạng thái này phải hiển thị rõ để các thành viên khác biết acc chưa thực sự được trả lại.

### 8.7. Kick thành viên

- Chủ phòng có thể kick thành viên ra khỏi acc/phòng.
- Sau khi bị kick, thành viên không còn quyền thao tác trong acc đó.
- Hành động kick phải được ghi vào lịch sử.

## 9. Quy tắc nghiệp vụ

- Mỗi acc chỉ nên có một thành viên đang chơi tại một thời điểm.
- Trạng thái của acc và trạng thái của thành viên phải đồng bộ với nhau.
- Người dùng chỉ được thao tác trên acc mà mình có quyền xem.
- Chỉ chủ phòng mới được sửa acc và xóa acc.
- Chỉ chủ phòng mới được kick thành viên.
- Mọi thay đổi trạng thái, mời thành viên, sửa acc, xóa acc đều cần ghi lịch sử.
- Mỗi thay đổi trạng thái cần có thời điểm cập nhật gần nhất.

## 10. Dữ liệu cần lưu

- User
- Acc
- Chủ phòng của acc
- Danh sách thành viên của acc
- Trạng thái của từng thành viên trong acc
- Trạng thái tổng quan của acc
- Lịch sử trạng thái
- Lịch sử mời/kick thành viên
- Lịch sử lời mời và xác nhận tham gia acc
- Thời điểm cập nhật gần nhất

## 11. Yêu cầu giao diện

- Giao diện phải responsive, hiển thị tốt trên cả desktop web và mobile web.
- Trên mobile web, giao diện phải tối ưu cho thao tác một tay và hiển thị rõ trên màn hình nhỏ.
- Trang danh sách acc phải dễ nhìn, có trạng thái nổi bật.
- Trang danh sách acc phải có tab lọc rõ ràng để phân biệt acc của tôi, acc đã tham gia và toàn bộ acc được phép xem.
- Trang chi tiết acc phải làm rõ:
  - ai đang chơi
  - ai đang rảnh
  - ai đang chờ xác nhận log out
  - ai bị kick
- Nút thao tác phải hiển thị theo quyền của người dùng.
- Chủ phòng cần nhìn rõ quyền sửa, xóa, mời và kick thành viên.
- Các nút thao tác chính phải đủ lớn và dễ bấm trên điện thoại, đồng thời bố cục vẫn gọn trên màn hình desktop.

## 12. Ngoài phạm vi MVP

- Không tích hợp trực tiếp với game.
- Không xác minh tự động việc người dùng có thật sự đang online trong game.
- Không làm hệ thống bảo mật phức tạp.
- Không cần notification nâng cao hoặc realtime phức tạp ngoài email mời/welcome của luồng invitation.
- Không làm realtime push/websocket ngay từ đầu.
- Không cần cơ chế đăng nhập đa lớp hoặc bảo mật doanh nghiệp, nhưng vẫn phải có ghi nhớ đăng nhập cơ bản cho trải nghiệm trên cả desktop web và mobile web.
- Không làm chức năng thanh toán, nạp tiền, hoặc quản lý tài khoản game thật.

## 13. Acceptance Criteria

- Người dùng đăng nhập được bằng tài khoản nội bộ.
- Người dùng có thể quay lại web mà không phải đăng nhập lại nhiều lần nếu phiên còn hợp lệ.
- Người dùng xem được danh sách acc.
- Người dùng vào được trang chi tiết acc.
- Trang chi tiết acc hiển thị đúng trạng thái và danh sách thành viên.
- Chủ phòng có thể tạo, sửa, xóa acc.
- Chủ phòng có thể mời thành viên vào acc.
- Lời mời phải chờ người dùng xác nhận trước khi người đó trở thành thành viên trong acc.
- Khi gửi lời mời, hệ thống gửi email thông báo tới người được mời.
- Khi người được mời chấp nhận, hệ thống gửi email welcome.
- Chủ phòng có thể kick thành viên.
- Khi có người đang chơi, người khác không thể đăng ký chồng lên.
- Khi kết thúc chơi, hệ thống hỏi xác nhận đã log out.
- Có lịch sử thay đổi trạng thái và thao tác quản lý acc.

## 14. Rủi ro

- Vì trạng thái do người dùng tự khai báo nên có thể sai lệch so với thực tế.
- Người dùng quên đổi trạng thái sẽ làm thông tin bị cũ.
- Nếu không có quy tắc khóa trạng thái rõ ràng, có thể xảy ra xung đột khi nhiều người thao tác cùng lúc.
- Nếu UI không làm rõ trạng thái, người dùng vẫn có thể nhầm lẫn khi vào acc.

## 15. Ghi chú triển khai tuần này

FRS này sẽ được dùng làm đầu vào cho:

- mini plan
- chia task nhỏ 30–90 phút
- tạo prompt.xml cho từng task
- review prompt trước khi giao agent
- agent đọc source/kiến trúc
- engineer review, test, build
- báo cáo thay đổi, kết quả và rủi ro
