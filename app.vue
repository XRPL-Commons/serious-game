<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UModals />
</template>

<script setup lang="ts">
import { ref, provide, readonly } from 'vue'

const shuffle = (list) => {
  return list
    .map(x => [Math.random(), x])
    .sort(([a], [b]) => a - b)
    .map(([_, x]) => x)
}

const colors = ref([
  "rgb(255, 26, 139)",
  "rgb(25, 255, 131)",
  "rgb(255, 103, 26)",
  "rgb(26, 164, 255)",
  "rgb(250, 255, 26)"
])

const updateColors = (newColors) => {
  if (newColors.length >= 5) {
    colors.value = shuffle(newColors).slice(0, 5);
  } else {
    let filledArray = [];
    while (filledArray.length < 5) {
      filledArray = filledArray.concat(newColors);
    }
    colors.value = filledArray.slice(0, 5);
  }
}

provide('defaultColors', colors)
provide('updateColors', updateColors)
</script>