<template>
  <div>

     <!-- Display loading message if teacher has not started the game -->
    <div v-if=" accountInfoLoaded === false" class="flex items-center justify-center h-32 flex-col">
      <div class="flex items-center justify-center">

        <!-- Loader icon -->
        <i class="loader --6" />
      </div>
      <p class="text-red text-lg mt-4 transform translate-y-[-10rem]">Waiting for teacher to start the Serious Game...</p>
    </div>

    <!-- Display classroom details if account info is loaded -->
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
import { callApi } from '~/constants';


// Use the 'student' layout for this page
definePageMeta({
  layout: 'student',
});

// Tracks if the data is being fetched
const pending = ref(true);

// Tracks if the account info has been loaded
const accountInfoLoaded = ref(false);

// Store the data 
var classroomName = ref('');
var classicAddress = ref('');
var seed = ref('');

// Polling function to fetch account info every 2 seconds
const startPolling = () => {
  while ( accountInfoLoaded.value === false ) {
    return setInterval(fetchAccountInfo, 2000); 
  } 
};

// Function to fetch account information from the server 
const fetchAccountInfo = async () => {
  pending.value = true;
  try {
    // Utilisation de callApi pour appeler l'API
    const data = await callApi('getUsers');

    // If no data returned, stop
    if (data === null) {
        return;    
      }

    // Update the reactive variables with the fetched data
    classroomName = data.classroomName;
    seed = data.seed;
    classicAddress = data.classicAddress;

    // Data fetching is done
    pending.value = false;
    accountInfoLoaded.value = true;
  } catch (error) {
    console.error('Error fetching account info:', error);
    pending.value = false;
    accountInfoLoaded.value = false;
    throw error;
  }
};

// Fetch account info when the component is mounted
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
