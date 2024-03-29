<template>
  <div class="w-full">

    <div class="rounded-full bg-transparent p-2 transition-all flex justify-center items-center mt-20">
      <img src="/xrpl.png" class="h-10 opacity-80 hidden dark:block" />
      <img src="/xrplb.png" class="h-10 opacity-80 dark:invisible dark:hidden" />
      <div class=" ml-2 md:text-4xl text-xl font-title text-black dark:text-white">Community Quest
      </div>
    </div>
    <br />
    <div class="text-center">
      <div class="w-lg inline-block p-8">
        Hey there early bird, you're in the right place !
        <br />
        Check back on this page <strong>soon</strong> to earn your
        reward.
        <!-- <UInput color="primary" variant="outline" v-model="secret" placeholder="Enter the secret word..." type=""
          class="text-center" size="lg" />
        <br />
        <UButton label="Submit Answer" @click="submit" size="lg" :loading="checking" /> -->
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

definePageMeta({
  layout: 'home'
})

const submit = async () => {
  if (checking.value === true) {
    return
  }
  checking.value = true

  try {
    const check = await API.checkSecret({ secret: secret.value })
    console.log({ check })

    if (check === true) {
      console.log('success!')
      localStorage.setItem('mag_secret', secret.value)
      router.push('/albers')
    } else {
      console.error(`Wrong secret! Try again.`)
    }

  } catch (e) {
    console.error(e)
  } finally {
    checking.value = false
  }

}
</script>
