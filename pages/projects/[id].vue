<script setup lang="ts">
import { computed } from 'vue'
const route = useRoute()

const { data } = await useFetch('/api/projects/' + route.params.id)
const item = computed(() => data)
</script>

<template >
  <NuxtLink to="/" class="text-blue-500">&lt;- Back</NuxtLink>
  <br />
  <br />
  <div class="max-w-sm rounded overflow-hidden shadow-lg border-black border-2">
    <!-- <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"> -->
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">{{ item.value.Project }}</div>
      <p class="text-gray-700 text-base">
        {{ item.value.Description }}
      </p>
    </div>
    <div class="px-6 pt-4 pb-2" v-if="item.value.tags">
      <template v-for="tag in item.value.tags">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{
          tag }}</span>
      </template>
    </div>
    <div class="px-6 pt-4 pb-2">
      <a :href="item.value.URL" target="_blank" class="text-blue-800">{{ item.value.URL }}</a>
    </div>
  </div>
</template>