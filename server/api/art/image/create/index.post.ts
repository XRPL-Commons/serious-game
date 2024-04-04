import { saveFile } from '~/server/connectors/spaces'

export default defineEventHandler(async (event) => {
	console.log('image created')

	const { imageData, xrplAddress } = await readBody(event)
	if (!imageData) {
		throw createError({
			status: 400,
			statusMessage: 'Image not provided'
		})
	}
	if (!xrplAddress) {
		throw createError({
			status: 400,
			statusMessage: 'XRPL address not provided'
		})
	}
	console.log({ imageData, xrplAddress })

	const fileName = `alberx-${xrplAddress}.png`
	const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
	const fileContent = Buffer.from(base64Data, 'base64')

	const url = await saveFile({ fileName, fileContent })

	return JSON.stringify({ url })
})
