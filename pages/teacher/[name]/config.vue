<template>
    <div class="w-full text-center">
      <div class="flex-none">
        <nav class="mb-4">
          <UButton color="blue" @click="goBack">Go back to Classroom</UButton>
        </nav>
      </div>
      <div class="flex-row transform translate-y-1">
        <h2 class="text-lg font-bold mb-2">Serious Game Configuration</h2>
        <UButton color="primary" variant="solid" @click="updateAccounts">Update Accounts</UButton>
        <div>
          <label for="numStages">Number of Stages:</label>
          <input type="number" v-model="numStages" id="numStages" />
          <UButton color="green" variant="solid" @click="updateMultipleStages">Update Multiple Stages</UButton>
        </div>
        <UButton color="red" variant="solid" @click="sendMemo">Send Memo</UButton>
        <UButton color="orange" variant="solid" @click="addOldestTransaction">Add Oldest Transaction</UButton>
        <UButton color="yellow" variant="solid" @click="resetGameStages">Reset Game Stages</UButton>
        <UButton color="blue" variant="solid" class="mt-4 p-4 text-lg" @click="bigSendMemo">Big Send Memo</UButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const toast = useToast();
  const numStages = ref<number>(3); // Default number of stages
  const router = useRouter();
  const classroomName = router.currentRoute.value.params.name;
  const goBack = () => {
    router.push(`/teacher/${classroomName}`);
  };
  
  const updateAccounts = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({ classroomName });
      const result = await fetch(`/api/jeu`, {
        method: 'PUT',
        headers,
        body,
      });
      if (!result.ok) {
        throw new Error('Failed to update accounts');
      }
      toast.add({
        title: 'Accounts Updated Successfully!',
        id: 'update-success',
      });
    } catch (error) {
      console.error('Error updating accounts:', error);
      toast.add({
        title: 'Error updating accounts',
        id: 'update-error',
        variant: 'error',
      });
    }
  };
  
  const updateMultipleStages = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({ classroomName, numStages: numStages.value });
      const result = await fetch('/api/jeu/update-multiple-stages', {
        method: 'PUT',
        headers,
        body,
      });
      if (!result.ok) {
        throw new Error('Failed to update multiple stages');
      }
      toast.add({
        title: 'Multiple Stages Updated Successfully!',
        id: 'update-stages-success',
      });
    } catch (error) {
      console.error('Error updating multiple stages:', error);
      toast.add({
        title: 'Error updating multiple stages',
        id: 'update-stages-error',
        variant: 'error',
      });
    }
  };
  
  const sendMemo = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({ classroomName });
      const result = await fetch('/api/jeu/send-memo', {
        method: 'POST',
        headers,
        body,
      });
      if (!result.ok) {
        throw new Error('Failed to send memo');
      }
      toast.add({
        title: 'Memo sent successfully!',
        id: 'send-memo-success',
      });
    } catch (error) {
      console.error('Error sending memo:', error);
      toast.add({
        title: 'Failed to send memo',
        id: 'send-memo-error',
        type: 'error',
      });
    }
  };
  
  const addOldestTransaction = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({ classroomName });
      const result = await fetch('/api/jeu/oldest-transaction', {
        method: 'PUT',
        headers,
        body,
      });
      if (!result.ok) {
        throw new Error('Failed to add oldest transactions');
      }
      toast.add({
        title: 'Oldest transactions added successfully!',
        id: 'oldest-tx-success',
      });
    } catch (error) {
      console.error('Error adding oldest transactions:', error);
      toast.add({
        title: 'Failed to add oldest transactions',
        id: 'oldest-tx-error',
        type: 'error',
      });
    }
  };
  
  const resetGameStages = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({ classroomName });
      const result = await fetch('/api/jeu/reset-game-stages', {
        method: 'PUT',
        headers,
        body,
      });
      if (!result.ok) {
        throw new Error('Failed to reset game stages');
      }
      toast.add({
        title: 'Game stages reset successfully!',
        id: 'reset-stages-success',
      });
    } catch (error) {
      console.error('Error resetting game stages:', error);
      toast.add({
        title: 'Failed to reset game stages',
        id: 'reset-stages-error',
        type: 'error',
      });
    }
  };
  
  const bigSendMemo = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({ classroomName });
      const result = await fetch('/api/jeu/big-send-memo', {
        method: 'POST',
        headers,
        body,
      });
      if (!result.ok) {
        throw new Error('Failed to send big memo');
      }
      toast.add({
        title: 'Big memo sent successfully!',
        id: 'big-send-memo-success',
      });
    } catch (error) {
      console.error('Error sending big memo:', error);
      toast.add({
        title: 'Failed to send big memo',
        id: 'big-send-memo-error',
        type: 'error',
      });
    }
  };
  
  </script>
  