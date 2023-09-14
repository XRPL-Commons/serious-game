<script setup lang="ts">
import { computed } from 'vue'
const route = useRoute()

const { data } = await useFetch('/api/projects/' + route.params.slug)
const item = computed(() => data)
</script>

<template >
  <NuxtLink to="/" class="text-blue-500">&lt;- Back</NuxtLink>
  <br />
  <br />
  <ProjectDetails :item="item" />
</template>