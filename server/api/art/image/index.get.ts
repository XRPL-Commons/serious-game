
export const checkImageExists = async ({ xrplAddress }: { xrplAddress: string }) => {
  const uri = `https://albers.fra1.cdn.digitaloceanspaces.com/alberx-${xrplAddress}.webp`

  const check = await fetch(uri, { method: 'HEAD' })
  if (!check || check.status !== 200) {
    return false
  }
  return true
}

export default defineEventHandler(async (event) => {
  try {
    const { xrplAddress }: { xrplAddress: any } = getQuery(event)
    return checkImageExists({ xrplAddress })
  } catch (e) {
    console.error(e)
    return false
  }
})
