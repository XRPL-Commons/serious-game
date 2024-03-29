import { convertStringToHex, NFTokenMint, NFTokenMintFlags, NFTokenCreateOffer } from 'xrpl';
import { NFTokenMintMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenMint';
import { NFTokenCreateOfferMetadata } from 'xrpl/dist/npm/models/transactions/NFTokenCreateOffer';

import { getWallet, getExplorerClient } from '../utils';

export async function mintNft(): Promise<string> {
    const wallet = getWallet();
    const client = await getExplorerClient();    

    const nftMintTx: NFTokenMint = {
        TransactionType: "NFTokenMint",
        Account: wallet.address,
        URI: convertStringToHex("https://assets-global.website-files.com/640f20bd091411ea6a488ea6/6411d98a4c9e464a1dac4805_Frame%2034.png"),
        Flags: NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfTransferable, // Burnable in case no one is buying it
        NFTokenTaxon: 0, // Unique identifier for the NFT type
    };

    const prepared = await client.autofill(nftMintTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    console.log(`NFT Mint transaction result: ${JSON.stringify(result, null, 2)}`);

    const nftId = (result.result.meta as NFTokenMintMetadata)?.nftoken_id as string;
    console.log(nftId);
    return nftId;
}

export async function createOffer(destination: string, nftId: string): Promise<string> {
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
    
    console.log(`NFT Create transaction result: ${JSON.stringify(result, null, 2)}`);
    const offerId = (result.result.meta as NFTokenCreateOfferMetadata)?.offer_id as string;
    console.log(offerId);
    return offerId;
}
