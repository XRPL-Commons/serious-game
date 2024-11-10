import { defineEventHandler, createError, readBody } from 'h3';
import { Client, Wallet, Payment } from 'xrpl';


/**
 * Sends a Ripple payment transaction from one account to another.
*/

export const sendTransaction = async (account: any, solution_account: any) => {
  // Initialize the XRPL client for the Ripple test network
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  try {

    // Connect to the XRP Ledger test network
    await client.connect();

    // Connect to the wallet using the seed
    const wallet = Wallet.fromSeed(account.seed);

    // Define the payment transaction details
    const tx: Payment = {
      TransactionType: "Payment",
      Account: wallet.classicAddress,
      Destination: solution_account.classicAddress,
      Amount: "42"  // 42 drops 
    };

    // Submit the transaction and wait for confirmation
    const result = await client.submitAndWait(tx, {
      autofill: true,
      wallet
    });

    // Disconnect the client after the transaction is processed
    await client.disconnect();

    // Check the transaction result and throw an error if it failed
    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
    }

    return result;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

/**
 * API endpoint to initiate and send a Ripple transaction.
*/

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the incoming request to get account details
    const body = await readBody(event);
    const { account, solution_account } = body;

    // Maybe add some validation here to ensure the account and solution_account are provided
    
    // Call the sendTransaction function to process the payment
    const result = await sendTransaction(account, solution_account);

    // Return the result of the transaction
    return result;
  } catch (error) {
    console.error('Error in transaction handler:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send transaction',
    });
  }
});
