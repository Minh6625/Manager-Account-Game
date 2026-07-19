import { z } from 'zod';

/** GET /api/v1/history query validation */
export const listHistoryQuerySchema = z.object({
  acc_id: z.string().uuid('acc_id phải là UUID hợp lệ'),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (Number.isFinite(v) && v > 0), {
      message: 'limit phải là số nguyên dương',
    }),
  days: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (Number.isFinite(v) && v > 0), {
      message: 'days phải là số nguyên dương',
    }),
});

export type ListHistoryQuery = z.infer<typeof listHistoryQuerySchema>;
