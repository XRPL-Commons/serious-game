<template>
  <div v-if="!magSecret">This page requires the mag secret.</div>
  <template v-else>
    <div>
      <div ref="canvas" class="w-full scale-75"></div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute } from 'vue-router'
import { sketch } from '~/sketches/xalbers'
import p5 from "p5"

definePageMeta({
  layout: 'fullscreen'
})

const { params } = useRoute();
const xrplAddress = computed(() => params.xrplAddress || 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh')
const colors = ref()

// authentication
const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')

const canvas = ref(null)

const sketchContainer = ref(null);
let myp5: any = null;

onMounted(() => {
  myp5 = new p5(sketch({
    xrplAddress: xrplAddress.value,
    colorCallback: (sketchColors: any) => {
      colors.value = sketchColors
      console.log(sketchColors)
    }
  }), canvas.value);
});

onUnmounted(() => {
  if (myp5) {
    myp5.remove()
  }
});
</script>
<style>
body {
  margin: 0;
  /* Removes the default margin */
  padding: 0;
  /* Removes the default padding */
  height: 100vh;
  /* Sets the height to 100% of the viewport height */
  overflow: hidden;
  /* Hides any content that overflows the element's box */
  display: flex;
  /* Enables Flexbox layout */
  justify-content: center;
  /* Centers content horizontally within the container */
  align-items: center;
  /* Centers content vertically within the container */
}

canvas {
  display: block;
  /* Changes the default display to block, which removes extra space beneath the canvas typical of inline elements */
  max-width: 100%;
  /* Sets the maximum width to 100% of the parent element, preventing the canvas from exceeding the width of the viewport */
  max-height: 100vh;
  /* Sets the maximum height to 100% of the viewport height, preventing the canvas from exceeding the height of the viewport */
  width: auto;
  /* Allows the width of the canvas to be automatically adjusted while maintaining the aspect ratio */
  height: auto;
  /* Allows the height of the canvas to be automatically adjusted while maintaining the aspect ratio */
  object-fit: contain;
  /* Ensures that the canvas content is scaled correctly to fit within its box while preserving aspect ratio. The entire canvas is visible, but it may be letterboxed if its aspect ratio differs from its container. */
}
</style>