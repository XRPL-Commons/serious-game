import { getXumm } from '@/server/utils'

export default defineEventHandler((event) => {
    return handler(event)
})

async function handler(event: any) {
    try {        
        const query = getQuery(event)

        let xumm = getXumm();
        
        if ((typeof query.userToken === 'string')
            && (typeof query.approver === 'string')) { 
                const runtimeConfig = useRuntimeConfig()

                const payload = await xumm.payload?.create({
                    user_token: query.userToken, // Doc: https://docs.xumm.dev/concepts/payloads-sign-requests/delivery/push
                    txjson: { // Doc: https://xrpl.org/docs/references/protocol/transactions/types/accountset/
                        TransactionType: "AccountSet",
                        NFTokenMinter: runtimeConfig.xrplCommonsAddress,
                        Account: query.minter,
                        SetFlag: 10                        
                    }
                });
                console.log(payload)
                return payload;
        } else {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid user uuid',
            })
        }
        
    } catch (error) {
        console.log(error);
        return error
    }
}