import { useState } from 'react';
import { LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/features/auth';
import {
  AccountListPanel,
  CreateAccountModal,
  useAccounts,
} from '@/features/acc-management';
import {
  PendingInvitesPanel,
  useMyPendingInvitations,
} from '@/features/invite-member';
import { AppShell, PageHeader, PageTitle } from '@/components/layout';
import { Button } from '@/components/ui';
import { LoadingScreen } from '@/shared/ui';
import { displayName } from '@/shared/lib';

export default function AccountListPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    accounts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    creating,
    createAccount,
    reload: reloadAccounts,
  } = useAccounts(user?.id);

  const {
    invitations: pendingInvites,
    loading: pendingLoading,
    actingId,
    error: pendingError,
    accept,
    reject,
  } = useMyPendingInvitations(Boolean(user));

  const [showCreateModal, setShowCreateModal] = useState(false);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell
      header={
        <PageHeader
          left={
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-md">
                <img src="/logo.png" alt="Logo" className="size-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  Manager Account
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Liên Quân
                </p>
              </div>
            </div>
          }
          right={
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {displayName(user)}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </>
          }
        />
      }
    >
      <PageTitle
        title="Danh sách tài khoản"
        description={`Xin chào, ${displayName(user)}`}
        action={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="size-4" />
            Tạo acc
          </Button>
        }
      />

      <div className="space-y-4">
        <PendingInvitesPanel
          invitations={pendingInvites}
          loading={pendingLoading}
          actingId={actingId}
          error={pendingError}
          onAccept={async (accId, invId) => {
            await accept(accId, invId);
            await reloadAccounts();
          }}
          onReject={async (accId, invId) => {
            await reject(accId, invId);
          }}
        />

        <AccountListPanel
          accounts={accounts}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onTabChange={setActiveTab}
          onSearchChange={setSearchQuery}
        />
      </div>

      <CreateAccountModal
        open={showCreateModal}
        creating={creating}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (name, note) => {
          await createAccount(name, note);
        }}
      />
    </AppShell>
  );
}
