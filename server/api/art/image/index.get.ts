
export const checkImageExists = async ({ xrplAddress }: { xrplAddress: string }) => {
  const uri = `https://albers.fra1.cdn.digitaloceanspaces.com/alberx-${xrplAddress}.jpg`
  const thumbnail = `https://albers.fra1.cdn.digitaloceanspaces.com/alberx-${xrplAddress}-thumbnail.jpg`

  const check = await fetch(uri, { method: 'HEAD' })
  if (!check || check.status !== 200) {
    return false
  } else {
    console.log('main image existed', uri)
  }

  const checkThumbnail = await fetch(thumbnail, { method: 'HEAD' })
  if (!checkThumbnail || checkThumbnail.status !== 200) {
    return false
  } else {
    console.log('thumbnail image existed', thumbnail)
  }

  return uri
}

export default defineEventHandler(async (event) => {
  try {
    const { xrplAddress }: { xrplAddress: any } = getQuery(event)
    const result = await checkImageExists({ xrplAddress })
    console.log(result)
    return !!result
  } catch (e) {
    console.error(e)
    return false
  }
})
