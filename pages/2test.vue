<template>
  <div>
    <!-- Page Header -->
    <h1>Ripple Account Transactions</h1>

    <!-- Error Handling -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Display Account Information -->
    <div v-else-if="accounts">
      <!-- Personal Account Details -->
      <div>
        <h2>Personal Account</h2>
        <p>Classic Address: {{ accounts.account.classicAddress }}</p>
        <p>Seed: {{ accounts.account.seed }}</p>
      </div>

      <!-- Solution Account Details -->
      <div>
        <h2>Solution Account</h2>
        <p>Classic Address: {{ accounts.solution_account.classicAddress }}</p>
        <p>Seed: {{ accounts.solution_account.seed }}</p>
      </div>

      <!-- Action Buttons -->
      <UButton color="primary" @click="sendTransaction">Send Transaction</UButton>
      <UButton color="red" @click="fetchOldestTransaction">Fetch Oldest Transaction</UButton>

      <!-- Display Transaction Result -->
      <div v-if="transactionResult">
        <h2>Transaction Result</h2>
        <p>Transaction Hash: {{ transactionResult.result.hash }}</p>
        <p>Transaction Status: {{ transactionResult.result.meta.TransactionResult }}</p>
      </div>

      <!-- Display Oldest Transaction -->
      <div v-if="oldestTransaction">
        <h2>Oldest Transaction</h2>
        <p>Date: {{ formatDate(oldestTransaction.tx.date) }}</p>
        <p>Amount (drops): {{ oldestTransaction.tx.Amount }}</p>
        <p>From Address: {{ oldestTransaction.tx.Account }}</p>
        <p>To Address: {{ oldestTransaction.tx.Destination }}</p>
        <p>Transaction Hash: {{ oldestTransaction.tx.hash }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else>
      Loading...
    </div>
  </div>
</template>
  
  <script setup>

  import { ref, onMounted } from 'vue';
  
  // Reactive state variables
  const accounts = ref(null); // Stores account details (personal & solution accounts)
  const error = ref(null);
  const transactionResult = ref(null); // Stores the result of the latest transaction
  const oldestTransaction = ref(null);
  const loading = ref(false); // Loading state for fetching the oldest transaction

  // Fetches account details on component mount
  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/jeu');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      accounts.value = await response.json();
    } catch (err) {
      error.value = err.message;
    }
  };
  
  // Sends a transaction between personal and solution accounts
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
  
  // Fetches the oldest transaction related to the accounts
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
  
  // Formats the ledger timestamp into a human-readable date
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
/* Error message style */
.error {
  color: red;
}
</style>