<script setup lang="ts">
import { computed } from 'vue'
const { data } = await useFetch('/api/projects')

const sections = computed(() => {
  const sortedSection = data.value.map(item => item.section).sort()
  return [...new Set(sortedSection)]
})

const categoriesBySection = computed(() => {
  const result = {}
  data.value.forEach(item => {
    if (!result[item.section]) {
      result[item.section] = []
    }
    result[item.section].push(item.category)
  })
  return result
})

const projectsByCategoryBySection = computed(() => {
  const result = {}
  data.value.forEach(item => {
    if (!result[item.section]) {
      result[item.section] = {}
    }
    if (!result[item.section][item.category]) {
      result[item.section][item.category] = []
    }
    result[item.section][item.category].push(item)
  })
  return result
})

</script>

<template>
  <template v-for="(categories, section) in projectsByCategoryBySection">
    <div class="text-2xl bg-yellow-200 mt-4 p-2 rounded-md mb-4">{{ section }}</div>
    <div class="text-gray-900">
      <template v-for="(projects, category) in categories">
        <GridView :projects="projects" :category="category" />
      </template>
    </div>
  </template>
</template>
