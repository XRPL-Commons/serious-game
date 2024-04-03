import { saveFile } from '~/server/connectors/spaces'

export default defineEventHandler(async (event) => {
	console.log('image created')

	const { imageData, xrplAddress } = await readBody(event)
	console.log({ imageData, xrplAddress })

	const fileName = `alberx-${xrplAddress}.png`
	const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
	const fileContent = Buffer.from(base64Data, 'base64')

	const url = await saveFile({ fileName, fileContent })

	console.log(url)
	return JSON.stringify({ result: `hello world ${xrplAddress}`, url })
})
