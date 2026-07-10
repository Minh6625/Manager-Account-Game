import { z } from 'zod';

export const createAccSchema = z.object({
  name: z.string().min(1, 'Tên tài khoản không được để trống').max(100),
  note: z.string().max(500).optional(),
});

export type CreateAccDto = z.infer<typeof createAccSchema>;
