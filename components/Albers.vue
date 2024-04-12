<template>
  <div v-if="!magSecret">This view requires the mag secret.</div>
  <template v-else>
    <div>
      <ClientOnly>

        <canvas ref="canvas" class="w-full scale-75 hidden"></canvas>
        <template v-if="albersURI">
          <figure class="max-w-lg">
            <img class="h-auto max-w-full rounded-lg" :src="albersURI" alt="image description">
          </figure>
        </template>
        <template v-else>
          <USkeleton class="h-full w-full" :ui="{ rounded: 'rounded-lg' }" />
        </template>
      </ClientOnly>

    </div>
  </template>

</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import API from '~/server/client'
import { sketch } from '~/sketches/xalbers'
import p5 from "p5"
import { useRoute } from 'vue-router'

const updateColors = inject('updateColors', () => { })

// define xrplAddress 
const props = defineProps({
  xrplAddress: String
})

const { query } = useRoute()
const forceSave = query?.force === 'save'

const emit = defineEmits(['loaded']);

const { xrplAddress } = props
console.log('albers component', { xrplAddress })

// authentication
const magSecret = inject('magSecret')

const canvas = ref(null)

let myp5: any = null

const albersURI = ref(null)

onMounted(() => {
  nextTick(async () => {

    myp5 = new p5(sketch({
      xrplAddress,
      colorCallback: (sketchColors: any) => {
        updateColors(sketchColors)
      },
      onLoaded: ({ imageData }) => {
        onSketchLoaded({ myp5, imageData })
      }
    }), canvas.value)

    console.log(canvas.value)

  })
})

const onSketchLoaded = async ({ myp5, imageData }: { myp5: any, imageData: string }) => {
  // let imageData = myp5.canvas.toDataURL() // Defaults to PNG format
  console.log({ myp5, imageData })
  // check if the url exists
  const imageExists = await API.albersURLExists({ xrplAddress })
  console.log({ imageExists })
  if ((imageExists === true) && !forceSave) {
    console.log(`Image for ${xrplAddress} existed`)
    albersURI.value = `https://albers.fra1.cdn.digitaloceanspaces.com/alberx-${xrplAddress}.webp`
  } else {
    // if it doesn't then run through the creation flow
    const { url } = await API.createAlbersURL({
      xrplAddress,
      imageData
    })
    albersURI.value = url
    console.log({ url })
  }
  console.log('should emit', { url: albersURI.value })
  emit('loaded', { url: albersURI.value })
}
onUnmounted(() => {
  if (myp5) {
    myp5.remove()
  }
});

</script>
<style>
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