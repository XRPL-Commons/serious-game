<template>

  <div>
    <div class="m-2">
      <div class="ml-2 text-lg font-title text-gray-600 dark:text-gray-300 mb-4">
        Congratulations, you cracked the code and mastered the XRPL Crossword ! 
        <br />
        Your reward ? Your own, unique, generative art NFT !
      </div>      
      <UButton @click="$router.push('/albers/mint')" color="black" size="xl">
        Join the List of XRPL Legends, Mint Your Own Reward ! 
      </UButton>      
    </div>
    <template v-if="nfts && nfts.length > 0">
      <div class="">
        <div v-for="nft in nfts" :key="nft.nftId" class="inline-block m-2">
          <NuxtLink :to="`/albers/${nft.xrplAddress}`">
            <img :src="nft.uri" alt="NFT Image" class="nft-image" />
            <div class="nft-info">
              <p class="nft-address">{{ nft.xrplAddress }}</p>
              <p class="nft-date">Created at {{ formatDate(nft.mintedAt) }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/* @ts-ignore */
import { formatDate } from '~/utils/dateHelper';
import { ref, onMounted, onUnmounted } from "vue"
/* @ts-ignore */
import API from '~/server/client'
import { useRouter } from 'vue-router'

const router = useRouter();

const nfts = ref<NftObject[]>([]);

interface NftObject {
  nftId: string;
  uri: string;
  xrplAddress: string;
  mintedAt: string
}

onMounted(async () => {
  try {

    const result = await API.listCollection({})
    nfts.value = result
    console.log(nfts)
  } catch (error) {
    alert("Error getting NFT arts: " + error);
  }
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

.nft-address,
.nft-date {
  font-style: italic;
  font-size: 0.75rem;
  display: block;
}
</style>