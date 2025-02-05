<template>
  <div>
    <!-- Display Token Value -->
    <div>'{{ token }}'</div>

    <!-- Centered Welcome Message -->
    <div class="text-center">
      <div class="w-lg inline-block text-lg text-gray-600 dark:text-gray-300">
        <p class="font-body text-md m-6">Welcome to the XRPL Serious Game</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { inject } from 'vue'
import { useRouter } from 'vue-router'

// Setup router for navigation
const router = useRouter()

// Inject the token value 
const token = inject<string>('token')

onMounted(() => {
  router.push('/login');
});

</script>
