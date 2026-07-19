import type { AccStatus } from '@/shared/types';
import { Badge, type BadgeProps } from '@/components/ui';

const ACC_STATUS: Record<
  AccStatus,
  { text: string; variant: BadgeProps['variant'] }
> = {
  AVAILABLE: { text: 'Rảnh', variant: 'success' },
  IN_USE: { text: 'Đang chơi', variant: 'info' },
  PENDING_LOGOUT: { text: 'Chờ đăng xuất', variant: 'warning' },
};

interface StatusBadgeProps {
  status: AccStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const badge = ACC_STATUS[status];

  return (
    <Badge
      variant={badge.variant}
      className={size === 'md' ? 'px-3 py-1 text-sm' : undefined}
    >
      {badge.text}
    </Badge>
  );
}
