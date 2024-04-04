import { convertStringToHex, NFTokenMint, NFTokenMintFlags, NFTokenCreateOffer } from 'xrpl';
import { NFTokenMintMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenMint';
import { NFTokenCreateOfferMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenCreateOffer';

import { getWallet, getExplorerClient } from '../utils';

export async function mintNft(uri: string): Promise<{ nftId: string; mintedAt: string}> {
    const wallet = getWallet();
    const client = await getExplorerClient();    

    const nftMintTx: NFTokenMint = {
        TransactionType: "NFTokenMint",
        Account: wallet.address,
        URI: convertStringToHex(uri),
        Flags: NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfTransferable, // Burnable in case no one is buying it
        NFTokenTaxon: 0, // Unique identifier for the NFT type
    };

    const prepared = await client.autofill(nftMintTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    // console.log(`NFT Mint transaction result: ${JSON.stringify(result, null, 2)}`);

    return {
        nftId: (result.result.meta as NFTokenMintMetadata)?.nftoken_id as string,
        mintedAt: new Date().toISOString()
    };
}

export async function createOffer(destination: string, nftId: string): Promise<string> {
    console.log(destination)
    console.log(nftId)
    const wallet = getWallet();    
    const client = await getExplorerClient();

    const nftCreateOfferTx: NFTokenCreateOffer = {
        TransactionType: "NFTokenCreateOffer",
        Account: wallet.address,
        Destination: destination,
        NFTokenID: nftId,
        Amount: "0",
        Flags: 1 // Sell offer
    };

    const prepared = await client.autofill(nftCreateOfferTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    // console.log(`NFT Create transaction result: ${JSON.stringify(result, null, 2)}`);
    const offerId = (result.result.meta as NFTokenCreateOfferMetadata)?.offer_id as string;
    return offerId;
}
