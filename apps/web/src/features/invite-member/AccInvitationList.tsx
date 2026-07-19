import type { Invitation } from '@manager-acc/shared';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatDateTime } from '@/shared/lib';

interface AccInvitationListProps {
  invitations: Invitation[];
  loading: boolean;
}

/** Danh sách lời mời chờ xác nhận (PENDING). Không render khi không có lời mời. */
export function AccInvitationList({
  invitations,
  loading,
}: AccInvitationListProps) {
  const pending = invitations.filter((inv) => inv.status === 'PENDING');

  if (loading || pending.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Lời mời chờ xác nhận</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2.5">
          {pending.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col gap-3 rounded-md border border-border px-3.5 py-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate text-sm font-medium text-foreground">
                  <span className="text-muted-foreground">Email:</span>{' '}
                  {inv.invitedEmail || inv.invitedUser?.email || 'Không rõ'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gửi: {formatDateTime(inv.createdAt)} · Hết hạn:{' '}
                  {formatDateTime(inv.expiresAt)}
                </p>
              </div>
              <div className="flex shrink-0 justify-end">
                <Badge variant="warning">Chờ xác nhận</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
