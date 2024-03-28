import { createOffer, mintNft }  from '@/server/xrpl/wallet'
import { getXumm } from '@/server/utils'

const createNFT = async (userToken: string, xrplAddress: string, imageData: string) => {
	// check if NFT has already been minted

	// mint new NFT with image

	// insert into DB

	// create offer

	// insert into DB

	// return { nftId, nftOfferId }

	try {
        let xumm = getXumm();
        const nftId = await mintNft();
        if (typeof nftId === 'string') {
            const offerId = await createOffer(xrplAddress, nftId);                                

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
        } else {
            throw new Error('Problem generating NFT');
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
