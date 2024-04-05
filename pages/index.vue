<template>
  <div class="w-full">

    <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center">
      <img src="/xrpl.png" class="h-10 opacity-80 hidden dark:block" />
      <img src="/xrplb.png" class="h-10 opacity-80 dark:invisible dark:hidden" />
      <div class=" ml-2 md:text-4xl text-xl font-title text-black dark:text-white">Community Quest
      </div>
    </div>
    <br />
    <div class="text-center mb-12">
      <!-- <div class="w-lg inline-block p-8"> -->
      <div class="w-lg inline-block text-lg text-gray-600 dark:text-gray-300">
        <p class="font-title text-md m-6">Welcome to the XRPL Commons Community Quest.</p>
        <UInput color="primary" variant="outline" v-model="secret" placeholder="Enter the secret code..." type="text"
          class="flex justify-center items-center bg-gray-500/10 mx-4 font-title" size="xl"
          :class="{ 'input-error': isSecretIncorrect }" @keyup.enter="submit"
          :ui="{ base: 'text-center', placeholder: 'placeholder- gray - 500 dark: placeholder - gray - 400' }" />
        <br />
        <UButton label="Submit Answer" @click="submit" size="lg" :disabled="checking" class="font-title" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import API from '~/server/client'

const router = useRouter()
const secret = ref('')
const checking = ref(false)
const isSecretIncorrect = ref(false)
let timeout: any


const magSecret = ref<string | null>(null)
magSecret.value = localStorage.getItem('mag_secret')

if (magSecret.value) {
  router.push('/albers')
}

definePageMeta({
  layout: 'home'
})

const submit = async () => {
  if (checking.value === true) {
    return
  }
  checking.value = true

  try {
    const check = await API.checkSecret({ secret: secret.value.toLowerCase() })

    if (check === true) {
      console.log('success!')
      localStorage.setItem('mag_secret', secret.value)
      router.push('/albers')
    } else {
      console.error(`Wrong secret! Try again.`)
      isSecretIncorrect.value = true
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isSecretIncorrect.value = false;
      }, 820);
    }

  } catch (e) {
    console.error(e)
  } finally {
    checking.value = false
  }
}

onMounted(() => {
  // if (magSecret.value) {
  //   router.push('/albers')
  // }
})
</script>

<style>
/* Shake keyframe animation */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

/* Class that applies the shake animation and red border */
.input-error {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
}
</style>