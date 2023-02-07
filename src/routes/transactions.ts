import { knex } from '../database'

export async function transactionRoutes(app) {
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
}
