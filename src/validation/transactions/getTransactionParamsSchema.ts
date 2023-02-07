import { z } from 'zod'

export const getTransactionParamsSchema = z.object({
  id: z.string().uuid(),
})

export type GetTransactionParams = z.infer<typeof getTransactionParamsSchema>
