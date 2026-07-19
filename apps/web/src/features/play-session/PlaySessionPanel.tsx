import { useState, type ReactNode } from 'react';
import { Button, Card, CardContent, Modal } from '@/components/ui';
import { displayName } from '@/shared/lib';
import type { AccountDetail, Member } from '@/shared/types';

export type PlaySessionAction =
  | 'start'
  | 'end'
  | 'confirm'
  | 'force-reset';

interface PlaySessionPanelProps {
  account: AccountDetail;
  currentUserId: string;
  isOwner: boolean;
  currentPlayer: Member | null;
  pendingLogoutMember: Member | null;
  myMembership: Member | null;
  acting: boolean;
  error: string;
  onAction: (action: PlaySessionAction) => Promise<boolean>;
}

function AccName({ name }: { name: string }) {
  return <strong className="font-semibold">{name}</strong>;
}

export function PlaySessionPanel({
  account,
  currentUserId,
  isOwner,
  currentPlayer,
  pendingLogoutMember,
  myMembership,
  acting,
  error,
  onAction,
}: PlaySessionPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState<PlaySessionAction | null>(
    null
  );

  const accName = account.name;

  const iAmPlaying =
    myMembership?.memberStatus === 'PLAYING' &&
    myMembership.user.id === currentUserId;
  const iAmPendingLogout =
    myMembership?.memberStatus === 'PENDING_LOGOUT' &&
    myMembership.user.id === currentUserId;

  const canStart =
    Boolean(myMembership) &&
    account.status === 'AVAILABLE' &&
    myMembership?.memberStatus === 'IDLE';

  const showForceReset =
    isOwner &&
    (account.status !== 'AVAILABLE' ||
      Boolean(currentPlayer) ||
      Boolean(pendingLogoutMember));

  const handleClick = (action: PlaySessionAction) => {
    if (action === 'start') {
      void onAction(action);
      return;
    }
    setConfirmOpen(action);
  };

  const runConfirmed = async () => {
    if (!confirmOpen || confirmOpen === 'start') return;
    const action = confirmOpen;
    const ok = await onAction(action);
    if (!ok) return;
    if (action === 'end') {
      setConfirmOpen('confirm');
      return;
    }
    setConfirmOpen(null);
  };

  let statusLine: ReactNode = null;
  if (account.status === 'IN_USE' && currentPlayer) {
    statusLine = (
      <>
        <span className="text-muted-foreground">Đang chơi:</span>{' '}
        <span className="font-medium text-primary">
          {displayName(currentPlayer.user)}
        </span>
        {iAmPlaying ? ' (bạn)' : ''}
      </>
    );
  } else if (account.status === 'PENDING_LOGOUT' && pendingLogoutMember) {
    statusLine = (
      <>
        <span className="text-muted-foreground">Chờ đăng xuất:</span>{' '}
        <span className="font-medium text-amber-700">
          {displayName(pendingLogoutMember.user)}
        </span>
        {iAmPendingLogout ? ' (bạn)' : ''}
      </>
    );
  } else if (
    account.status === 'IN_USE' ||
    account.status === 'PENDING_LOGOUT'
  ) {
    statusLine = <>Trạng thái lệch — chủ phòng có thể ép reset</>;
  }

  const confirmCopy: Record<
    Exclude<PlaySessionAction, 'start'>,
    {
      title: ReactNode;
      body?: ReactNode;
      confirmLabel: ReactNode;
      danger?: boolean;
    }
  > = {
    end: {
      title: 'Kết thúc phiên?',
      confirmLabel: 'Kết thúc',
    },
    confirm: {
      title: (
        <>
          Đã đăng xuất <AccName name={accName} />?
        </>
      ),
      body: 'Chỉ xác nhận khi đã thoát game.',
      confirmLabel: (
        <>
          Đăng xuất <AccName name={accName} />
        </>
      ),
    },
    'force-reset': {
      title: (
        <>
          Ép reset <AccName name={accName} />?
        </>
      ),
      confirmLabel: 'Ép reset',
      danger: true,
    },
  };

  const hasActions = canStart || iAmPlaying || iAmPendingLogout || showForceReset;

  return (
    <Card>
      <CardContent className="px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Phiên chơi
            </h2>
            {statusLine && (
              <p className="text-sm text-muted-foreground">{statusLine}</p>
            )}
            {!statusLine && !hasActions && (
              <p className="text-sm text-muted-foreground">
                Acc đang rảnh — đăng ký chơi khi sẵn sàng.
              </p>
            )}
            {error && (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-1.5 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-row flex-wrap justify-end gap-2 sm:min-w-[9rem] sm:flex-col sm:items-stretch">
            {canStart && (
              <Button
                type="button"
                variant="success"
                disabled={acting}
                loading={acting}
                onClick={() => handleClick('start')}
              >
                {acting ? '...' : 'Đăng ký chơi'}
              </Button>
            )}

            {iAmPlaying && (
              <Button
                type="button"
                variant="warning"
                disabled={acting}
                loading={acting}
                onClick={() => handleClick('end')}
              >
                {acting ? '...' : 'Kết thúc phiên'}
              </Button>
            )}

            {iAmPendingLogout && (
              <Button
                type="button"
                disabled={acting}
                loading={acting}
                onClick={() => handleClick('confirm')}
              >
                {acting ? (
                  '...'
                ) : (
                  <>
                    Đăng xuất <AccName name={accName} />
                  </>
                )}
              </Button>
            )}

            {showForceReset && (
              <Button
                type="button"
                variant="outline"
                disabled={acting}
                loading={acting}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleClick('force-reset')}
              >
                {acting ? '...' : 'Ép reset'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {confirmOpen && confirmOpen !== 'start' && (
        <Modal
          open
          onClose={() => setConfirmOpen(null)}
          title={confirmCopy[confirmOpen].title}
          preventClose={acting}
        >
          {confirmCopy[confirmOpen].body && (
            <p className="mb-4 text-sm text-muted-foreground">
              {confirmCopy[confirmOpen].body}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={acting}
              onClick={() => setConfirmOpen(null)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant={
                confirmCopy[confirmOpen].danger ? 'destructive' : 'default'
              }
              loading={acting}
              className="min-w-[7rem]"
              onClick={() => {
                void runConfirmed();
              }}
            >
              {acting ? '...' : confirmCopy[confirmOpen].confirmLabel}
            </Button>
          </div>
        </Modal>
      )}
    </Card>
  );
}
