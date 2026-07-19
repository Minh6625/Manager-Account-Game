import { useState } from 'react';
import { INVITE_EXPIRY_HOURS } from '@manager-acc/shared';
import { Button, Input, Label, Modal } from '@/components/ui';

interface InviteMemberModalProps {
  open: boolean;
  sending: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function InviteMemberModal({
  open,
  sending,
  error,
  onClose,
  onSubmit,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(email.trim());
      setEmail('');
      onClose();
    } catch {
      // error displayed by parent
    }
  };

  const handleClose = () => {
    if (sending) return;
    setEmail('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Mời thành viên"
      description={`Người được mời phải chấp nhận trước khi trở thành thành viên. Lời mời hết hạn sau ${INVITE_EXPIRY_HOURS} giờ. Lời mời đang chờ không tính vào giới hạn 5 thành viên.`}
      preventClose={sending}
    >
      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invite-email">
            Email người được mời <span className="text-destructive">*</span>
          </Label>
          <Input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@email.com"
            disabled={sending}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={sending}
          >
            Hủy
          </Button>
          <Button type="submit" loading={sending}>
            {sending ? 'Đang gửi...' : 'Gửi lời mời'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
