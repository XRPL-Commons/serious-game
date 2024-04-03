<template>
  <div
    class="blur-3xl -z-10 absolute w-full top-0 right-0 bottom-0 left-0 overflow-hidden grid grid-flow-row-dense grid-cols-3 grid-rows-3">
    <template v-for="shape in shapes">
      <div class="inline-block  animatedDiv">
        <component :is="shape" />
      </div>
      <br />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ShapesOrange, ShapesYellow, ShapesBlue, ShapesGreen, ShapesPink } from '#components'

/* @ts-ignore */
const shapes = [ShapesOrange, ShapesYellow, ShapesBlue, ShapesGreen, ShapesPink].map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x)
</script>

<style>
@keyframes growAndMove {

  0%,
  100% {
    /* Start and end in the center, including rotation back to 0 degrees */
    transform: translate(150px, 150px) scale(1) rotate(0deg);
  }

  50% {
    /* Move, grow, and rotate at the midpoint */
    transform: translate(300px, 300px) scale(2) rotate(360deg);
  }
}

.animatedDiv {
  position: relative;
  /* Needed for centering, adjust as per your layout */
  animation: growAndMove 200s infinite alternate;
}
</style>