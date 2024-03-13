<script setup lang="ts">
const props = defineProps(['item'])
const { item } = toRefs(props)
const apiKey = ref<string | null>('')
const isOpen = ref(false)
const route = useRoute()


apiKey.value = localStorage.getItem('xrpl_map_api_key')

const disconnect = (confirmed = false) => {
  if (confirmed === false) {
    return
  }
  localStorage.removeItem('xrpl_map_api_key')
  apiKey.value = localStorage.getItem('xrpl_map_api_key')
}

const profileMenu = [
  [{
    label: 'Project List',
    icon: 'i-heroicons-queue-list',
    to: '/admin'
  }], [{
    label: 'Disconnect',
    icon: 'i-heroicons-power',
    click: disconnect
  }]
]
</script>

<template>
  <div class="">
    <div v-if="apiKey" class="cursor-pointer text-emerald-800 hover:bg-white transition-all p-1 rounded-full"
      @click="isOpen = true">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>

    </div>
  </div>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="font-bold text-md text-white">Profile</div>
      </template>
      <UVerticalNavigation :links="profileMenu" />
    </UCard>
  </UModal>
</template>