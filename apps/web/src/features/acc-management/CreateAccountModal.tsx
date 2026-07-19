import { useState } from 'react';
import { Button, Input, Label, Modal, Textarea } from '@/components/ui';

interface CreateAccountModalProps {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onSubmit: (name: string, note: string) => Promise<void>;
}

export function CreateAccountModal({
  open,
  creating,
  onClose,
  onSubmit,
}: CreateAccountModalProps) {
  const [formName, setFormName] = useState('');
  const [formNote, setFormNote] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(formName, formNote);
      setFormName('');
      setFormNote('');
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi kết nối đến server';
      alert(message);
    }
  };

  const handleClose = () => {
    if (creating) return;
    setFormName('');
    setFormNote('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Tạo tài khoản mới"
      preventClose={creating}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="create-name">
            Tên tài khoản <span className="text-destructive">*</span>
          </Label>
          <Input
            id="create-name"
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            maxLength={100}
            placeholder="Nhập tên tài khoản"
            disabled={creating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="create-note">Ghi chú</Label>
          <Textarea
            id="create-note"
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Ghi chú thêm (tùy chọn)"
            disabled={creating}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={creating}
          >
            Hủy
          </Button>
          <Button type="submit" loading={creating}>
            {creating ? 'Đang tạo...' : 'Tạo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
