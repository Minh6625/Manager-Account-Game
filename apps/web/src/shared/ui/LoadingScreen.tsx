import { LoaderCircle } from 'lucide-react';

export function LoadingScreen({
  message = 'Đang tải...',
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-secondary">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
