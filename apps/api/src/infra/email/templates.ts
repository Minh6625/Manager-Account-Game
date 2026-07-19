import {
  INVITE_EXPIRY_HOURS,
  LOGOUT_REMINDER_MINUTES,
} from '@manager-acc/shared';

export interface InvitationEmailParams {
  toEmail: string;
  accName: string;
  inviterName: string;
  expiresAt: Date;
  appUrl: string;
}

export interface WelcomeEmailParams {
  toEmail: string;
  displayName: string;
  accName: string;
  appUrl: string;
}

export interface LogoutReminderEmailParams {
  toEmail: string;
  displayName: string;
  accName: string;
  accId: string;
  endedAt: Date;
  appUrl: string;
  reminderMinutes?: number;
}

function formatViDate(date: Date): string {
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function buildInvitationEmail(params: InvitationEmailParams): {
  subject: string;
  text: string;
  html: string;
} {
  const expires = formatViDate(params.expiresAt);
  const subject = `[Manager Acc] Lời mời tham gia acc "${params.accName}"`;

  const text = [
    `Xin chào,`,
    ``,
    `${params.inviterName} đã mời bạn tham gia acc "${params.accName}" trên Manager Account Liên Quân.`,
    ``,
    `Lời mời hết hạn sau ${INVITE_EXPIRY_HOURS} giờ (trước ${expires}).`,
    `Bạn chỉ trở thành thành viên sau khi đăng nhập web và bấm Chấp nhận.`,
    ``,
    `Mở ứng dụng: ${params.appUrl}`,
    `Đăng nhập bằng email này (${params.toEmail}) nếu đã có tài khoản, hoặc đăng ký rồi vào trang Danh sách tài khoản để xem lời mời.`,
    ``,
    `— Manager Account Liên Quân`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <h2>Lời mời tham gia acc</h2>
  <p>Xin chào,</p>
  <p>
    <strong>${escapeHtml(params.inviterName)}</strong> đã mời bạn tham gia acc
    <strong>${escapeHtml(params.accName)}</strong>.
  </p>
  <p>
    Lời mời hết hạn sau <strong>${INVITE_EXPIRY_HOURS} giờ</strong>
    (trước <strong>${escapeHtml(expires)}</strong>).
  </p>
  <p>
    Bạn chỉ trở thành thành viên sau khi đăng nhập web và bấm
    <strong>Chấp nhận</strong> trên danh sách lời mời.
  </p>
  <p>
    <a href="${escapeHtml(params.appUrl)}" style="display:inline-block;padding:10px 16px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:8px;">
      Mở Manager Account
    </a>
  </p>
  <p style="color:#555;font-size:14px;">
    Đăng nhập bằng email <strong>${escapeHtml(params.toEmail)}</strong>
    (hoặc đăng ký nếu chưa có tài khoản).
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
  <p style="color:#6b7280;font-size:12px;">Manager Account Liên Quân — email tự động, vui lòng không trả lời.</p>
</body>
</html>
`.trim();

  return { subject, text, html };
}

export function buildWelcomeEmail(params: WelcomeEmailParams): {
  subject: string;
  text: string;
  html: string;
} {
  const name = params.displayName || params.toEmail;
  const subject = `[Manager Acc] Chào mừng bạn đến acc "${params.accName}"`;

  const text = [
    `Xin chào ${name},`,
    ``,
    `Bạn đã chấp nhận lời mời và chính thức trở thành thành viên của acc "${params.accName}".`,
    ``,
    `Bạn có thể mở ứng dụng để xem chi tiết acc, trạng thái và lịch sử:`,
    params.appUrl,
    ``,
    `Chúc bạn chơi vui!`,
    `— Manager Account Liên Quân`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <h2>Chào mừng bạn!</h2>
  <p>Xin chào <strong>${escapeHtml(name)}</strong>,</p>
  <p>
    Bạn đã chấp nhận lời mời và chính thức trở thành thành viên của acc
    <strong>${escapeHtml(params.accName)}</strong>.
  </p>
  <p>Bạn có thể mở ứng dụng để xem chi tiết acc, trạng thái và lịch sử.</p>
  <p>
    <a href="${escapeHtml(params.appUrl)}" style="display:inline-block;padding:10px 16px;background:#22c55e;color:#fff;text-decoration:none;border-radius:8px;">
      Vào ứng dụng
    </a>
  </p>
  <p>Chúc bạn chơi vui!</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
  <p style="color:#6b7280;font-size:12px;">Manager Account Liên Quân — email tự động, vui lòng không trả lời.</p>
</body>
</html>
`.trim();

  return { subject, text, html };
}

export function buildLogoutReminderEmail(
  params: LogoutReminderEmailParams
): {
  subject: string;
  text: string;
  html: string;
} {
  const name = params.displayName || params.toEmail;
  const minutes = params.reminderMinutes ?? LOGOUT_REMINDER_MINUTES;
  const endedAt = formatViDate(params.endedAt);
  const detailUrl = `${params.appUrl.replace(/\/$/, '')}/accounts/${params.accId}`;
  const subject = `[Manager Acc] Nhắc đăng xuất ${params.accName}`;

  const text = [
    `Xin chào ${name},`,
    ``,
    `Bạn đã kết thúc phiên chơi acc ${params.accName} lúc ${endedAt}`,
    `nhưng chưa xác nhận đã đăng xuất ${params.accName} trên web.`,
    ``,
    `Đã hơn ${minutes} phút — acc vẫn đang chờ đăng xuất ${params.accName},`,
    `người khác chưa thể đăng ký chơi.`,
    ``,
    `Sau khi đã thoát game, vui lòng mở ứng dụng và bấm: Đăng xuất ${params.accName}`,
    detailUrl,
    ``,
    `Nếu bạn quên, chủ phòng có thể ép reset trạng thái.`,
    ``,
    `— Manager Account Liên Quân`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <h2>Nhắc đăng xuất <strong>${escapeHtml(params.accName)}</strong></h2>
  <p>Xin chào <strong>${escapeHtml(name)}</strong>,</p>
  <p>
    Bạn đã kết thúc phiên chơi acc
    <strong>${escapeHtml(params.accName)}</strong>
    lúc <strong>${escapeHtml(endedAt)}</strong>
    nhưng chưa xác nhận đã đăng xuất
    <strong>${escapeHtml(params.accName)}</strong> trên web.
  </p>
  <p>
    Đã hơn <strong>${minutes} phút</strong> — acc vẫn đang chờ đăng xuất,
    người khác chưa thể đăng ký chơi.
  </p>
  <p>
    Sau khi đã thoát hẳn game Liên Quân, hãy mở trang acc và bấm
    <strong>Đăng xuất ${escapeHtml(params.accName)}</strong>.
  </p>
  <p>
    <a href="${escapeHtml(detailUrl)}" style="display:inline-block;padding:10px 16px;background:#f59e0b;color:#fff;text-decoration:none;border-radius:8px;">
      Mở acc và đăng xuất
    </a>
  </p>
  <p style="color:#555;font-size:14px;">
    Nếu bạn quên, chủ phòng có thể ép reset trạng thái.
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
  <p style="color:#6b7280;font-size:12px;">Manager Account Liên Quân — email tự động, vui lòng không trả lời.</p>
</body>
</html>
`.trim();

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
