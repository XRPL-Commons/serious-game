import { getXumm } from '@/server/utils'

export default defineEventHandler((event) => {
    return handler(event)
})

async function handler(event: any) {
    try {        
        const query = getQuery(event)        

        let xumm = getXumm();
        
        if (typeof query.uuid === 'string') {
            const payload = await xumm.payload?.get(query.uuid);
            console.log(payload)
            return payload;
        } else {
            console.log(query)
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