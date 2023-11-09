<script setup lang="ts">
const props = defineProps(['item'])
const { item } = toRefs(props)
</script>

<template>
  <div
    class="w-[124px] h-[124px] overflow-hidden shadow-lg m-[2px] border-[1px] justify-center items-center border-[#000] rounded flex flex-col bg-[#fff] opacity-80 hover:opacity-100">
    <div v-if="item.thumbnail" class="bg-contain bg-center mt-[5px] w-[100px] h-[50px] bg-no-repeat"
      :style="`background-image: url(${item.thumbnail})`">
    </div>

    <div class="px-2 py-2 " v-if="!item.hideName">
      <div class="font-bold text-md text-center text-[#333]">{{ item.name }}</div>
    </div>
  </div>
</template>