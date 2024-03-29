<template>
  <div
    class="text-xl px-4 py-1  w-full fixed top-0 left-0 z-20 border-transparent lg:block backdrop-blur-md bg-transparent dark:bg-transparent  text-gray-900 m-0 flex">
    <div class="flex justify-between items-center content-center">
      <div class="flex justify-start items-center">
        <NuxtLink to="/"
          class=" text-stratos-950 text-xl sm:text-3xl rounded-full px-0 py-1 font-title inline-flex items-center">
          <div class="hover:scale-110 p-2 transition-all cursor-pointer flex justify-start items-center flex-auto ">
            <img src="/xrpl.png" class="h-8 opacity-80 hidden dark:block" />
            <img src="/xrplb.png" class="h-8 opacity-80 dark:invisible dark:hidden" />

          </div>
          <div class="ml-2 md:text-4xl text-xl font-title text-black dark:text-white">Community Quest</div>
        </NuxtLink>
      </div>

      <div class="pl-1 flex">
        <ColorMode />
      </div>
    </div>
  </div>
  <div
    class="blur-3xl -z-10 absolute w-full top-0 right-0 bottom-0 left-0 overflow-hidden grid grid-flow-row-dense grid-cols-3 grid-rows-3">
    <template v-for="shape in shapes">
      <div class="inline-block">
        <component :is="shape" />
      </div>
      <br />
    </template>
  </div>

  <div class="pt-20 pr-4 pl-4 sm:pr-4 sm:pl-4 relative">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ShapesOrange, ShapesYellow, ShapesBlue, ShapesGreen, ShapesPink } from '#components'

const shapes = [ShapesOrange, ShapesYellow, ShapesBlue, ShapesGreen, ShapesPink]
  .map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x)

</script>
