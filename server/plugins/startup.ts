//rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
import { checkImageExists } from "../api/art/image/index.get"
import { createNFT } from "../api/art/create/index.post"

// @ts-ignore
export default defineNitroPlugin(async (nitroApp) => {
  console.log('running startup...')
  // create NFT for origin address if it does not exist

  const xrplAddress = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
  const imageExists = await checkImageExists({ xrplAddress })
  if (imageExists) {
    const creationResult = createNFT(xrplAddress)
    console.log('created origin albers', creationResult)
  }
})