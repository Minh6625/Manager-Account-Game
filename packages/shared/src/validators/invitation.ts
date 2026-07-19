import { z } from 'zod';

export const createInvitationSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Email không hợp lệ')
    .max(255, 'Email quá dài'),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
