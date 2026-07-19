import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface AppShellProps {
  children: ReactNode;
  /** Sticky top header (logo, nav, user actions) */
  header?: ReactNode;
  className?: string;
  /** Main content max width container */
  contained?: boolean;
}

/**
 * App shell inspired by meu-ecom admin layout:
 * sticky header + gray wash main content area.
 */
export function AppShell({
  children,
  header,
  className,
  contained = true,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-svh flex-col bg-secondary', className)}>
      {header}
      <main className="flex-1 overflow-y-auto">
        <div
          className={cn(
            'min-h-full p-4 sm:p-5',
            contained && 'mx-auto w-full max-w-7xl'
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
