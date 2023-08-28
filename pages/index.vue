<script setup lang="ts">
import { computed } from 'vue'
const { data } = await useFetch('/api/projects')

const sections = computed(() => {
  const sortedSection = data.value.map(item => item.Section).sort()
  return [...new Set(sortedSection)]
})

const categoriesBySection = computed(() => {
  const result = {}
  data.value.forEach(item => {
    if (!result[item.Section]) {
      result[item.Section] = []
    }
    result[item.Section].push(item.Category)
  })
  return result
})

const projectsByCategoryBySection = computed(() => {
  const result = {}
  data.value.forEach(item => {
    if (!result[item.Section]) {
      result[item.Section] = {}
    }
    if (!result[item.Section][item.Category]) {
      result[item.Section][item.Category] = []
    }
    result[item.Section][item.Category].push(item)
  })
  return result
})

</script>

<template>
  <template v-for="(categories, section) in projectsByCategoryBySection">
    <div class="text-2xl  bg-yellow-200 mt-4 p-2">{{ section }}</div>
    <div class="">
      <template v-for="(projects, category) in categories">
        <GridView :projects="projects" :category="category" />
      </template>
    </div>
  </template>
</template>
