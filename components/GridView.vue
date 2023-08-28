<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['category', 'projects'])
const { category, projects } = toRefs(props)

const gridSize = computed(() => {
  const itemCount = projects?.value?.length
  return Math.ceil(Math.sqrt(itemCount)) * 34
})

const count = computed(() => projects.value.length)
</script>

<template>
  <div :class="`w-${gridSize}`" class="flex-none">
    <h1 class="text-xl">{{ category }} ({{ count }})</h1>

    <div class="flex" :class="`w-${gridSize}`">
      <template v-for="item in projects">
        <NuxtLink :to="'/projects/' + item._id">
          <div
            class="w-32 h-32 rounded overflow-hidden shadow-lg inline-block m-1 border-1 relative inline-flex justify-center items-center border-2 border-black">
            <div class="px-2 py-2 ">
              <div class="font-bold text-md mb-2 text-center bg-gray-100">{{ item.Project }}</div>
            </div>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>