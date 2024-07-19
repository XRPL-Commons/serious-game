<template>
    <div>
      <h1>Generated Ripple Accounts</h1>
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
        <UButton color="red" @click="fetchTransactions">Fetch Transactions</UButton>
        <div v-if="transactionResult">
          <h2>Transaction Result</h2>
          <p>Transaction Hash: {{ transactionResult.result.hash }}</p>
          <p>Transaction Status: {{ transactionResult.result.meta.TransactionResult }}</p>
        </div>
        <div v-if="filteredTransactions.length">
          <h2>Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount (drops)</th>
                <th>From Address</th>
                <th>To Address</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in sortedTransactions" :key="tx.tx.hash">
                <td>{{ formatDate(tx.tx.date) }}</td>
                <td>{{ tx.tx.Amount }}</td>
                <td>{{ tx.tx.Account }}</td>
                <td>{{ tx.tx.Destination }}</td>
                <td>{{ tx.tx.hash }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';  
  const accounts = ref(null);
  const error = ref(null);
  const transactionResult = ref(null);
  const transactions = ref([]);
  const loading = ref(false);
  
  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/test');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      accounts.value = await response.json();
    } catch (err) {
      error.value = err.message;
    }
  };
  
  const sendTransaction = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      const body = JSON.stringify({
        account: accounts.value.account,
        solution_account: accounts.value.solution_account
      });
      const response = await fetch('/api/test', {
        method: 'POST',
        headers,
        body
      });
      if (!response.ok) {
        throw new Error('Failed to send transaction');
      }
      const result = await response.json();
      transactionResult.value = result;
    } catch (err) {
      error.value = err.message;
      console.error('Error sending transaction:', err);
    }
  };
  
  const fetchTransactions = async () => {
    try {
      loading.value = true;
      const response = await fetch(`/api/test/transactions/${accounts.value.solution_account.classicAddress}?personal_account=${accounts.value.account.classicAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      transactions.value = await response.json();
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching transactions:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const filteredTransactions = computed(() => {
    return transactions.value.filter(tx => tx.tx.Account === accounts.value.account.classicAddress);
  });
  
  const sortedTransactions = computed(() => {
    return filteredTransactions.value.slice().sort((a, b) => {
      return a.tx.date - b.tx.date;
    });
  });
  
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
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>
  