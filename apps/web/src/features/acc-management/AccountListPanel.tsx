import { Search } from 'lucide-react';
import type { Account, AccountFilterTab } from '@/shared/types';
import { Card, CardContent, Input } from '@/components/ui';
import { AccountCard } from './AccountCard';
import { AccountFilterTabs } from './AccountFilterTabs';

interface AccountListPanelProps {
  accounts: Account[];
  activeTab: AccountFilterTab;
  searchQuery: string;
  onTabChange: (tab: AccountFilterTab) => void;
  onSearchChange: (query: string) => void;
}

export function AccountListPanel({
  accounts,
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
}: AccountListPanelProps) {
  return (
    <Card className="overflow-hidden">
      <AccountFilterTabs activeTab={activeTab} onChange={onTabChange} />

      <div className="border-b border-border px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm theo tên acc..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        {accounts.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Không có tài khoản nào
          </div>
        ) : (
          <div className="space-y-2.5">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
