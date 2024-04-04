<template>
  <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center mt-20">
    <template v-if="isConnected">      
      <div class="nft-item" v-if="hasNft">
        <div class="nft-button-item">
          <button v-if="!ownsNft" @click="claimNft"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
            Claim my NFT Art
          </button>
        </div>        
        <h1>Your XRPL Commons Magazine NFT Art</h1>
        <br/>
        <img :src="nftUri" alt="NFT Image" class="nft-image"/>
        <div class="nft-info">
          <p class="nft-address">{{ xrplAddress }}</p>
          <p class="nft-date">Created at {{ formatDate(nftDate) }}</p>
        </div>
      </div>
    </template>
    <QRCodeModal :visible="modalVisible" :qrCodeSrc="qrCodeSrc" :isConnection="isConnection"
      @close="modalVisible = false" />
    <div v-if="isMintingNFT"
      class="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center backdrop-blur">
      <div role="status" class="text-center">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill" />
        </svg>
        <span class="sr-only">Loading...</span>
        <p class="text-lg font-semibold">Please wait for your NFT to be minted on XRPL...</p>
      </div>
    </div>    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useFetch } from '@vueuse/core'
import API from '~/server/client'
const router = useRouter()

const isConnected = ref(false);
const isConnection = ref(true);
const modalVisible = ref(false);
const qrCodeSrc = ref('');
const isMintingNFT = ref(false);
const userToken = ref('');
const xrplAddress = ref('');
const ws = ref(null);
const nftBought = ref(false);

// Nft related info
const hasNft = ref(false);
const ownsNft = ref(false);
const nftId = ref('');
const nftUri = ref('');
const nftDate = ref('');

// Authentication
const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')

onMounted(async () => {
  if (!magSecret) {
    router.push('/')
  }

  const localUserToken = localStorage.getItem('user_token');
  const localXrpAddress = localStorage.getItem('xrp_address');
  if (localUserToken && localXrpAddress) {
    isConnected.value = true;
    userToken.value = localUserToken;
    xrplAddress.value = localXrpAddress;
    isConnection.value = false;
    await getItem();
  } else {
    await generateQrCode();
    // try {
    //   const payload = await API.signInXaman({});
    //   qrCodeSrc.value = payload.refs.qr_png;
    //   modalVisible.value = true;
    //   initializeWebSocket(payload.refs.websocket_status);
    // } catch (error) {
    //   alert('Error connecting to Xumm: ' + error);
    // }
  }
});

onUnmounted(() => {

})

async function generateQrCode() {
  try {
    const payload = await API.signInXaman({});
    qrCodeSrc.value = payload.refs.qr_png;
    modalVisible.value = true;
    initializeWebSocket(payload.refs.websocket_status);
  } catch (error) {
    alert('Error connecting to Xumm: ' + error);
  }
}

async function initializeWebSocket(url: string) {
  /* @ts-ignore */
  ws.value = new WebSocket(url);
  /* @ts-ignore */
  ws.value.onmessage = async (message) => {
    let responseObj = JSON.parse(message.data);
    if (responseObj.signed !== null && responseObj.signed !== undefined) {        
      const { data } = await useFetch(`/api/payload?uuid=${responseObj.payload_uuidv4}`).json();            

      const runtimeConfig = useRuntimeConfig()
      if (data.value.response.environment_nodetype === process.env.NETWORK) {
        modalVisible.value = false;
        isConnected.value = true;
        isConnection.value = false;
        xrplAddress.value = data.value.response.account;
        localStorage.setItem('xrp_address', data.value.response.account);        
        localStorage.setItem('user_token', data.value.application.issued_user_token);
        userToken.value = data.value.application.issued_user_token;
        if (data.value.payload.tx_type == 'SignIn') {
          await getItem();
          if (!hasNft.value) {
            await mintNft();
          }
        } else if (data.value.payload.tx_type == 'NFTokenAcceptOffer') {
          await redeemNft();
        }
      } else {
        alert('Wrong network used: netwrok should be: ' + runtimeConfig.public.network);
        await generateQrCode()
        return;
      }      
    }
  };
};

async function claimNft() {
  try {
    isMintingNFT.value = true;  
    const { payload } = await API.claimNFT({ userToken: userToken.value, xrplAddress: xrplAddress.value })
    console.log(payload);
    qrCodeSrc.value = payload.refs.qr_png;
    modalVisible.value = true;
    isMintingNFT.value = false;
    initializeWebSocket(payload.refs.websocket_status);    
  } catch (error) {
    console.log(error)
    alert("Error claiming NFT");
  }
};

async function mintNft() {
  try {
    isMintingNFT.value = true;
    await API.createImage({ xrplAddress: xrplAddress.value })
    const { nftId: id, nftUri: uri, mintedAt } = await API.createNFT({ xrplAddress: xrplAddress.value })
    hasNft.value = true;
    nftUri.value = uri;
    nftId.value = id;
    nftDate.value = mintedAt
    isMintingNFT.value = false;
  } catch (error) {
    console.log(error)
    alert("Error minting NFT");
  }
}

async function redeemNft() {
  try {    
    await API.redeemNFT({ xrplAddress: xrplAddress.value })
    ownsNft.value = true;
  } catch (error) {
    console.log(error)
    alert("Error redeeming NFT");
  }
}

async function getItem() {
  try {
    const result = await API.listCollection({})
    if (result && result.length > 0) {
      hasNft.value = true;
      nftUri.value = result[0].uri;
      nftId.value = result[0].nftId;
      nftDate.value = result[0].mintedAt;
      if (result[0].owner === result[0].xrplAddress) {
        ownsNft.value = true;
      }
    } else {
      await mintNft();
    }
  } catch (error) {
    alert("Error getting NFT arts: " + error);    
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

.nft-address, .nft-date {
  font-style: italic;
  font-size: 0.75rem;
  display: block;
}

.nft-button-item {
  text-align: center;
}
</style>
