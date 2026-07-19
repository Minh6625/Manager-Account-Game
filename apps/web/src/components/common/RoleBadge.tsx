import type { MemberRole } from '@/shared/types';
import { Badge } from '@/components/ui';

interface RoleBadgeProps {
  role: MemberRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role !== 'OWNER') return null;

  return <Badge variant="default">Chủ phòng</Badge>;
}
