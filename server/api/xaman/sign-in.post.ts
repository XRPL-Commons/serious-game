import { getXumm } from '@/server/utils'

export default defineEventHandler((event) => {
    return handler()
})

async function handler() {
    try {        
        let xumm = getXumm();
        
        const pong = await xumm?.ping()        
        const payload = await xumm.payload?.create({
            custom_meta: {
                instruction: "Sign request from " + pong?.application.name,
              },
              txjson: {
                TransactionType: "SignIn",
              },
            });
        console.log(payload)
        return payload;        
    } catch (error) {
        console.log(error);
        return error
    }
}