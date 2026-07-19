import type { AccountFilterTab } from '@/shared/types';
import { cn } from '@/utils/cn';

const TABS: Array<{ id: AccountFilterTab; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'owned', label: 'Của tôi' },
  { id: 'joined', label: 'Đã tham gia' },
];

interface AccountFilterTabsProps {
  activeTab: AccountFilterTab;
  onChange: (tab: AccountFilterTab) => void;
}

export function AccountFilterTabs({
  activeTab,
  onChange,
}: AccountFilterTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="-mb-px flex overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent/50 hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
