import { defineEventHandler, createError } from 'h3';
import { Client } from 'xrpl';

export default defineEventHandler(async (event) => {
  const { soluce_account } = event.context.params;

  if (!soluce_account) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Soluce account is required'
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

    return response.result.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch transactions'
    });
  }
});
