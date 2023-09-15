<script setup lang="ts">
const props = defineProps(['item'])
const { item } = toRefs(props)
</script>

<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg border-black border-2 bg-white">
    <div class="relative inline-block p-4 bg-yellow-100 w-full aspect-[2/1]">
      <div v-if="item.logo" class="bg-contain bg-center bg-no-repeat w-full aspect-[2/1]"
        :style="`background-image: url(${item.logo})`">
      </div>
    </div>
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">{{ item.name }}</div>
      <p class="text-gray-700 text-base">
        {{ item.description }}
      </p>
    </div>
    <div class="px-6 pt-4 pb-2" v-if="item.tags">
      <template v-for="tag in item.tags">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{
          tag }}</span>
      </template>
    </div>
    <div class="px-6 pt-4 pb-2" v-if="item.grants === 'Yes'">
      Grant recipient
    </div>
    <div class="px-6 pt-4 pb-2">
      This project is {{ item.status }}
    </div>
    <div class="px-6 pt-4 pb-2">
      <a :href="item.url" target="_blank" class="text-blue-800">{{ item.url }}</a>
    </div>
  </div>
  <!-- <pre>{{ item }}</pre> -->
</template>