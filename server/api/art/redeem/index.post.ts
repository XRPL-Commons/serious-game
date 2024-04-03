import { UpdateObject, GetObjects } from '~/server/connectors/mongo';

const claimNFT = async (xrplAddress: string) => {
	try {

        // Get NFT object
        const nft = await GetObjects();

        if (nft && nft.length > 0) {
            // Create offer
            let nftObject = nft[0];

            // TODO: check on explorer
            nftObject.owner = xrplAddress;

            // Update DB
            await UpdateObject(nftObject.nftId, nftObject);            
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
	console.log('redeemingNFT')
	return claimNFT(body.xrplAddress)
})
