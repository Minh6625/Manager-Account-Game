import { Button, Modal } from '@/components/ui';

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmActionModal({
  open,
  title,
  body,
  confirmLabel = 'Xác nhận',
  danger = false,
  loading = false,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} preventClose={loading}>
      {body && (
        <p className="mb-4 whitespace-pre-line text-sm text-muted-foreground">
          {body}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          type="button"
          variant={danger ? 'destructive' : 'default'}
          loading={loading}
          className="min-w-[7rem]"
          onClick={onConfirm}
        >
          {loading ? '...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
