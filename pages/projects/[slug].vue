<script setup lang="ts">
import { computed } from 'vue'
const route = useRoute()

// authentication
const apiKey = ref(localStorage.getItem('xrpl_map_api_key'))
const slug = ref(route.params.slug)

const { data } = await useFetch('/api/projects/' + route.params.slug)
const item = computed(() => data)
</script>

<template >
  <NuxtLink to="/"
    class="text-black inline-flex flex-row rounded-full pl-2 pr-4 py-2 bg-dodger-blue-200 hover:bg-dodger-blue-300 transition-all">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
    <span>Back to List</span>
  </NuxtLink>
  <br />
  <br />
  <ProjectDetails :item="item" />
  <br />
  <br />
  <NuxtLink v-if="apiKey" :to="`/admin/${slug}`"
    class="text-black inline-flex flex-row rounded-full pl-2 pr-4 py-2 bg-dodger-blue-200 hover:bg-dodger-blue-300 transition-all">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="w-6 h-6 mx-2">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>


    <span>Edit this record</span>
  </NuxtLink>
</template>