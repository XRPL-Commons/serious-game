<template>
  <html class="bg-ecru-white-50">

  <body class=" font-body">
      <div
        class="text-xl px-4 py-2 font-bold block w-full fixed top-0 z-20  border-transparent lg:block backdrop-blur-md bg-white-100/75  text-gray-900 m-0">
        <div class="bg-spring-green-400 text-stratos-950 text-3xl rounded-full px-5 py-2 font-title inline-block">XRPL Ecosystem Map</div>
      </div>

      <div class="mt-16 pr-4 pl-4 relative">
        <NuxtLayout>
          <NuxtPage :search="search"/>
        </NuxtLayout>
      </div>

      <!-- <div class="text-center p-4">
        <NuxtLink to="/contribute">Contribute</NuxtLink>
      </div> -->
  </body>

  </html>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const search= ref('')
useHead({
  bodyAttrs: {
    class: 'bg-ecru-white-50 min-h-[100vh]',
    style: '{ background-color: #bbff00; }'
  }
})
</script>