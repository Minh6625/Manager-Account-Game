import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/common';
import { Button } from '@/components/ui';
import { displayName } from '@/shared/lib';
import { MAX_MEMBERS_PER_ACC } from '@/shared/constants';
import type { Account } from '@/shared/types';

interface AccountCardProps {
  account: Account;
}

function getHolderInfo(account: Account): {
  kind: 'playing' | 'pending';
  userName: string;
} | null {
  const playing = account.memberships.find((m) => m.memberStatus === 'PLAYING');
  if (playing) {
    return { kind: 'playing', userName: displayName(playing.user) };
  }
  const pending = account.memberships.find(
    (m) => m.memberStatus === 'PENDING_LOGOUT'
  );
  if (pending) {
    return { kind: 'pending', userName: displayName(pending.user) };
  }
  return null;
}

export function AccountCard({ account }: AccountCardProps) {
  const navigate = useNavigate();
  const holder = getHolderInfo(account);

  return (
    <div className="rounded-md border border-border bg-card px-4 py-3.5 transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
              {account.name}
            </h3>
            <StatusBadge status={account.status} />
          </div>

          <div className="space-y-0.5 text-sm text-muted-foreground">
            <p>
              <span className="text-muted-foreground/80">Chủ phòng:</span>{' '}
              <span className="font-medium text-foreground">
                {displayName(account.owner)}
              </span>
            </p>
            {holder?.kind === 'playing' && (
              <p>
                <span className="text-muted-foreground/80">Đang chơi:</span>{' '}
                <span className="font-medium text-primary">
                  {holder.userName}
                </span>
              </p>
            )}
            {holder?.kind === 'pending' && (
              <p>
                <span className="text-muted-foreground/80">Chờ đăng xuất:</span>{' '}
                <span className="font-medium text-amber-700">
                  {holder.userName}
                </span>
              </p>
            )}
            <p>
              <span className="text-muted-foreground/80">Thành viên:</span>{' '}
              <span className="font-medium text-foreground">
                {account._count.memberships}/{MAX_MEMBERS_PER_ACC}
              </span>
            </p>
            {account.note && (
              <p className="truncate italic text-muted-foreground/70">
                {account.note}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 justify-end sm:pl-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/accounts/${account.id}`)}
          >
            Xem chi tiết
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
