<template>
  <div v-if="!magSecret">This page requires the mag secret.</div>
  <template v-else>
    <div class="text-center">
      <div class="inline-block">
        <albers :xrpl-address="xrplAddress" @loaded="onImageLoaded" />
      </div>
      <div class="text-center font-title text-lg" v-if="nft?.rank">Rank #{{ nft?.rank }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue"
import { useRoute } from 'vue-router'
/* @ts-ignore */
import API from '~/server/client'

/* @ts-ignore */
definePageMeta({
  layout: 'fullscreen'
})


const { params } = useRoute()
const xrplAddress = computed(() => params.xrplAddress || 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh')
const network: any = inject('network')

// authentication
const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')

const nft: any = ref(null)

onMounted(async () => {
  const nfts = await API.getNFTs({ xrplAddress: xrplAddress.value, network: network.value })
  if (nfts && nfts.length > 0) {
    nft.value = nfts[0]
  }
})

const twitterUrl = ref('')

const onImageLoaded = ({ url }) => {
  console.log('onImageLoaded', url)
  twitterUrl.value = url
}

/* @ts-ignore */
useHead({
  title: 'Community Mag Quest',
  meta: [
    { name: 'description', content: 'A unique Albers inspired generative art NFT based on your xrpl address.' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@xrpl_commons' },
    { name: 'twitter:title', content: 'Community Mag Quest' },
    { name: 'twitter:description', content: 'A unique Albers inspired generative art NFT based on your xrpl address.' },
    { name: 'twitter:creator', content: '@xrpl_commons' },
    { name: 'twitter:image', content: `${twitterUrl.value}` },
    { name: 'twitter:domain', content: 'xrpl-commons.org' }
  ]
})

</script>
<style>
canvas {
  display: block;
  /* Changes the default display to block, which removes extra space beneath the canvas typical of inline elements */
  max-width: 100%;
  /* Sets the maximum width to 100% of the parent element, preventing the canvas from exceeding the width of the viewport */
  max-height: 100vh;
  /* Sets the maximum height to 100% of the viewport height, preventing the canvas from exceeding the height of the viewport */
  width: auto;
  /* Allows the width of the canvas to be automatically adjusted while maintaining the aspect ratio */
  height: auto;
  /* Allows the height of the canvas to be automatically adjusted while maintaining the aspect ratio */
  object-fit: contain;
  /* Ensures that the canvas content is scaled correctly to fit within its box while preserving aspect ratio. The entire canvas is visible, but it may be letterboxed if its aspect ratio differs from its container. */
}
</style>