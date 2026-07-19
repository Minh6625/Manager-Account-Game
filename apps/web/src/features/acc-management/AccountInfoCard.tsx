import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { StatusBadge } from '@/components/common';
import { Button, Card, CardContent } from '@/components/ui';
import { displayName } from '@/shared/lib';
import { MAX_MEMBERS_PER_ACC } from '@/shared/constants';
import type { AccountDetail, Member } from '@/shared/types';

interface AccountInfoCardProps {
  account: AccountDetail;
  currentPlayer: Member | null;
  pendingLogoutMember?: Member | null;
  isOwner: boolean;
  onInviteClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export function AccountInfoCard({
  account,
  currentPlayer,
  pendingLogoutMember = null,
  isOwner,
  onInviteClick,
  onEditClick,
  onDeleteClick,
}: AccountInfoCardProps) {
  return (
    <Card>
      <CardContent className="px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
                {account.name}
              </h1>
              <StatusBadge status={account.status} size="md" />
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="text-muted-foreground/80">Chủ phòng:</span>{' '}
                <span className="font-medium text-foreground">
                  {displayName(account.owner)}
                </span>
              </p>
              {currentPlayer && (
                <p>
                  <span className="text-muted-foreground/80">Đang chơi:</span>{' '}
                  <span className="font-medium text-primary">
                    {displayName(currentPlayer.user)}
                  </span>
                </p>
              )}
              {pendingLogoutMember && (
                <p>
                  <span className="text-muted-foreground/80">
                    Chờ đăng xuất:
                  </span>{' '}
                  <span className="font-medium text-amber-700">
                    {displayName(pendingLogoutMember.user)}
                  </span>
                </p>
              )}
              <p>
                <span className="text-muted-foreground/80">Thành viên:</span>{' '}
                <span className="font-medium text-foreground">
                  {account.memberships.length}/{MAX_MEMBERS_PER_ACC}
                </span>
              </p>
              {account.note && (
                <p className="pt-0.5 italic text-muted-foreground">
                  {account.note}
                </p>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex shrink-0 flex-row flex-wrap justify-end gap-2 sm:min-w-[9rem] sm:flex-col sm:items-stretch">
              <Button
                variant="outline"
                size="sm"
                onClick={onEditClick}
                disabled={!onEditClick}
              >
                <Pencil className="size-3.5" />
                Sửa thông tin
              </Button>
              <Button
                size="sm"
                onClick={onInviteClick}
                disabled={!onInviteClick}
              >
                <UserPlus className="size-3.5" />
                Mời thành viên
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteClick}
                disabled={!onDeleteClick}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Xóa acc
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
