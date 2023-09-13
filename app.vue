<template>
  <div class="">
    <div
      class="text-black text-xl px-6 py-5 font-bold block z-10 w-full top-0 sticky top-0 z-20 border-t border-transparent lg:block backdrop-blur-md bg-white-100/75 shadow shadow-gray-200 text-gray-900 m-0">
      XRPL Ecosystem map
    </div>

    <div class="p-6 mt-0 ">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
<script setup>
useHead({
  bodyAttrs: {
    class: 'bg-gray-50'
  }
})
</script>