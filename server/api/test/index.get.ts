import { Client } from "xrpl";
import { defineEventHandler, createError } from 'h3';

export const generateRippleAccounts = async () => {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  try {
    await client.connect();

    const { wallet: wallet1 } = await client.fundWallet();
    const { wallet: wallet2 } = await client.fundWallet();

    await client.disconnect();

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

export default defineEventHandler(async (event) => {
  try {
    const accounts = await generateRippleAccounts();
    return accounts;
  } catch (error) {
    console.error('Error generating Ripple accounts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate Ripple accounts',
    });
  }
});
