<template>
  <div>
    <div v-if=" accountInfoLoaded === false" class="flex items-center justify-center h-32 flex-col">
      <div class="flex items-center justify-center">
        <i class="loader --6" />
      </div>
      <p class="text-red text-lg mt-4 transform translate-y-[-10rem]">Waiting for teacher to start the Serious Game...</p>
    </div>
    <div v-else>
      <h1 class="text-center text-blue text-3xl">You can now start the game good luck</h1>
      <div class="flex items-center justify-center h-32 flex-col">
        <p class="text-blue text-lg">Classroom Name: {{ classroomName }}</p>
        <p class="text-blue text-lg">Classic Address: {{ classicAddress }}</p>
        <p class="text-blue text-lg">Seed: {{ seed }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'student',
});


const pending = ref(true);
const accountInfoLoaded = ref(false);
var classroomName = ref('');
var classicAddress = ref('');
var seed = ref('');


const startPolling = () => {
  while ( accountInfoLoaded.value === false ) {
    return setInterval(fetchAccountInfo, 2000); 
  } 
};

const fetchAccountInfo = async () => {
  pending.value = true;
  try {
    const headers = {
      'content-type': 'application/json'
    }
    const response = await fetch('/api/users', {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (data === null) {
        return;    
      }

    classroomName = data.classroomName;
    seed = data.seed;
    classicAddress = data.classicAddress;

    pending.value = false;
    accountInfoLoaded.value = true;
  } catch (error) {
    console.error('Error fetching account info:', error);
    pending.value = false;
    accountInfoLoaded.value = false;
    throw error;
  }
};

// Simulate loading account information
onMounted(() => {
  startPolling(); 
});

</script>

<style scoped>
/* Loader animation styles */
.loader {
  --color: rgb(var(--color-primary-400));
  --size-square: 3vmin;
  display: block;
  position: relative;
  width: 50%;
  display: grid;
  place-items: center;
}

.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  width: var(--size-square);
  height: var(--size-square);
  background-color: var(--color);
  top: calc(50% - var(--size-square) / 2);
  left: calc(50% - var(--size-square) / 2);
  animation: loader-6 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes loader-6 {
  0%, 100% {
    transform: none;
  }
  25% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(100%) translateY(100%);
  }
  75% {
    transform: translateY(100%);
  }
}
</style>
