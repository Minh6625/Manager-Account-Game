import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

/**
 * Sticky app header — matches admin header pattern (h-14, border-b).
 */
export function PageHeader({
  title,
  subtitle,
  left,
  right,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-border bg-background px-4 sm:px-6',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        {left ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">{left}</div>
        ) : (
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="truncate text-base font-semibold leading-tight text-foreground sm:text-lg">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {right && (
          <div className="flex shrink-0 items-center justify-end gap-2">
            {right}
          </div>
        )}
      </div>
    </header>
  );
}

interface PageTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** In-page title row (below shell header) — admin list page style */
export function PageTitle({
  title,
  description,
  action,
  className,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </div>
  );
}
