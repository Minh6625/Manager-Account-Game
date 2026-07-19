import { z } from 'zod';

export const createAccSchema = z.object({
  name: z.string().min(1, 'Tên tài khoản không được để trống').max(100),
  note: z.string().max(500).optional(),
});

/** PATCH /api/v1/accs/:id — name and/or note (owner only) */
export const updateAccSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Tên tài khoản không được để trống')
      .max(100)
      .optional(),
    note: z.string().max(500).nullable().optional(),
  })
  .refine((data) => data.name !== undefined || data.note !== undefined, {
    message: 'Cần ít nhất một trường để cập nhật (name hoặc note)',
  });

/** @deprecated Prefer CreateAccountDto from dto; kept for existing api imports */
export type CreateAccDto = z.infer<typeof createAccSchema>;

/** @deprecated Prefer UpdateAccountDto from dto */
export type UpdateAccDto = z.infer<typeof updateAccSchema>;
