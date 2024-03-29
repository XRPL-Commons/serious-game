<template>
  <div v-if="!magSecret">This page requires the mag secret.</div>
  <template v-else>
    <div>
      <UButton label="Claim your NFT" @click="$router.push('/albers/mint')" />

      <br><br>
      List latest mints
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router'

const { params } = useRoute();
const xrplAddress = computed(() => params.xrplAddress || 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh')
const colors = ref()

// authentication
const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')


onMounted(() => {

})

onUnmounted(() => {

})
</script>

<style></style>