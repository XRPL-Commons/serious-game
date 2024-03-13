<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', header: { padding: 'py-0 px-0 ' } }">
      <template #header>
        <div class="flex justify-between">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" :trailing="false" placeholder="Search..." :ui="{
            rounded: 'rounded-full', base: 'inline-block bg-white dark:text-white', color: {
              white: {
                outline: 'shadow-sm bg-white dark:bg-gray-100 text-primary-50 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
              }
            },
            icon: { trailing: { pointer: '' }, base: 'text-primary-900 dark:text-primary-100' }
          }" variant="none" v-model="searchQuery" @keyup.enter="handleSearchSubmit" @keyup="handleSearchKeyUp"
            class="w-full" color="white">
            <template #trailing>
              <UButton v-show="searchQuery !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                :padded="false" @click="searchQuery = ''; handleSearchKeyUp();" />
            </template>
          </UInput>

        </div>
      </template>

      <div class="h-64">
        <div v-for="record in searchRecords">
          <NuxtLink :to="`/projects/${record.slug}`"
            class="hover:text-black hover:dark:text-white text-primary-300 dark:text-primary-700">{{
              record.name }}
          </NuxtLink>

        </div>
        <div v-if="searchRecords && searchRecords.length === 0">
          No Records...
        </div>
      </div>

      <template #footer>
        <UButton color="black" size="xs"
          :ui="{ rounded: 'rounded-md', color: { black: { solid: 'dark:bg-primary-800 dark:hover:bg-slate-600 dark:text-white dark:border-1' } } }"
          @click="handleSearchSubmit">
          XRPL
          Search</UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { sections } from '@/models'
import type { ProjectRecord } from '@/types'

const records = inject('records', [])
const tags = inject('tags', [])
const { isOpen, handleSearchSubmit, handleSearchKeyUp, searchQuery } = inject('globalSearchModal', {
  isOpen: ref(false),
  handleSearchSubmit: () => { },
  handleSearchKeyUp: () => { },
  searchQuery: ref('')
})

const searchRecords = computed<ProjectRecord[]>(() => {
  return records.filter((record: ProjectRecord) => {
    const query = searchQuery.value.toLowerCase();
    return record.name.toLowerCase().includes(query) || (record.tags || []).some(tag => tag.toLowerCase().includes(query));
  }).slice(0, 10)
})

definePageMeta({
  layout: 'home'
})

</script>