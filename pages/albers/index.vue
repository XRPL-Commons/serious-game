<template>

  <div>
    <div class="m-2">
      <div class="ml-2 text-md text-center font-title text-gray-600 dark:text-gray-300 mb-4">
        Congratulations, you made it through!

        <br />
        If you want to get your own unique, Albers-inspired, generative art NFT, you can claim it now.

        <br />
        <br />
        <UButton @click="$router.push('/albers/mint')" color="black" size="xl" class="">
          Claim your NFT
        </UButton>
        <br />
        <br />
        Join the legends
      </div>

    </div>
    <div class="text-center">
      <template v-if="nfts && nfts.length > 0">
        <div class="inline-block">
          <div v-for="nft in nfts" :key="nft.nftId" class="inline-block m-2">
            <NuxtLink :to="`/albers/${nft.xrplAddress}`">
              <img :src="nft.uri" alt="NFT Image" class="nft-image rounded-lg" />
              <div class="nft-info">
                <p class="nft-date">{{ formatDate(nft.mintedAt) }}</p>
                <div class="text-center font-title text-lg" v-if="nft.rank">Rank #{{ nft.rank }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/* @ts-ignore */
import { formatDate } from '~/utils/dateHelper';
import { ref, onMounted, inject, watch } from "vue"
/* @ts-ignore */
import API from '~/server/client'
import { useRouter } from 'vue-router'


const router = useRouter()
const network: any = inject('network')

const nfts = ref<NftObject[]>([]);

interface NftObject {
  nftId: string;
  uri: string;
  xrplAddress: string;
  mintedAt: string;
  rank: number;
}

onMounted(async () => {
  try {
    const result = await API.listCollection({ network: network.value })
    nfts.value = result
  } catch (error) {
    alert("Error getting NFT arts: " + error);
  }
})

watch(network, async () => {
  try {
    const result = await API.listCollection({ network: network.value })
    nfts.value = result
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