import { createOffer, mintNft }  from '@/server/xrpl/wallet'
import { getXumm } from '@/server/utils'
import { AddObject, NFT, UpdateObject, GetObjects } from '~/server/connectors/mongo';

const claimNFT = async (userToken: string, xrplAddress: string) => {
	try {
        let xumm = getXumm();

        // Get NFT object
        const nft = await GetObjects();

        if (nft && nft.length > 0) {
            // Create offer
            let nftObject = nft[0];
            const offerId = await createOffer(xrplAddress, nftObject.nftId);
            nftObject.nftOfferId = offerId;

            // Update DB
            await UpdateObject(nftObject.nftId, nftObject);

            const payload = await xumm.payload?.create({
                user_token: userToken, // Doc: https://docs.xumm.dev/concepts/payloads-sign-requests/delivery/push
                txjson: {
                    TransactionType: "NFTokenAcceptOffer",
                    NFTokenSellOffer: offerId, 
                },
            } as any);
            console.log(payload);
            return {             
                payload: payload,
            }
        } else {
            throw new Error("NFT not found");
        }
    } catch (error) {
        console.log(error);
        return error
    }	
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	console.log('claimNFT')
	return claimNFT(body.userToken, body.xrplAddress)
})
