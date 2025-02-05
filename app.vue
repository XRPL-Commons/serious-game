<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UModals />
</template>

<script setup lang="ts">
import type { UserInfo } from 'os';
import { provide, ref } from 'vue'

interface userInfoModel  {
  name: string,
  email: string,
  role: string
  }

  const userInfo = ref<userInfoModel | null>(null)
  try {
    const localUserInfo = localStorage.getItem('userInfo')
  if (localUserInfo) {
    const LocalParse = JSON.parse(localUserInfo) as userInfoModel
    if (LocalParse) {
      userInfo.value = LocalParse
    }
  }
  }
  catch (error) {
    console.error('Error fetching user info:', error);
  } 

const setUserInfo = ({name, email, role} : userInfoModel ) => {
  userInfo.value = {name, email, role}
  localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
}

provide('userInfo', userInfo)
provide ( 'setUserInfo', setUserInfo)
</script> 