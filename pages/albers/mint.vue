<template>
  <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center mt-20 flex-col">
    <template v-if="xrplAddress">
      <!-- <pre>{{ userNFT }}</pre>
      <pre>{{ ownsNFT }}</pre> -->
      <div class="ml-2 md:text-2xl text-lg font-title text-gray-600 dark:text-gray-300 mb-4 text-center">
        <template v-if="NFTExists">
          <template v-if="!ownsNFT">
            <template v-if="NFTHasOffer">
              <div class="mb-4">
                Your NFT is ready!
              </div>
              <UButton @click="claimNft" color="black" size="xl">
                Claim your NFT
              </UButton>
            </template>
            <template v-else>
              Preparing your claim...
            </template>
          </template>

          <template v-else>
            <div class="ml-2 md:text-2xl text-lg font-title text-gray-600 dark:text-gray-300 mb-4">
              Congratulations!<br />
              You've completed the quest!</div>
            <div class="ml-2 md:text-xl text-lg font-title text-gray-600 dark:text-gray-300 mb-4">
              Share on X and come see us <br />
              at our next <a href="https://www.xrpl-commons.org/training" target="_blank"
                class="link-style">training</a> to claim a prize
            </div>
            <ShareOnX />
          </template>
        </template>
        <template v-else>One moment while we prepare your NFT...</template>
      </div>

      <NuxtLink :to="`/albers/${xrplAddress}`">
        <albers :xrplAddress="xrplAddress" @loaded="onImageLoaded" />
      </NuxtLink>
      <div class="text-center font-title text-xl" v-if="userNFT && userNFT.rank">Rank #{{ userNFT.rank }}</div>
    </template>
    <template v-else>
      <div class="ml-2 md:text-2xl text-lg font-title text-gray-600 dark:text-gray-300 mb-4">Connect your wallet to
        continue...</div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
/* @ts-ignore */
import { QRCodeModal } from '#components'
/* @ts-ignore */
import API from '~/server/client'

// flow:
// check if wallet connected: xrplAddress?
// -> connectWallet
// check if user has an NFT: userNFT.uri?
// =-> show Albers, wait for onImageLoaded to Mint and then CreateOffer in the background
// => when available augment view with updated info from the userNFT
// => display Claim button
// => ClaimNFT flow
// display Albers with info from userNFT

/* @ts-ignore */
const modal = useModal()

// wallet
const userToken = ref('')
const xrplAddress = ref('')
// local image
const localURI = ref(null)
// user NFT
const userNFT = ref(null) as any


// general
const working = ref(false)


onMounted(async () => {
  userToken.value = localStorage.getItem('user_token') || ''
  xrplAddress.value = localStorage.getItem('xrpl_address') || ''

  if (!userToken.value || !xrplAddress.value) {
    await connectWallet()
  }
})

// triggers getOrMintNFT on xrplAddress change
watch(xrplAddress, async (newValue, oldValue) => {
  console.log('triggered on xrplAddresss change', { newValue, oldValue })
  if (newValue !== '') {
    let nftInfo = await getNftInfo({ xrplAddress: xrplAddress.value })
    userNFT.value = nftInfo
  }
})

const NFTExists = computed(() => userNFT.value?.nftId)

const NFTHasOffer = computed(() => userNFT.value?.nftOfferId)

const ownsNFT = computed(() => {
  return (userNFT.value && userNFT.value.owner && userNFT.value.owner === xrplAddress.value)
})

// trigger on userNFT change
watch(() => localURI.value && userNFT.value, async (newValue: any, oldValue) => {
  try {
    console.log('watch userNFT', newValue)
    if (!localURI.value) {
      console.log('no image...')
      return
    }
    console.log('watch userNFT image', localURI.value, await API.albersURLExists({ xrplAddress }))
    if (!newValue) {
      // need to mint
      console.log('should mint...', { xrplAddress: xrplAddress.value })
      const mintResult = await API.createNFT({ xrplAddress: xrplAddress.value })
      console.log({ mintResult })
      userNFT.value = await getNftInfo({ xrplAddress: xrplAddress.value })
    } else if (!newValue.nftOfferId) {
      // need to create offer
      const createOfferResult = await API.createOffer({ xrplAddress: xrplAddress.value })
      console.log({ createOfferResult })
      userNFT.value = await getNftInfo({ xrplAddress: xrplAddress.value })
    }
  } catch (e) {
    console.error('oups', e)
  }
})

