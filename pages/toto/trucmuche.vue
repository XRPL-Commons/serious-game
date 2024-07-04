<template>

    <div>
        Toto
        <UBadge>Badge</UBadge>
         <UButton @click="onParis">Button</UButton>
         

        <br/>
        <img :src="monUrl" class="border-2 border-black">
        <div v-for="item in artList" class="titi">{{ item.uri }}
            <img :src="item.uri" />
        </div>
        <pre>{{ artList }}</pre>
    </div>

  </template>

  
  <script setup lang="ts">
  /* @ts-ignore */
  import { formatDate } from '~/utils/dateHelper';
  import { ref, onMounted, inject, watch } from "vue"
  /* @ts-ignore */
  import API from '~/server/client'
  import { useRouter } from 'vue-router'
  
  const artList = ref([])
  const monUrl = 'https://cdn.prod.website-files.com/640f20bd091411ea6a488ea6/641b0f7da96819dcfd90c3ac_Layer_1.svg'
  

  const onParis = async () => {
    const res = await fetch('/api/art?network=TESTNET', {
        method: "GET"
      });
      artList.value = await res.json()
  }
  </script>
  
  <style>

  
  </style>