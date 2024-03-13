<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps(['category', 'projects', 'color', 'textColor'])
const { category, projects, color, textColor } = toRefs(props)

const gridSizeClasses = computed(() => {
  const itemCount = projects?.value?.length
  const gridSize = Math.ceil(Math.sqrt(itemCount))
  return [
    `sm:grid-cols-${gridSize}`,
    `grid-cols-${Math.min(3, gridSize)}`
  ]
})

const count = computed(() => projects?.value.length)
</script>

<template>
  <div class="inline-block items-bottom sm:m-4 m-1 mb-2 align-top">
    <div class="text-xl rounded-md border-2 px-2" :style="`background-color: ${color}; color: ${textColor}`">{{ category
    }}</div>
    <div class="inline-grid grid-cols" :class="gridSizeClasses">
      <template v-for="item in projects">
        <NuxtLink :to="'/projects/' + item.slug">
          <GridViewItem :item="item" />
        </NuxtLink>
      </template>
    </div>

    <span class="grid-cols-1 sm:grid-cols-1"></span>
    <span class="grid-cols-2 sm:grid-cols-2"></span>
    <span class="grid-cols-3 sm:grid-cols-3"></span>
    <span class="grid-cols-3 sm:grid-cols-4"></span>
    <span class="grid-cols-3 sm:grid-cols-5"></span>
    <span class="grid-cols-3 sm:grid-cols-6"></span>
    <span class="grid-cols-3 sm:grid-cols-7"></span>
    <span class="grid-cols-3 sm:grid-cols-8"></span>
    <span class="grid-cols-3 sm:grid-cols-9"></span>
    <span class="grid-cols-3 sm:grid-cols-10"></span>
    <span class="grid-cols-3 sm:grid-cols-11"></span>

  </div>
</template>
