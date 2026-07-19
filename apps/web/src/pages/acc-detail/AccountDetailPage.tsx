import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/features/auth';
import {
  AccountInfoCard,
  ConfirmActionModal,
  EditAccountModal,
  HistoryList,
  MembersList,
  accApi,
  useAccountDetail,
} from '@/features/acc-management';
import {
  AccInvitationList,
  InviteMemberModal,
  useAccInvitations,
} from '@/features/invite-member';
import {
  PlaySessionPanel,
  usePlaySession,
  type PlaySessionAction,
} from '@/features/play-session';
import { AppShell, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { LoadingScreen } from '@/shared/ui';
import { HISTORY_RECENT_LIMIT } from '@/shared/constants';
import { displayName } from '@/shared/lib';
import { ApiError } from '@/shared/api';
import type { Member } from '@/shared/types';

export default function AccountDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();

  const {
    account,
    loading,
    isOwner,
    currentPlayer,
    pendingLogoutMember,
    myMembership,
    historyToShow,
    showFullHistory,
    loadingHistory,
    loadFullHistory,
    reload,
  } = useAccountDetail(id, user?.id);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToKick, setMemberToKick] = useState<Member | null>(null);
  const [managing, setManaging] = useState(false);
  const [manageError, setManageError] = useState('');

  const {
    pending: pendingInvites,
    loading: invitesLoading,
    sending,
    error: inviteError,
    setError: setInviteError,
    sendInvite,
    reload: reloadInvites,
  } = useAccInvitations(id, Boolean(account));

  const handlePlaySuccess = useCallback(() => {
    void reload();
  }, [reload]);

  const {
    acting,
    error: playError,
    setError: setPlayError,
    startPlay,
    endPlay,
    confirmLogout,
    forceReset,
  } = usePlaySession(id, handlePlaySuccess);

  const handlePlayAction = useCallback(
    async (action: PlaySessionAction): Promise<boolean> => {
      setPlayError('');
      if (action === 'start') return startPlay();
      if (action === 'end') return endPlay();
      if (action === 'confirm') return confirmLogout();
      if (action === 'force-reset') return forceReset();
      return false;
    },
    [startPlay, endPlay, confirmLogout, forceReset, setPlayError]
  );

  const handleUpdateAccount = useCallback(
    async (name: string, note: string) => {
      if (!id) return;
      setManaging(true);
      setManageError('');
      try {
        await accApi.updateAccount(id, {
          name,
          note: note.trim() ? note.trim() : null,
        });
        await reload();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Cập nhật thất bại';
        throw new Error(message);
      } finally {
        setManaging(false);
      }
    },
    [id, reload]
  );

  const handleDeleteAccount = useCallback(async () => {
    if (!id) return;
    setManaging(true);
    setManageError('');
    try {
      await accApi.deleteAccount(id);
      setShowDeleteConfirm(false);
      navigate('/accounts');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Xóa thất bại';
      setManageError(message);
    } finally {
      setManaging(false);
    }
  }, [id, navigate]);

  const handleKickMember = useCallback(async () => {
    if (!id || !memberToKick) return;
    setManaging(true);
    setManageError('');
    try {
      await accApi.kickMember(id, memberToKick.id);
      setMemberToKick(null);
      await reload();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Kick thất bại';
      setManageError(message);
    } finally {
      setManaging(false);
    }
  }, [id, memberToKick, reload]);

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  if (!account) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-secondary">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            Không tìm thấy tài khoản
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/accounts')}
          >
            <ArrowLeft className="size-4" />
            Về danh sách
          </Button>
        </div>
      </div>
    );
  }

  const kickHolding =
    memberToKick &&
    (memberToKick.memberStatus === 'PLAYING' ||
      memberToKick.memberStatus === 'PENDING_LOGOUT');

  return (
    <AppShell
      header={
        <PageHeader
          left={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/accounts')}
              >
                <ArrowLeft className="size-4" />
                Danh sách
              </Button>
              <div className="hidden h-5 w-px bg-border sm:block" />
              <div className="hidden items-center gap-2 sm:flex">
                <Gamepad2 className="size-4 text-primary" />
                <span className="max-w-[12rem] truncate text-sm font-medium text-foreground">
                  {account.name}
                </span>
              </div>
            </div>
          }
        />
      }
    >
      <div className="space-y-4">
        {manageError && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {manageError}
          </div>
        )}

        <AccountInfoCard
          account={account}
          currentPlayer={currentPlayer}
          pendingLogoutMember={pendingLogoutMember}
          isOwner={isOwner}
          onInviteClick={
            isOwner
              ? () => {
                  setInviteError('');
                  setShowInviteModal(true);
                }
              : undefined
          }
          onEditClick={
            isOwner
              ? () => {
                  setManageError('');
                  setShowEditModal(true);
                }
              : undefined
          }
          onDeleteClick={
            isOwner
              ? () => {
                  setManageError('');
                  setShowDeleteConfirm(true);
                }
              : undefined
          }
        />
        {user && (
          <PlaySessionPanel
            account={account}
            currentUserId={user.id}
            isOwner={isOwner}
            currentPlayer={currentPlayer}
            pendingLogoutMember={pendingLogoutMember}
            myMembership={myMembership}
            acting={acting}
            error={playError}
            onAction={handlePlayAction}
          />
        )}
        <MembersList
          members={account.memberships}
          isOwner={isOwner}
          kickingMemberId={managing && memberToKick ? memberToKick.id : null}
          onKickClick={
            isOwner
              ? (member) => {
                  setManageError('');
                  setMemberToKick(member);
                }
              : undefined
          }
        />
        {isOwner && !invitesLoading && pendingInvites.length > 0 && (
          <AccInvitationList invitations={pendingInvites} loading={false} />
        )}
        <HistoryList
          entries={historyToShow}
          showFullHistory={showFullHistory}
          canLoadMore={account.statusHistory.length >= HISTORY_RECENT_LIMIT}
          loadingHistory={loadingHistory}
          onLoadMore={loadFullHistory}
        />
      </div>

      <InviteMemberModal
        open={showInviteModal}
        sending={sending}
        error={inviteError}
        onClose={() => setShowInviteModal(false)}
        onSubmit={async (email) => {
          await sendInvite(email);
          await reload();
          await reloadInvites();
        }}
      />

      <EditAccountModal
        open={showEditModal}
        account={account}
        saving={managing}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateAccount}
      />

      <ConfirmActionModal
        open={showDeleteConfirm}
        title="Xóa tài khoản?"
        body={`Bạn sắp xóa acc "${account.name}".\nHành động này không thể hoàn tác. Toàn bộ thành viên, lời mời và lịch sử của acc sẽ bị xóa.`}
        confirmLabel="Xóa acc"
        danger
        loading={managing}
        onClose={() => {
          if (!managing) setShowDeleteConfirm(false);
        }}
        onConfirm={() => {
          void handleDeleteAccount();
        }}
      />

      <ConfirmActionModal
        open={Boolean(memberToKick)}
        title="Kick thành viên?"
        body={
          memberToKick
            ? kickHolding
              ? `Kick ${displayName(memberToKick.user)}?\nThành viên này đang giữ acc (${memberToKick.memberStatus}). Sau khi kick, acc sẽ về trạng thái rảnh và họ mất mọi quyền thao tác.`
              : `Kick ${displayName(memberToKick.user)} ra khỏi acc?\nHọ sẽ mất mọi quyền thao tác trên acc này ngay lập tức.`
            : undefined
        }
        confirmLabel="Kick"
        danger
        loading={managing}
        onClose={() => {
          if (!managing) setMemberToKick(null);
        }}
        onConfirm={() => {
          void handleKickMember();
        }}
      />
    </AppShell>
  );
}
