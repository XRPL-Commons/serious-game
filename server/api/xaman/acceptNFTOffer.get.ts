import { getXumm } from '@/server/utils'

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
    let xumm = getXumm();

    const pong = await xumm?.ping()
    const payload = await xumm.payload?.create({
      user_token: userToken, // Doc: https://docs.xumm.dev/concepts/payloads-sign-requests/delivery/push
      txjson: {
        TransactionType: "NFTokenAcceptOffer",
        NFTokenSellOffer: offerId,
      },
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


