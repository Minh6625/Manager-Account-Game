import type { Invitation } from '@manager-acc/shared';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { displayName, formatDateTime } from '@/shared/lib';

interface PendingInvitesPanelProps {
  invitations: Invitation[];
  loading: boolean;
  actingId: string | null;
  error?: string;
  onAccept: (accId: string, invId: string) => Promise<void>;
  onReject: (accId: string, invId: string) => Promise<void>;
}

export function PendingInvitesPanel({
  invitations,
  loading,
  actingId,
  error,
  onAccept,
  onReject,
}: PendingInvitesPanelProps) {
  if (!loading && invitations.length === 0 && !error) {
    return null;
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b border-border bg-primary/5">
        <CardTitle className="text-primary">Lời mời chờ bạn</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {error && (
          <div className="mb-3 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Đang tải...
          </p>
        ) : invitations.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Không có lời mời
          </p>
        ) : (
          <div className="space-y-2.5">
            {invitations.map((inv) => {
              const busy = actingId === inv.id;
              return (
                <div
                  key={inv.id}
                  className="flex flex-col gap-3 rounded-md border border-border px-3.5 py-3 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      Acc: {inv.acc?.name || '—'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-muted-foreground/80">
                        Người mời:
                      </span>{' '}
                      {displayName(inv.invitedBy) || 'Chủ phòng'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hết hạn: {formatDateTime(inv.expiresAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => void onReject(inv.accId, inv.id)}
                    >
                      Từ chối
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy}
                      loading={busy}
                      onClick={() => void onAccept(inv.accId, inv.id)}
                    >
                      {busy ? '...' : 'Chấp nhận'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
