<template>
  <div>
    <div v-if="!pending" class="flex items-center justify-center h-32 flex-col">
      <div class="flex items-center justify-center">
        <i class="loader --6" />
      </div>
      <p class="text-white text-lg mt-4 transform translate-y-[-10rem]">Waiting for teacher to start the Serious Game...</p>
    </div>
    <div v-else>
      <div class="flex items-center justify-center h-32 flex-col">
        <p class="text-white text-lg">Classroom Name: {{ classroomName }}</p>
        <p class="text-white text-lg">Classic Address: {{ classicAddress }}</p>
        <p class="text-white text-lg">Seed: {{ seed }}</p>
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

const fetchToken = async () => {
  const response = await fetch('/api/users/verify', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to verify token');
  }

  return await response.json();
};
const decodedToken = await fetchToken();
const StudentMail = decodedToken.email

const startPolling = () => {
  while ( pending.value === true ) {
    return setInterval(fetchAccountInfo, 5000); // Poll every 5 seconds
  } 
};


const fetchAccountInfo = async () => {
  pending.value = true;
  accountInfoLoaded.value = false;
  try {
    const body = {
      email: StudentMail, // Assuming StudentMail is defined somewhere in your code
    };

    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch account info');
    }

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
