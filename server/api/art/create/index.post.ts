import { mintNft } from '~/server/connectors/wallet'
import { getWallet } from '@/server/utils'
import { AddObject, NFT, GetObjects } from '~/server/connectors/mongo';

export const createNFT = async (xrplAddress: string) => {
    console.log('createNFT', xrplAddress)
    try {
        // Get NFT object
        const nft = await GetObjects(xrplAddress);
        if (nft && nft.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'This address already contains NFT',
            })
        }

        // check if file exists
        const uri = `https://albers.fra1.cdn.digitaloceanspaces.com/alberx-${xrplAddress}.png`

        try {
            const check = await fetch(uri, { method: 'HEAD' })
            console.log(check)
            if (check.status !== 200) {
                throw Error('not found')
            }
        } catch (e) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Missing Art file',
            })
        }

        // Mint new NFT with image
        const { nftId, mintedAt } = await mintNft(uri);

        // insert into DB
        const wallet = getWallet()
        let nftObject: NFT = {
            xrplAddress: xrplAddress,
            owner: wallet.address,
            uri: uri,
            nftId: nftId,
            nftOfferId: '',
            mintedAt: mintedAt,
            network: process.env.NETWORK || ''
        };
        const insert = await AddObject(nftObject)

        console.log({ insert })

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
    const { xrplAddress } = await readBody(event)
    if (!xrplAddress) {
        throw createError({
            status: 400,
            statusMessage: 'xrplAddress missing'
        })
    }
    return createNFT(xrplAddress)
})
