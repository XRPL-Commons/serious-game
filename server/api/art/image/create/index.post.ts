import { saveFile } from '~/server/connectors/spaces'
import { checkImageExists } from '~/server/api/art/image/index.get'
import sharp from 'sharp'

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

	const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "")
	const fileContent = Buffer.from(base64Data, 'base64')

	const mainFile = await sharp(fileContent)
		.webp({ quality: 80 })

	const url = await saveFile({
		fileName: `alberx-${xrplAddress}.webp`,
		fileContent: mainFile
	})

	const thumbnailFile = await sharp(fileContent)
		.webp({ quality: 80 })
		.resize({
			width: 600,
			height: 800,
			fit: 'inside',
			background: { r: 255, g: 255, b: 255, alpha: 0 }
		}).toBuffer()
	const thumbnail = await saveFile({
		fileName: `alberx-${xrplAddress}-thumbnail.webp`,
		fileContent: thumbnailFile
	})

	// make sure the file exists
	console.log(url, thumbnail, await checkImageExists({ xrplAddress }))

	return JSON.stringify({ url })
})
