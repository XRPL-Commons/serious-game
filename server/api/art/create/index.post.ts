import { createOffer, mintNft }  from '@/server/xrpl/wallet'
import { getXumm } from '@/server/utils'
import { AddObject, NFT, UpdateObject } from '~/server/connectors/mongo';

const createNFT = async (userToken: string, xrplAddress: string, imageData: string) => {
	// check if NFT has already been minted
    // --> cannot do this

	try {
        let xumm = getXumm();

        // Mint new NFT with image
        const nftId = await mintNft();
    
        // insert into DB
        let nftObject: NFT = {
            xrplAddress: xrplAddress,
            uri: imageData,
            nftId: nftId,            
            nftOfferId: '',
        };
        await AddObject(nftObject);

        // Create offer
        const offerId = await createOffer(xrplAddress, nftId);
        nftObject.nftOfferId = offerId;

        // Update DB
        await UpdateObject(nftId, nftObject)

        const payload = await xumm.payload?.create({
            user_token: userToken, // Doc: https://docs.xumm.dev/concepts/payloads-sign-requests/delivery/push
            txjson: {
                TransactionType: "NFTokenAcceptOffer",
                NFTokenSellOffer: offerId, 
            },
        } as any);
        console.log(payload)            
        return {
            nftId: nftId,
            payload: payload,
        }
    } catch (error) {
        console.log(error);
        return error
    }	
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	console.log('createNFT')
	return createNFT(body.userToken, body.xrplAddress, body.imageData)
})
