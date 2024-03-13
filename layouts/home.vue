<template>
  <div>
    <div class="absolute top-4 right-4">
      <ColorMode />
      <ManageAPIKey />
    </div>
    <div class="flex h-screen">
      <div class="m-auto w-full text-center">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>