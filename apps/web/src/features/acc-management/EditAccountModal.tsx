import { useEffect, useState } from 'react';
import { Button, Input, Label, Modal, Textarea } from '@/components/ui';
import type { AccountDetail } from '@/shared/types';

interface EditAccountModalProps {
  open: boolean;
  account: AccountDetail | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (name: string, note: string) => Promise<void>;
}

export function EditAccountModal({
  open,
  account,
  saving,
  onClose,
  onSubmit,
}: EditAccountModalProps) {
  const [formName, setFormName] = useState('');
  const [formNote, setFormNote] = useState('');

  useEffect(() => {
    if (open && account) {
      setFormName(account.name);
      setFormNote(account.note ?? '');
    }
  }, [open, account]);

  if (!account) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(formName.trim(), formNote);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi cập nhật tài khoản';
      alert(message);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Sửa thông tin acc"
      preventClose={saving}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">
            Tên tài khoản <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-name"
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            maxLength={100}
            placeholder="Nhập tên tài khoản"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-note">Ghi chú</Label>
          <Textarea
            id="edit-note"
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ghi chú thêm (tùy chọn)"
            disabled={saving}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button type="submit" loading={saving} disabled={!formName.trim()}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
