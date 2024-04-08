import { getXumm } from '@/server/utils'
import { GetCollection } from '~/server/connectors/mongo'
import { getExplorerClient } from '~/server/utils'
import { Client, Request } from 'xrpl'

// const checkOffer = async ({ nftOfferId }: { nftOfferId: string }) => {
//   const NFTs = await GetCollection('nfts')
//   const nftObject: any = await NFTs.findOne({ nftOfferId })

//   // read the NFT on chain
//   // const client = await getExplorerClient(nftObject.network);
//   const client = new Client("wss://s.altnet.rippletest.net:51233")
//   await client.connect();

//   // Create the request object for nft_info method
//   const request: Request = {
//     command: 'nft_info',
//     nft_id: nftObject.nftId,
//   };
//   console.log('request', request)
//   // Send the request to get information about the NFT
//   const response = await client.request(request);

//   // Log the response
//   console.log(response);

//   // Disconnect from the server
//   await client.disconnect();

// }

export default defineEventHandler(async (event) => {
  const { userToken, offerId }: { userToken: string, offerId: string } = getQuery(event)

  if (!userToken) {
    throw createError({
      status: 400,
      statusMessage: 'missing user token'
    })
  }
  if (!offerId) {
    throw createError({
      status: 400,
      statusMessage: 'missing offer id'
    })
  }

  try {
    // console.log('DODODODOD')
    // console.log(await checkOffer({ nftOfferId: offerId }))

    let xumm = getXumm();

    const pong = await xumm?.ping()
    const payload = await xumm.payload?.create({
      user_token: userToken, // Doc: https://docs.xumm.dev/concepts/payloads-sign-requests/delivery/push
      txjson: {
        TransactionType: "NFTokenAcceptOffer",
        NFTokenSellOffer: offerId,
      },
      return_url: {
        "app": "https://mag.xrpl.quest/albers/mint",
        "web": "https://mag.xrpl.quest/albers/mint"
      }
    } as any);
    console.log(payload);
    return payload

  } catch (error: any) {
    console.error(error);
    throw createError({
      status: 500,
      statusMessage: error.toString()
    })
  }
})


