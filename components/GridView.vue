<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['category', 'projects', 'color', 'textColor'])
const { category, projects, color, textColor } = toRefs(props)

const gridSize = computed(() => {
  const itemCount = projects?.value?.length
  return Math.ceil(Math.sqrt(itemCount))
})

const count = computed(() => projects?.value.length)
</script>

<template>
  <div class="inline-block items-bottom m-4 align-top">

    <div class="text-xl rounded-md border-2 px-2" :style="`background-color: ${color}; color: ${textColor}`">{{ category
    }}</div>
    <div class="inline-grid" :class="`grid-cols-${gridSize}`">
      <template v-for="item in projects">
        <NuxtLink :to="'/projects/' + item.slug">
          <GridViewItem :item="item" />
          <!-- <div
            class="w-[124px] h-[124px] overflow-hidden shadow-lg m-[2px] border-[1px] justify-center items-center border-[#000] rounded flex flex-col bg-[#fff] opacity-80 hover:opacity-100">
            <div v-if="item.thumbnail" class="bg-contain bg-center mt-[5px] w-[100px] h-[50px] bg-no-repeat"
              :style="`background-image: url(${item.thumbnail})`">
            </div>

            <div class="px-2 py-2 ">
              <div class="font-bold text-md text-center text-[#333]">{{ item.name }}</div>
            </div>
          </div> -->
        </NuxtLink>
      </template>
    </div>

    <span class="grid-cols-1"></span>
    <span class="grid-cols-2"></span>
    <span class="grid-cols-3"></span>
    <span class="grid-cols-4"></span>
    <span class="grid-cols-5"></span>
    <span class="grid-cols-6"></span>
    <span class="grid-cols-7"></span>
    <span class="grid-cols-8"></span>
    <span class="grid-cols-9"></span>
    <span class="grid-cols-10"></span>
    <span class="grid-cols-11"></span>

  </div>
</template>
