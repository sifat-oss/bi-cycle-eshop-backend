import { z } from 'zod'

export const createUserValidationSchema = z.object({
  body: z.object({
    user: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(2),
    }),
  }),
});
