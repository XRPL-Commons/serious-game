<template>
  <div>
    <div class="absolute top-4 right-4 z-10">
      <ColorMode />
    </div>
    <div class="flex h-screen">
      <div class="m-auto w-full text-center">
        <div
          class="blur-3xl -z-10 absolute w-full top-0 right-0 bottom-0 left-0 overflow-hidden grid grid-flow-row-dense grid-cols-3 grid-rows-3">
          <template v-for="shape in shapes">
            <div class="inline-block">
              <component :is="shape" />
            </div>
            <br />
          </template>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShapesOrange, ShapesYellow, ShapesBlue, ShapesGreen, ShapesPink } from '#components'

/* @ts-ignore */
const shapes = [ShapesOrange, ShapesYellow, ShapesBlue, ShapesGreen, ShapesPink].map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x)
</script>