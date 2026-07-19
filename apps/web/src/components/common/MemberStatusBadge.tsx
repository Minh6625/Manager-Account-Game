import type { MemberStatus } from '@/shared/types';
import { Badge, type BadgeProps } from '@/components/ui';

const MEMBER_STATUS: Record<
  MemberStatus,
  { text: string; variant: BadgeProps['variant'] }
> = {
  IDLE: { text: 'Rảnh', variant: 'muted' },
  PLAYING: { text: 'Đang chơi', variant: 'info' },
  PENDING_LOGOUT: { text: 'Chờ đăng xuất', variant: 'warning' },
  KICKED: { text: 'Đã kick', variant: 'destructive' },
};

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  const badge = MEMBER_STATUS[status];

  return <Badge variant={badge.variant}>{badge.text}</Badge>;
}
