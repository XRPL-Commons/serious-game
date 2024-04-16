import { mintNft } from '~/server/connectors/wallet'
import { getWallet } from '@/server/utils'
import { AddObject, UpdateNFTId, NFT, GetObjects } from '~/server/connectors/mongo'
import { checkImageExists } from '~/server/api/art/image/index.get'


export const createNFT = async ({ xrplAddress, network }: { xrplAddress: string, network: string }) => {
    console.log('createNFT', xrplAddress)
    try {
        // Get NFT object
        const nft = await GetObjects({ xrplAddress, network });
        if (nft && nft.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'This address already has an NFT',
            })
        }

        // check if file exists
        const uri = await checkImageExists({ xrplAddress })
        if (uri === false) {
            throw createError({
                status: 500,
                statusMessage: 'Art file missing'
            })
        }

        // insert into DB
        const wallet = getWallet()
        let nftObject: NFT = {
            xrplAddress: xrplAddress,
            owner: wallet.address,
            uri,
            nftId: '',
            nftOfferId: '',
            mintedAt: '',
            network
        };
        const insert = await AddObject(nftObject)


        // Mint new NFT with image
        console.log('about to mint', { uri, network })
        const { nftId, mintedAt } = await mintNft({ uri, network })

        await UpdateNFTId({ nftId, mintedAt, xrplAddress, network })

        return {
            nftId: nftId,
            nftUri: uri,
            mintedAt: mintedAt,
        }
    } catch (error: any) {
        console.error(error);
        throw createError({
            status: 500,
            statusMessage: error.toString()
        })
    }
}

export default defineEventHandler(async (event) => {
    const { xrplAddress, network } = await readBody(event)
    if (!xrplAddress) {
        throw createError({
            status: 400,
            statusMessage: 'xrplAddress missing'
        })
    }
    return createNFT({ xrplAddress, network })
})
