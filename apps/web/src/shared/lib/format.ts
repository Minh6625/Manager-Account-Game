import type { HistoryEntry } from '@/shared/types';

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatHistoryAction(entry: HistoryEntry): string {
  const userName = entry.user?.displayName || entry.user?.email || 'Hệ thống';

  switch (entry.actionType) {
    case 'CREATE':
      return `${userName} đã tạo tài khoản`;
    case 'UPDATE':
      return `${userName} đã cập nhật thông tin acc`;
    case 'DELETE':
      return `${userName} đã xóa tài khoản`;
    case 'STATUS_CHANGE':
      return `${userName} đổi trạng thái từ ${entry.fromStatus} sang ${entry.toStatus}`;
    case 'START_PLAY':
      return `${userName} bắt đầu chơi`;
    case 'END_PLAY':
      return `${userName} kết thúc phiên chơi`;
    case 'CONFIRM_LOGOUT':
      return `${userName} đã xác nhận đăng xuất`;
    case 'FORCE_RESET':
      return `${userName} đã ép reset trạng thái acc`;
    case 'LOGOUT_REMINDER':
      return `Hệ thống đã gửi email nhắc ${userName} đăng xuất`;
    case 'MEMBER_JOIN':
      return `${userName} đã tham gia`;
    case 'MEMBER_KICK':
      // userId = actor (người thực hiện); chi tiết người bị kick nằm ở entry.note
      return `${userName} đã kick thành viên`;
    case 'INVITE_SENT':
      return `${userName} đã gửi lời mời${entry.note ? `: ${entry.note}` : ''}`;
    case 'INVITE_ACCEPTED':
      return `${userName} đã chấp nhận lời mời`;
    case 'INVITE_REJECTED':
      return `${userName} đã từ chối lời mời`;
    case 'INVITE_EXPIRED':
      return `Lời mời đã hết hạn`;
    default:
      return `${userName} - ${entry.actionType}`;
  }
}

export function displayName(user: {
  displayName: string | null;
  email: string;
} | null | undefined): string {
  if (!user) return '—';
  return user.displayName || user.email;
}
