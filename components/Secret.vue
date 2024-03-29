<template>
  <ClientOnly>
    <UButton v-if="magSecret" icon="i-heroicons-arrow-right-start-on-rectangle-20-solid" color="gray" variant="ghost"
      aria-label="Theme" @click="removeSecret" class="rounded-full" />
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const router = useRouter()

// authentication
const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')

const removeSecret = () => {
  localStorage.removeItem('mag_secret')
  router.push('/')
}
</script>