const onImageLoaded = ({ url }: any) => {
  console.log('onImageLoaded', { url })
  localURI.value = url
}

async function initializeWebSocket({ url, onMessage }: { url: string, onMessage?: any }) {
  /* @ts-ignore */
  const ws = new WebSocket(url);
  /* @ts-ignore */
  ws.onmessage = async (message) => {
    let responseObj = JSON.parse(message.data)
    console.log(responseObj)
    const { signed, payload_uuidv4 } = responseObj

    // only handle signed messages
    if ((signed !== true) || !payload_uuidv4) {
      return
    }

    // get payload from backend
    const data: any = await API.XamanGetPayload({ uuid: payload_uuidv4 })

    console.log({ data })

    // check network
    /* @ts-ignore */
    const runtimeConfig = useRuntimeConfig()
    if (data.response.environment_nodetype !== runtimeConfig.public.network) {
      // regen qr code
      alert('Wrong network used: network should be: ' + runtimeConfig.public.network);
      await connectWallet()
      return
    }

    await onMessage({
      data,
      wsClose: () => ws.close()
    })
  }

  return ws
}

function connectWallet() {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = await API.XamanSignIn()

      // from payload
      const qrCodeSrc = payload.refs.qr_png
      const mobileUrl = payload.next.always;
      const websocket_status = payload.refs.websocket_status

      // launch modal
      console.log({ qrCodeSrc, mobileUrl })
      modal.open(QRCodeModal, {
        qrCodeSrc,
        mobileUrl
      })

      const ws = await initializeWebSocket({
        url: websocket_status,
        onMessage: async ({ data, wsClose }: { data: any, wsClose: any }) => {
          // only deal with Signin
          if (data.payload.tx_type == 'SignIn') {
            // save wallet data to localStorage
            xrplAddress.value = data.response.account
            userToken.value = data.application.issued_user_token
            localStorage.setItem('xrpl_address', xrplAddress.value)
            localStorage.setItem('user_token', userToken.value)
            modal.close(QRCodeModal)
            wsClose()
            resolve(xrplAddress.value)
          } else {
            console.log('ignored message', data)
          }
        }
      })

    } catch (error) {
      alert('Error connecting to Xumm: ' + error)
      reject(error)
    }
  })
  // todo add race condition with timeout?
}

const getNftInfo = async ({ xrplAddress }) => {
  const result = await API.getNFTs({ xrplAddress })
  const nftInfo = result?.[0]
  return nftInfo
}

async function claimNft() {
  return new Promise(async (resolve, reject) => {
    try {
      working.value = true
      const payload = await API.XamanGetAcceptNFTOffer({
        userToken: userToken.value,
        offerId: userNFT.value.nftOfferId
      })

      // from payload
      console.log(payload)
      const qrCodeSrc = payload.refs.qr_png
      const mobileUrl = payload.next.always
      const websocket_status = payload.refs.websocket_status

      // launch modal
      console.log({ qrCodeSrc, mobileUrl })
      modal.open(QRCodeModal, {
        qrCodeSrc,
        mobileUrl
      })

      const ws = await initializeWebSocket({
        url: websocket_status,
        onMessage: async ({ data, wsClose }: { data: any, wsClose: any }) => {
          // only deal with NFTAcceptOffer
          if (data.payload.tx_type == 'NFTokenAcceptOffer') {
            await redeemNft({ xrplAddress: xrplAddress.value });
            modal.close(QRCodeModal)
            resolve('something')
            wsClose()
          } else {
            console.log('ignored message', data)
          }
        }
      })

    } catch (error) {
      alert('Error connecting to Xumm: ' + error)
      reject(error)
    }
  })
}

async function redeemNft({ xrplAddress }) {
  try {
    await API.redeemNFT({ xrplAddress })
    userNFT.value = await getNftInfo({ xrplAddress })
  } catch (error) {
    console.log(error)
    alert("Error redeeming NFT");
  }
}


</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.backdrop-blur {
  backdrop-filter: blur(5px);
}

.z-50 {
  z-index: 50;
}

.min-h-screen {
  min-height: 100vh;
}

.nft-image {
  width: 300px;
  height: 400px;
  object-fit: cover;
}

.nft-info p {
  text-align: center;
}

.nft-address,
.nft-date {
  font-style: italic;
  font-size: 0.75rem;
  display: block;
}

.nft-button-item {
  text-align: center;
}
</style>
