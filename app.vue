
<template>
  <NuxtLayout>
    <NuxtPage />
    <SearchModal />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import type { ProjectRecord } from '@/types'

// app globals
useHead({
  htmlAttrs: {
    class: 'dark:bg-black min-h-[100vh]'
  },
  bodyAttrs: {
    class: 'font-body bg-white dark:bg-black  min-h-[100vh]'
  }
})

// fetch records and compute existing tags
const fetchResult = await useFetch<Array<ProjectRecord>>('/api/projects')
const records: ProjectRecord[] = fetchResult.data.value ?? []
const existingTags = ref<Array<string>>(Array.from(new Set(records.flatMap(i => i.tags ?? []).filter(tag => tag !== ''))).sort())

// facilitate search modal
const isOpen = ref(false)
const searchQuery = ref('')
const handleSearchSubmit = async () => {
  console.log('handleSearch')
  await navigateTo(`/projects?search=${searchQuery.value}`)
  isOpen.value = false
  // searchQuery.value = ''
}

const handleSearchKeyUp = async () => {
  if (searchQuery.value === '') {
    isOpen.value = false
  } else {
    isOpen.value = true
  }
}
// provide these variables to app components
provide('records', records)
provide('tags', readonly(existingTags))
provide('globalSearchModal', { isOpen, searchQuery, handleSearchSubmit, handleSearchKeyUp })
</script>