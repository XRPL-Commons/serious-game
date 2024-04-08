import { UpdateOwner, GetObjects } from '~/server/connectors/mongo';

const redeemNFT = async ({ xrplAddress, network }: { xrplAddress: string, network: string }) => {
    try {

        // Get NFT object
        console.log({ xrplAddress, network })
        const nft = await GetObjects({ xrplAddress, network });

        if (nft && nft.length > 0) {
            // Create offer
            let nftObject = nft[0];

            // TODO: check on explorer
            nftObject.owner = xrplAddress;

            // Update DB
            await UpdateOwner(nftObject.nftId, nftObject);
            return '{}'
        } else {
            throw new Error("NFT not found");
        }
    } catch (error) {
        console.log(error);
        return error
    }
}

export default defineEventHandler(async (event) => {
    const { xrplAddress, network } = await readBody(event)
    console.log('redeemingNFT')
    return redeemNFT({ xrplAddress, network })
})
