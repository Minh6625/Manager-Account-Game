import { MemberStatusBadge, RoleBadge } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { displayName, formatDateTime } from '@/shared/lib';
import type { Member } from '@/shared/types';

interface MembersListProps {
  members: Member[];
  isOwner: boolean;
  kickingMemberId?: string | null;
  onKickClick?: (member: Member) => void;
}

export function MembersList({
  members,
  isOwner,
  kickingMemberId = null,
  onKickClick,
}: MembersListProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Thành viên ({members.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 p-3 sm:p-4">
        {members.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Chưa có thành viên
          </p>
        ) : (
          members.map((member) => {
            const canKick =
              isOwner && member.role !== 'OWNER' && Boolean(onKickClick);
            const isKicking = kickingMemberId === member.id;
            const holding =
              member.memberStatus === 'PLAYING' ||
              member.memberStatus === 'PENDING_LOGOUT';

            return (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-md border border-border px-3.5 py-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {displayName(member.user)}
                    </p>
                    <RoleBadge role={member.role} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tham gia: {formatDateTime(member.joinedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-2">
                  <MemberStatusBadge status={member.memberStatus} />
                  {isOwner && member.role !== 'OWNER' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canKick || isKicking}
                      loading={isKicking}
                      title={
                        holding
                          ? 'Thành viên đang giữ acc — kick sẽ trả acc về rảnh'
                          : 'Kick thành viên ra khỏi acc'
                      }
                      className={
                        canKick
                          ? 'border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive'
                          : undefined
                      }
                      onClick={() => onKickClick?.(member)}
                    >
                      {isKicking ? '...' : 'Kick'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
