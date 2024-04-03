import { mintNft }  from '@/server/xrpl/wallet'
import { getWallet } from '@/server/utils'
import { AddObject, NFT, GetObjects } from '~/server/connectors/mongo';

const createNFT = async (xrplAddress: string) => {
    console.log(xrplAddress)
	try {
        // Get NFT object
        const nft = await GetObjects();
        if (nft && nft.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'This address already contains NFT',
            })            
        }

        // Todo: add creation 
        const uri: string = "https://albers.fra1.digitaloceanspaces.com/alberX-rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh.png";

        // Mint new NFT with image
        const { nftId, mintedAt } = await mintNft(uri);
            
        // insert into DB
        const wallet = getWallet();
        let nftObject: NFT = {
            xrplAddress: xrplAddress,
            owner: wallet.address,
            uri: uri,
            nftId: nftId,            
            nftOfferId: '',
            mintedAt: mintedAt,
        };
        await AddObject(nftObject);
         
        return {
            nftId: nftId,
            nftUri: uri,
            mintedAt: mintedAt,
        }
    } catch (error) {
        console.log(error);
        return error
    }	
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	console.log('createNFT')
	return createNFT(body.xrplAddress)
})
