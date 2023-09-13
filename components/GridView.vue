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
    <div class="text-xl rounded-md">{{ category }} ({{ count }})</div>

    <div class="flex" :class="`w-${gridSize}`">
      <template v-for="item in projects">
        <NuxtLink :to="'/projects/' + item._id">
          <div
            class="w-32 h-32 overflow-hidden shadow-lg inline-block m-1 border-2 relative inline-flex justify-center items-center border-black rounded flex-col">
            <div v-if="item.thumbnail" class="bg-contain bg-center w-full h-[50px] bg-no-repeat"
              :style="`background-image: url(${item.thumbnail})`">
            </div>

            <!-- <img v-if="item.thumbnail" :src="item.thumbnail" class="w-[60px]"> -->
            <div class="px-2 py-2 ">
              <div class="font-bold text-md text-center text-gray-900">{{ item.name }}</div>
            </div>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>