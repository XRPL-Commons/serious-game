<template>
  <body class="bg-ecru-white-50">
    <div class="font-body">
      <div
        class="text-black text-xl px-6 py-5 font-bold block w-full sticky top-0 z-20 border-t border-transparent lg:block backdrop-blur-md bg-white-100/75 shadow shadow-gray-200 text-gray-900 m-0">
        <div class="bg-spring-green-400 text-stratos-950 text-3xl rounded-full px-5 py-2 font-title">XRPL Ecosystem
          Mapping
        </div>
      </div>

      <div class="p-6 mt-0 ">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </div>
  </body>
</template>
<script setup>
useHead({
  bodyAttrs: {
    class: 'bg-ecru-white-50 min-h-[100vh]'
  }
})
</script>