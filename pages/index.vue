


<template>
  <div>
    <div>'{{ token }}'</div>

    <div class="text-center">
      <!-- <div class="w-lg inline-block p-8"> -->
      <div class="w-lg inline-block text-lg text-gray-600 dark:text-gray-300">
        <p class="font-body text-md m-6">Welcome to the XRPL Serious Game</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { inject } from 'vue'
import { useRouter } from 'vue-router'



const router = useRouter()
const loading = ref(true);
const token = inject<string>('token')
const CheckLogin = async () => {
  try{
  if (token?.valueOf()) {  // If no token, redirect to login
          router.push('/login');
        }
else  {
  router.push('/login');
  loading.value = true;
  const verifyResponse = await fetch('/api/users/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
console.log('verifyResponse est ce qui suit ', { verifyResponse } );
const decodedToken = await verifyResponse.json();
        console.log({ decodedToken });
router.push(`/${decodedToken.role}`);
}
  } catch (err) {
        console.error('Error during token verification:', err);
        alert('Please log in');
        router.push('/login');
      } finally {
        loading.value = false;
  }


}
onMounted(() => {
  CheckLogin();
});


</script>
