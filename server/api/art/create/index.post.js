import { GetCollection } from '~/server/connectors/mongo'

const commonsAddress = process.env.COMMONS_XRPL_ADDRESS

const createNFT = async ({ xrplAddress, imageData }) => {
	// check if NFT has already been minted

	// mint new NFT with image

	// insert into DB
	const Arts = GetCollection('arts')

	// create offer

	// insert into DB

	// return { nftId, nftOfferId }
	return {
		nftId: '123',
		nftOfferId: '234'
	}
}

export default defineEventHandler((event) => {
	console.log('createNFT')
	return createNFT()
})
