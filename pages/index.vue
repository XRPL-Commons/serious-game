<template>
  <div class="w-full">
    <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center mt-20">
      <img src="/xrpl.png" class="h-10 opacity-80 hidden dark:block" />
      <img src="/xrplb.png" class="h-10 opacity-80 dark:invisible dark:hidden" />
      <div class=" ml-2 md:text-4xl text-xl font-title text-black dark:text-white">Ecosystem Map
      </div>
    </div>
    <br />
    <div class="text-center relative">

      <div class="sm:w-2/3 md:w-1/3 w-full inline-block px-2">
        <UButtonGroup size="xl" orientation="horizontal" :ui="{
          rounded: 'rounded-full'
        }">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" :trailing="false" placeholder="XRPL Search..."
            :ui="{
              rounded: 'rounded-full', base: 'inline-block bg-white', color: {
                white: {
                  outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
                }
              }
            }" v-model="searchQuery" @keyup.enter="handleSearchSubmit" @keyup="handleSearchKeyUp" />

        </UButtonGroup>
        <br />
        <br />

      </div>
      <br />
      <ul class="inline-block p-4 sm:w-1/2 w-full">
        <li v-for="section in sections">
          <div class="font-bold text-gray-900 dark:text-gray-100">{{ section.name }}</div>
          <span v-for="(category, index) in section.categories" class="text-sm text-white">
            <NuxtLink
              :to="`/projects?sections=${encodeURIComponent(section.name)}&categories=${encodeURIComponent(category)}`"
              class="text-blue-500">{{
                category
              }}</NuxtLink>
            &nbsp;
            <span v-if="index !== section.categories.length - 1">&nbsp;-&nbsp;&nbsp;&nbsp;</span>

          </span>

          <br /><br />
        </li>
      </ul>

      <br />

      <div class="inline-block p-4 sm:w-1/2 w-full">
        <div class="font-bold text-gray-900 dark:text-gray-100">Themes</div>
        <span v-for="(tag, index) in tags" class="text-sm text-white">
          <NuxtLink :to="`/projects?tags=${encodeURIComponent(tag)}`" class="text-blue-500">{{ tag }}</NuxtLink>
          &nbsp;
          <span v-if="index !== tags.length - 1">&nbsp;-&nbsp;&nbsp;&nbsp;</span>
        </span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { sections } from '@/models'
import type { ProjectRecord } from '@/types';

definePageMeta({
  layout: 'home'
})

const records = inject('records', [])
const tags = inject('tags', [])
const { isOpen, searchQuery, handleSearchKeyUp, handleSearchSubmit } = inject('globalSearchModal', {
  isOpen: ref(false),
  handleSearchKeyUp: () => { },
  handleSearchSubmit: () => { },
  searchQuery: ref(''),
})



</script>
