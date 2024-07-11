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


<!-- app.vue

<template>
  <NuxtLayout>
    <NuxtPage />
    <footer class="footer">
      <p>© 2024 Votre Nom / Entreprise. Tous droits réservés.</p>
    </footer>
  </NuxtLayout>
  <UModals />

</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
const token = ref(null)

provide('token', token)</script>

<style scoped>
.footer {
  background-color: #000000;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style> -->
