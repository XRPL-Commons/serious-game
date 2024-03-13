<template>
  <div
    class="text-xl px-4 py-1  w-full fixed top-0 z-20 border-transparent lg:block backdrop-blur-md bg-transparent dark:bg-transparent  text-gray-900 m-0 flex">
    <div class="flex justify-between items-center content-center">
      <div class="flex justify-start items-center">
        <NuxtLink to="/" class=" text-stratos-950 text-xl sm:text-3xl rounded-full px-0 py-1 font-title inline-block">
          <div class="hover:scale-110 p-2 transition-all cursor-pointer flex justify-start items-center flex-auto ">
            <img src="/xrpl.png" class="h-8 opacity-80 hidden dark:block" />
            <img src="/xrplb.png" class="h-8 opacity-80 dark:invisible dark:hidden" />
            <!-- <div class="ml-2 flex-auto">Ecosystem Map</div> -->
          </div>
        </NuxtLink>
      </div>
      <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" placeholder="XRPL Search..." :ui="{
        icon: {
          trailing: { pointer: '' }
        },
        rounded: 'rounded-full', base: 'w-full bg-gray-800/15', color: {
          white: {
            outline: 'bg-gray-500/10 dark:bg-gray-500/10 text-black dark:text-white ring-0 shadow-none focus:ring-0 focus:ring-primary-500 dark:focus:ring-primary-400',
          }
        }
      }
        " v-model="searchQuery" @keyup.enter="handleSearchSubmit" @keyup="handleSearchKeyUp" expanded>
        <template #trailing>
          <UButton v-show="searchQuery !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
            :padded="false" @click="searchQuery = ''; handleSearchKeyUp();" />
        </template>
      </UInput>
      <div class="pl-1 flex">
        <ColorMode />
        <ManageAPIKey />
      </div>
    </div>
  </div>

  <div class="pt-20 pr-4 pl-4 sm:pr-4 sm:pl-4 relative">
    <slot />
  </div>

  <div class="text-center p-4 bg-black/15 dark:bg-white/15 mt-4">
    <NuxtLink class="text-gray-900 dark:text-gray-100" to=" /contribute">Contribute</NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { isOpen, searchQuery, handleSearchKeyUp, handleSearchSubmit } = inject('globalSearchModal', {
  isOpen: ref(false),
  handleSearchKeyUp: () => { },
  handleSearchSubmit: () => { },
  searchQuery: ref(''),
})
</script>
