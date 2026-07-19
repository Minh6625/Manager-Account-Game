import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatDateTime, formatHistoryAction } from '@/shared/lib';
import type { HistoryEntry } from '@/shared/types';

interface HistoryListProps {
  entries: HistoryEntry[];
  showFullHistory: boolean;
  canLoadMore: boolean;
  loadingHistory: boolean;
  onLoadMore: () => void;
}

export function HistoryList({
  entries,
  showFullHistory,
  canLoadMore,
  loadingHistory,
  onLoadMore,
}: HistoryListProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Lịch sử</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Chưa có lịch sử
          </p>
        ) : (
          <>
            <div className="mb-3 space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-r-md border-l-2 border-primary bg-muted/60 px-3 py-2"
                >
                  <p className="text-sm leading-snug text-foreground">
                    {formatHistoryAction(entry)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                    {entry.note ? ` · ${entry.note}` : ''}
                  </p>
                </div>
              ))}
            </div>

            {!showFullHistory && canLoadMore && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  loading={loadingHistory}
                >
                  {loadingHistory ? 'Đang tải...' : 'Xem thêm (3 ngày)'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
