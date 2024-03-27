import { createOffer, mintNft }  from '@/server/xrpl/wallet'

export default defineEventHandler((event) => {
    return handler(event)
})

async function handler(event: any) {
    try { 
        const query = getQuery(event)

        if (typeof query.xrpAddress === 'string') {                                            
            const nftId = await mintNft();
            if (typeof nftId === 'string') {
                const result = await createOffer(query.xrpAddress, nftId);
                return nftId;                        
            } else {
                throw new Error('Problem generating NFT');
            }
        } else {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid transaction id',
            })
        }
    } catch (error) {
        console.log(error);
        return error
    }
}

// async function handler(event: any) {
//     try { 
//         const query = getQuery(event)
//         const runtimeConfig = useRuntimeConfig()

//         if (typeof query.transactionId === 'string') {
//             const requestBody = {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     method: "tx",
//                     params: [
//                         {
//                             transaction: query.transactionId,
//                             binary: false // Set to true if you want the transaction blob in binary format.
//                         }
//                     ]
//                 })
//             };
//             const response = await fetch('https://s.altnet.rippletest.net:51234/', requestBody);
//             const data = await response.json();
        
//             console.log("data for minter");
//             console.log(data);
//             if (data.result.NFTokenMinter !== runtimeConfig.xrplCommonsAddress) {
//                 throw createError({
//                     statusCode: 400,
//                     statusMessage: 'Invalid NFTokenMinter',
//                 })
//             }

//             if (data.result.TransactionType !== 'AccountSet') {
//                 console.log("Not account setting transaction")
//                 return {}
//             }
//             const account = data.result.Account;

//             let transaction = await mintNft();
//             return transaction;                        
//         } else {
//             throw createError({
//                 statusCode: 400,
//                 statusMessage: 'Invalid transaction id',
//             })
//         }        
//     } catch (error) {
//         console.log(error);
//         return error
//     }
// }