<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import { useRouter } from 'vue-router';

const router = useRouter();

const goToDashboard = () => {
  router.push('/teacher');
};
</script>

<template>
  <nav>
    <UButton color="blue" @click="goToDashboard">Go To Teacher's Dashboard</UButton>
  </nav>
</template>
