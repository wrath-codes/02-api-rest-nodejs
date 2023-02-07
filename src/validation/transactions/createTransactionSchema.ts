import { z } from 'zod'

// {title, amount, type: credit | debit}
export const createTransactionSchema = z.object({
  title: z.string(),
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
})

export type CreateTransaction = z.infer<typeof createTransactionSchema>
