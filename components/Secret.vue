<template>
  <ClientOnly>
    <UTooltip text="Disconnect and logout">
      <UButton v-if="magSecret" icon="i-heroicons-arrow-right-start-on-rectangle-20-solid" color="white" variant="ghost"
        aria-label="Theme" @click="removeSecret" class="rounded-full" />
    </UTooltip>
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const router = useRouter()

// authentication
const magSecret = inject('magSecret')
// ref<string | null>(null)
// magSecret.value = localStorage.getItem('mag_secret')

const removeSecret = () => {
  magSecret.value = null
  localStorage.removeItem('user_token')
  localStorage.removeItem('xrpl_address')
  router.push('/')
}
</script>