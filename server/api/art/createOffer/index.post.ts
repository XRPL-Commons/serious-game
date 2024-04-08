import { createOffer, mintNft } from '~/server/connectors/wallet'
import { getXumm } from '@/server/utils'
import { NFT, UpdateOffer, GetObjects } from '~/server/connectors/mongo'
import { getExplorerClient } from '~/server/utils.js'

const createNFTOffer = async ({ xrplAddress, network }: { xrplAddress: string, network: string }) => {
    try {
        let xumm = getXumm();

        // Get NFT object
        const nft = await GetObjects({ xrplAddress, network });
        console.log(xrplAddress, nft);
        if (nft && nft.length > 0) {
            // Create offer
            let nftObject = nft[0]

            const offerId = await createOffer({ destination: xrplAddress, network, nftId: nftObject.nftId });
            nftObject.nftOfferId = offerId;
            console.log('createNFTOffer completed with ', offerId, { xrplAddress, network })

            // Update DB
            return await UpdateOffer(nftObject.nftId, nftObject);


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
    console.log('createNFTOffer', body)
    return createNFTOffer({
        xrplAddress: body.xrplAddress,
        network: body.network
    })
})
