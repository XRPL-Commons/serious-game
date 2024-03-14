<template>
  <div class="w-full">
    <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center mt-20">
      <img src="/xrpl.png" class="h-10 opacity-80 hidden dark:block" />
      <img src="/xrplb.png" class="h-10 opacity-80 dark:invisible dark:hidden" />
      <div class=" ml-2 md:text-4xl text-xl font-title text-black dark:text-white">Community Quest
      </div>
    </div>
    <br />
    <div class="text-center relative">


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

</script>
