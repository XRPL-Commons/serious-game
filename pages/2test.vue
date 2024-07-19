<template>
    <div>
      <h1>Ripple Account Transactions</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else-if="accounts">
        <div>
          <h2>Personal Account</h2>
          <p>Classic Address: {{ accounts.account.classicAddress }}</p>
          <p>Seed: {{ accounts.account.seed }}</p>
        </div>
        <div>
          <h2>Solution Account</h2>
          <p>Classic Address: {{ accounts.solution_account.classicAddress }}</p>
          <p>Seed: {{ accounts.solution_account.seed }}</p>
        </div>
        <UButton color="primary" @click="sendTransaction">Send Transaction</UButton>
        <UButton color="red" @click="fetchOldestTransaction">Fetch Oldest Transaction</UButton>
        <div v-if="transactionResult">
          <h2>Transaction Result</h2>
          <p>Transaction Hash: {{ transactionResult.result.hash }}</p>
          <p>Transaction Status: {{ transactionResult.result.meta.TransactionResult }}</p>
        </div>
        <div v-if="oldestTransaction">
          <h2>Oldest Transaction</h2>
          <p>Date: {{ formatDate(oldestTransaction.tx.date) }}</p>
          <p>Amount (drops): {{ oldestTransaction.tx.Amount }}</p>
          <p>From Address: {{ oldestTransaction.tx.Account }}</p>
          <p>To Address: {{ oldestTransaction.tx.Destination }}</p>
          <p>Transaction Hash: {{ oldestTransaction.tx.hash }}</p>
        </div>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
  </template>
  
  <script setup>

  import { ref, onMounted } from 'vue';
  
  const accounts = ref(null);
  const error = ref(null);
  const transactionResult = ref(null);
  const oldestTransaction = ref(null);
  const loading = ref(false);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/jeu');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      accounts.value = await response.json();
    } catch (err) {
      error.value = err.message;
    }
  };
  
  const sendTransaction = async () => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const body = JSON.stringify({ account: accounts.value.account, solution_account: accounts.value.solution_account });
      const response = await fetch('/api/test/', {
        method: 'POST',
        headers,
        body
      });
      if (!response.ok) throw new Error('Failed to send transaction');
      transactionResult.value = await response.json();
    } catch (err) {
      error.value = err.message;
    }
  };
  
  const fetchOldestTransaction = async () => {
    try {
      loading.value = true;
      const response = await fetch(`/api/test/transactions/${accounts.value.solution_account.classicAddress}?personal_account=${accounts.value.account.classicAddress}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      oldestTransaction.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  const formatDate = (ledgerTime) => {
    const epoch = 946684800;
    const unixTime = epoch + ledgerTime;
    const date = new Date(unixTime * 1000);
    return date.toUTCString();
  };
  
  onMounted(() => {
    fetchAccounts();
  });
  
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  