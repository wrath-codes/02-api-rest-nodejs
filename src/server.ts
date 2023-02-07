import fastify from 'fastify'
import { env } from '../env'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  /*   const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Test Transaction',
      amount: 100,
    })
    .returning('*') */

  // const transaction = await knex('transactions').select('*')

  const transaction = await knex('transactions')
    .where('amount', '>', 100)
    .select('*')

  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running on PORT 3333')
  })
