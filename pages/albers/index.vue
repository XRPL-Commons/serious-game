<template>
  <div v-if="!magSecret">This page requires the mag secret.</div>
  <template v-else>
    <div>
      <UButton label="Claim your NFT" @click="$router.push('/albers/mint')" />
      <br><br>
      List latest mints
      <div class="nft-grid">
        <div v-for="nft in nfts" :key="nft.nftObject.nftId" class="nft-item">
          <img :src="nft.nftObject.uri" alt="NFT Image" class="nft-image"/>
          <div class="nft-info">
            <p class="nft-address">{{ nft.nftObject.xrplAddress }}</p>
            <p class="nft-date">Created at</p>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import API from '~/server/client'
const router = useRouter()

const nfts = ref<Nft[]>([]);

// authentication
const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')

interface NftObject {
  nftId: string;
  uri: string;
  xrplAddress: string;
  // Add other properties as needed
}

interface Nft {
  nftObject: NftObject;
}

onMounted(async () => {
  try {
    if (!magSecret) {
      router.push('/')
    }
    const result = await API.listCollection({})
    nfts.value = result
    console.log(nfts)
  } catch (error) {
    alert("Error getting NFT arts: " + error);
  }
})

onUnmounted(() => {

})
</script>

<style>
.nft-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* .nft-item {
  flex: 1 1 400px;
} */

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

</style>