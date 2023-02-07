import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { createTransactionSchema } from '../validation/transactions/createTransactionSchema'
import { getTransactionParamsSchema } from '../validation/transactions/getTransactionParamsSchema'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  // get all transactions
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return {
        transactions,
      }
    },
  )

  // get a single transaction
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return {
        transaction,
      }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return {
        summary,
      }
    },
  )

  // create a transaction
  app.post('/', async (request, reply) => {
    const { title, amount, type } = createTransactionSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
