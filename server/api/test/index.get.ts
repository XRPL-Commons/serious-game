import { Client } from "xrpl";
import { defineEventHandler, createError } from 'h3';


/**
 * Generates two Ripple accounts (funded) and returns their details.
 * - Account 1: The main account.
 * - Account 2: The solution account.
*/

export const generateRippleAccounts = async () => {
  // Connect to the Ripple test network
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  try {
    await client.connect();

    // Fund two wallets using the test network faucet
    const { wallet: wallet1 } = await client.fundWallet();
    const { wallet: wallet2 } = await client.fundWallet();

    // Disconnect from the network after generating the wallets
    await client.disconnect();

    // Return the details of both wallets
    return {
      account: {
        classicAddress: wallet1.classicAddress,
        seed: wallet1.seed
      },
      solution_account: {
        classicAddress: wallet2.classicAddress,
        seed: wallet2.seed
      }
    };
  } catch (error) {
    console.error('Error generating Ripple accounts:', error);
    throw error;
  }
};

/**
 * API endpoint to generate and return two Ripple accounts.
*/

export default defineEventHandler(async (event) => {
  try {
    // Generate the Ripple accounts
    const accounts = await generateRippleAccounts();
    return accounts;

    // Return a 500 error if the generation fails
  } catch (error) {
    console.error('Error generating Ripple accounts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate Ripple accounts',
    });
  }
});

/* Response : 
 {
  "account": {
    "classicAddress": "r4FzFw3D6nePq8ey59vZ57er3h7ahG56L7",
    "seed": "snXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  },
  "solution_account": {
    "classicAddress": "rG5H2sQXzj9BzS3TuRmGJZSyj8P7qC8vc6",
    "seed": "snXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }
}
  */
