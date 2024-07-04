<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UModals />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
const token = ref(null)

provide('token', token)
</script>