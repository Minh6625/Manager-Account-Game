import { LOGOUT_REMINDER_MINUTES } from '@manager-acc/shared';
import { emailService } from '@/infra/email';
import { PlaySessionRepository } from './play-session.repository';

const DEFAULT_POLL_MS = 30_000;

/**
 * Background job: after end-session, if still PENDING_LOGOUT for
 * LOGOUT_REMINDER_MINUTES, send one email reminder (best-effort).
 *
 * Requires API process to keep running (interval). Survives restarts:
 * due rows are re-scanned from DB.
 */
export class LogoutReminderJob {
  private repository = new PlaySessionRepository();
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  start(pollMs: number = DEFAULT_POLL_MS): void {
    if (this.timer) return;

    console.log(
      `[logout-reminder] started (every ${pollMs / 1000}s, after ${LOGOUT_REMINDER_MINUTES} min PENDING_LOGOUT)`
    );

    // Run once shortly after boot, then on interval
    void this.tick();
    this.timer = setInterval(() => {
      void this.tick();
    }, pollMs);

    // Don't keep process alive solely for this timer in edge cases
    if (typeof this.timer.unref === 'function') {
      this.timer.unref();
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async tick(): Promise<void> {
    if (this.running) return;
    this.running = true;

    try {
      const deadline = new Date(
        Date.now() - LOGOUT_REMINDER_MINUTES * 60 * 1000
      );
      const due = await this.repository.findDueLogoutReminders(deadline);

      for (const row of due) {
        await this.processOne(row);
      }
    } catch (error) {
      console.error('[logout-reminder] tick failed:', error);
    } finally {
      this.running = false;
    }
  }

  private async processOne(row: {
    id: string;
    userId: string;
    pendingLogoutAt: Date | null;
    user: { email: string; displayName: string | null };
    acc: { id: string; name: string; status: string };
  }): Promise<void> {
    if (row.acc.status !== 'PENDING_LOGOUT') {
      return;
    }
    if (!row.pendingLogoutAt) {
      return;
    }

    try {
      // Send first; only mark after so a failed send can retry next tick
      await emailService.sendLogoutReminderEmail({
        toEmail: row.user.email,
        displayName: row.user.displayName || row.user.email,
        accName: row.acc.name,
        accId: row.acc.id,
        endedAt: row.pendingLogoutAt,
        reminderMinutes: LOGOUT_REMINDER_MINUTES,
      });

      const claimed = await this.repository.markLogoutReminderSent(
        row.id,
        new Date()
      );
      if (!claimed) {
        // Already marked by another tick (rare)
        return;
      }

      await this.repository.appendHistory({
        accId: row.acc.id,
        userId: row.userId,
        actionType: 'LOGOUT_REMINDER',
        fromStatus: 'PENDING_LOGOUT',
        toStatus: 'PENDING_LOGOUT',
        note: `Đã gửi email nhắc đăng xuất ${row.acc.name} (sau ${LOGOUT_REMINDER_MINUTES} phút)`,
      });

      console.log(
        `[logout-reminder] emailed ${row.user.email} for acc ${row.acc.name}`
      );
    } catch (error) {
      // Email layer is best-effort; still log unexpected throws
      console.error(
        `[logout-reminder] failed for membership ${row.id}:`,
        error
      );
    }
  }
}

export const logoutReminderJob = new LogoutReminderJob();
