import { defineEventHandler, createError, getQuery } from 'h3';
import { Client } from 'xrpl';

export default defineEventHandler(async (event) => {
  const { soluce_account } = event.context.params;
  const { personal_account } = getQuery(event);
  if (!soluce_account) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Soluce account is required'
    });
  }
  if (!personal_account) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Personal account is required'
    });
  }
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  try {
    await client.connect();
    const request = {
      command: 'account_tx',
      account: soluce_account,
      ledger_index_min: -1, // To get transactions from all ledgers
      ledger_index_max: -1, // To get transactions up to the most recent ledger
      limit: 10, // Limit the number of transactions (optional)
    }
    const response = await client.request(request);

    await client.disconnect();

    // Filter transactions from the personal account
    const transactions = response.result.transactions.filter(tx => tx.tx.Account === personal_account);

    // Sort transactions by date
    const sortedTransactions = transactions.sort((a, b) => a.tx.date - b.tx.date);

    // Return the oldest transaction
    const oldestTransaction = sortedTransactions[0] || null;
    return oldestTransaction;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch transactions'
    });
  }
});
