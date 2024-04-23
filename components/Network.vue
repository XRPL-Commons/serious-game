<template>
  <ClientOnly>
    <UTooltip text="Network settings">
      <UButton :icon="isMainnet ? 'i-heroicons-lock-closed-20-solid' : 'i-heroicons-lock-open-20-solid'" color="gray"
        variant="ghost" aria-label="Theme" @click="onClickNetwork" class="rounded-full" />
    </UTooltip>
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

const network = inject('network')
const toggleNetwork = inject('toggleNetwork')
const isMainnet = computed(() => network.value === 'MAINNET')

const onClickNetwork = () => {
  alert(`Switching to ${isMainnet.value ? 'Testnet' : 'Mainnet'}`)
  toggleNetwork()
  console.log('Network is now', network.value)
}

</script>