<script setup lang="ts">
const props = defineProps(['item'])
const { item } = toRefs(props)
const apiKey = ref<string | null>('')
apiKey.value = localStorage.getItem('xrpl_map_api_key')

const disconnect = () => {
  localStorage.removeItem('xrpl_map_api_key')
  apiKey.value = localStorage.getItem('xrpl_map_api_key')
}
</script>

<template>
  <div class="">
    <div v-if="apiKey" class="cursor-pointer text-emerald-800 hover:text-emerald-500 transition-all" @click="disconnect">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>

    </div>
  </div>
</template>