import { defineEventHandler, createError, getQuery } from 'h3';
import { Client } from 'xrpl';


/**
 * API endpoint to fetch transactions from a specific soluce account to a personal account.
**/

export default defineEventHandler(async (event) => {
    // Extract soluce_account from route parameters and personal_account from query parameters
  const { soluce_account } = event.context.params;
  const { personal_account } = getQuery(event);

  // Validate input parameters
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

  // Initialize the XRPL client to connect to the Ripple test network
  const client = new Client("wss://s.altnet.rippletest.net:51233");

  try {
    // Connect to the XRPL test network
    await client.connect();

 // Construct request to fetch the last 10 transactions from the soluce account    
 const request = {
      command: 'account_tx',
      account: soluce_account,
      ledger_index_min: -1, // To get transactions from all ledgers
      ledger_index_max: -1, // To get transactions up to the most recent ledger
      limit: 10, // Limit the number of transactions (optional)
    }

    // Send the request and retrieve the response
    const response = await client.request(request);

    // Disconnect the client after fetching the data
    await client.disconnect();

    // Filter transactions from the personal account
    const transactions = response.result.transactions.filter(tx => tx.tx.Account === personal_account);

    // Return the filtered transactions
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch transactions'
    });
  }
});
