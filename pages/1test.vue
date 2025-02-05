<template>
  <div>
    <!-- Page Header -->
    <h1>Generated Ripple Accounts</h1>

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
      <UButton color="red" @click="fetchTransactions">Fetch Transactions</UButton>

      <!-- Display Transaction Result -->
      <div v-if="transactionResult">
        <h2>Transaction Result</h2>
        <p>Transaction Hash: {{ transactionResult.result.hash }}</p>
        <p>Transaction Status: {{ transactionResult.result.meta.TransactionResult }}</p>
      </div>

      <!-- Display Transaction History -->
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

    <!-- Loading State -->
    <div v-else>
      Loading...
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';  

  // Reactive state variables
  const accounts = ref(null);
  const error = ref(null);
  const transactionResult = ref(null);
  const transactions = ref([]);
  const loading = ref(false);
  
  // Fetches account details on component mount
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
  
  // Sends a transaction between personal and solution accounts
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
  
  // Fetches transactions related to the accounts
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
  
  // Filters transactions related to the personal account
  const filteredTransactions = computed(() => {
    return transactions.value.filter(tx => tx.tx.Account === accounts.value.account.classicAddress);
  });
  
  // Sorts the filtered transactions by date
  const sortedTransactions = computed(() => {
    return filteredTransactions.value.slice().sort((a, b) => {
      return a.tx.date - b.tx.date;
    });
  });
  
  // Formats the ledger timestamp into a human-readable date
  const formatDate = (ledgerTime) => {
    const epoch = 946684800;
    const unixTime = epoch + ledgerTime;
    const date = new Date(unixTime * 1000);
    return date.toUTCString();
  };
  
  // Fetch account details when component mounts
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
  