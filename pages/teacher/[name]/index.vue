<!-- 
Key operations here include:
1. Fetching and displaying the current configuration of the selected classroom.
2. Modifying classroom-specific settings (such as game stages, student accounts, etc.).
3. Saving updates to the classroom configuration.
4. Navigating to different sections or settings related to the selected classroom.
-->

<template>
  <div class="teacher-dashboard w-full text-center bg-gray-50">

    <!-- Stage Configuration and Action Buttons -->
    <div class="mt-8 px-6 space-y-6">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <img src="/xrplb.png" alt="XRP Ledger Logo" class="h-8 mr-2" />
          <h1 class="text-2xl font-bold">Student And Game Management</h1>
        </div>
        </div>

      <!-- Action Buttons Section -->
       
      <!-- Stage Number Input -->
        <div class="flex items-center space-x-2">
          <label for="numStages" class="text-sm">Number of Stages:</label>
          <input 
            type="number" 
            v-model="numStages" 
            id="numStages" 
            min="1" 
            class="p-2 border rounded-md w-24"
            placeholder="Enter number"
          />
        </div>
        
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <UButton color="primary" variant="solid" @click="onAddStudent" class="flex items-center justify-center space-x-2">
          <i class="fa fa-user-plus"></i>
          <span>Add Student</span>
        </UButton>

        

        <UButton color="green" variant="solid" @click="updateMultipleStages" class="flex items-center justify-center space-x-2">
          <i class="fa fa-cogs"></i>
          <span>Update Multiple Stages</span>
        </UButton>

        <UButton color="green" variant="solid" @click="updateAccounts" class="flex items-center justify-center space-x-2">
          <i class="fa fa-sync-alt"></i>
          <span>Update Accounts</span>
        </UButton>

        <UButton color="yellow" variant="solid" @click="updateRanks" class="flex items-center justify-center space-x-2">
          <i class="fa fa-trophy"></i>
          <span>Update Ranks</span>
        </UButton>

        <UButton color="red" variant="solid" @click="sendFinalTransaction" class="flex items-center justify-center space-x-2">
          <i class="fa fa-paper-plane"></i>
          <span>Send Final Tx</span>
        </UButton>

        <UButton color="orange" variant="solid" @click="addOldestTransaction" class="flex items-center justify-center space-x-2">
          <i class="fa fa-history"></i>
          <span>Add Oldest Tx</span>
        </UButton>

        <UButton color="purple" variant="solid" @click="resetGameStages" class="flex items-center justify-center space-x-2">
          <i class="fa fa-undo"></i>
          <span>Reset Stages</span>
        </UButton>

        <UButton color="blue" variant="solid" @click="sendMemo" class="flex items-center justify-center space-x-2">
          <i class="fa fa-envelope"></i>
          <span>Send Memo</span>
        </UButton>
        <UButton color="red" variant="solid" @click="resetAccounts" class="flex items-center justify-center space-x-2">
          <i class="fa fa-trash"></i>
          <span>Reset Accounts</span>
        </UButton>
      </div>

      <!-- Student List Table -->
      <div class="mt-8 max-h-[calc(70vh-9rem)] overflow-y-auto w-full">
        <div v-if="loading" class="flex justify-center mt-8">
          Loading...
        </div>
        <div v-else class="overflow-x-auto w-full">
          <UTable v-model:selected="selected" :sort="sort" :rows="students" :columns="columns" class="min-w-full">
            <!-- Action Button for Deleting Students -->
            <template #actions-data="{ row }">
              <UButton color="gray" variant="ghost" label="Delete" @click="deleteStudent(row.email)" />
            </template>
          </UTable>
        </div>
      </div>

      <!-- Generate Keys Button for Selected Students -->
      <div v-if="selected.length > 0" class="mt-4">
        <UButton color="green" variant="solid" @click="generateKeysForSelected">
          <i class="fa fa-key"></i> Generate Keys for Selected
        </UButton>
      </div>
    </div>

    <!-- Add Student Modal -->
    <TeacherAddStudent @success="handleStudentAdded" />

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '~/server/connectors/mongo';
import { TeacherAddStudent } from '#components';
import { callApi } from '~/constants';


// Reactive variables
const toast = useToast();
const modal = useModal();
const students = ref<User[]>([]);
const loading = ref<boolean>(true);
const numStages = ref<number>(3); // Default number of stages
const selected = ref<User[]>([]); // Selected students for bulk actions

// Router instance to navigate between pages
const router = useRouter();

const classroomName = router.currentRoute.value.params.name;


// Fetch the list of students for the classroom
const fetchStudents = async () => {
  try {
    loading.value = true;
    const path = `/api/classrooms/${classroomName}`;
    const result = await callApi('GetClassroomStudents', { path }); 
    students.value = result; // Résultat déjà transformé en JSON dans callApi
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    loading.value = false;
  }
};

// Action: Go back to the Dashboard
const goToDashboard = () => {
  router.push('/teacher');
};

// Action: Update accounts for the classroom
const updateAccounts = async () => {
  try {
    await callApi('updateGame', {
      body: { classroomName },
    });

    toast.add({
      title: 'Accounts Updated Successfully!',
      id: 'update-success',
    });
  } catch (error) {
    console.error('Error updating accounts:', error);
    toast.add({
      title: 'Error updating accounts',
      id: 'update-error',
    });
  } finally {
    // Toujours recharger les étudiants, succès ou échec
    fetchStudents();
  }
};


// Action: Update multiple game stages
const updateMultipleStages = async () => {
  try {
    // Appel de l'API via la fonction générique callApi
    await callApi('updateMultipleStages', {
      body: { classroomName, numStages: numStages.value },
    });

    toast.add({
      title: 'Multiple Stages Updated Successfully!',
      id: 'update-stages-success',
    });
  } catch (error) {
    console.error('Error updating multiple stages:', error);
    toast.add({
      title: 'Error updating multiple stages',
      id: 'update-stages-error',
    });
  } finally {
    fetchStudents();
  }
};

// Action: Update rank based on oldest transaction
const updateRanks = async () => {
  try {
    // Using the generic callApi function to call the API
    const response = await callApi('updateRanks', {
      body: { classroomName }
    });

    // Verifying the response from the API
    if (response?.updatedStudents) {
      console.log('Ranks updated successfully', response.updatedStudents);
    } else {
      throw new Error('Invalid response from API');
    }
  } catch (error) {
    console.error('Error updating ranks:', error);
  } finally {
    fetchStudents();
  }
};

// Action: Send final transactions
const sendFinalTransaction = async () => {
  try {
    await callApi('sendFinalTransaction', {
      body: { classroomName },
    });

    toast.add({
      title: 'Transactions sent successfully!',
      id: 'send-tx-success',
    });
  } catch (error) {
    console.error('Error sending transactions:', error);
    toast.add({
      title: 'Failed to send transactions',
      id: 'send-tx-error',
    });
  } finally {
    // Toujours recharger les étudiants, succès ou échec
    fetchStudents();
  }
};

// Action: Reset account information
const resetAccounts = async () => {
  try {
    const response = await callApi('resetAccounts', { name: classroomName });
    console.log(response.message);

    toast.add({
      title: 'Accounts reset successfully!',
      id: 'reset-success',
    });
  } catch (error) {
    console.error('Error resetting accounts:', error);
    toast.add({
      title: 'Failed to reset accounts',
      id: 'reset-error',
    });
  } finally {
    fetchStudents(); // Recharge les étudiants dans tous les cas
  }
};


// Action: Add oldest transaction
const addOldestTransaction = async () => {
  try {
    // Calling the API using the generic callApi function
    await callApi('updateOldestTransaction', {
      body: { classroomName },
    });

    toast.add({
      title: 'Oldest transactions added successfully!',
      id: 'oldest-tx-success',
    });
  } catch (error) {
    console.error('Error adding oldest transactions:', error);
    toast.add({
      title: 'Failed to add oldest transactions',
      id: 'oldest-tx-error',
    });
  } finally {
    // Toujours recharger les étudiants, succès ou échec
    fetchStudents();
  }
};


// Action: Reset game stages
const resetGameStages = async () => {
  try {
    // Using the generic callApi function to call the API
    await callApi('resetGameStages', {
      body: { classroomName },
    });

    // Success notification
    toast.add({
      title: 'Game stages reset successfully!',
      id: 'reset-stages-success',
    });
  } catch (error) {
    console.error('Error resetting game stages:', error);

    // error notification
    toast.add({
      title: 'Failed to reset game stages',
      id: 'reset-stages-error',
    });
  } finally {
    // Toujours recharger les étudiants, succès ou échec
    fetchStudents();
  }
};

// Action: Send memo transactions
const sendMemo = async () => {
  try {
    // Using the generic callApi function to call the API
    await callApi('sendMemo', {
      body: { classroomName },
    });

    // Success notification
    toast.add({
      title: 'Memo transactions sent successfully!',
      id: 'send-memo-success',
    });
  } catch (error) {
    console.error('Error sending memo transactions:', error);

    // error notification
    toast.add({
      title: 'Failed to send memo transactions',
      id: 'send-memo-error',
    });
  } finally {
    // Toujours recharger les étudiants, succès ou échec
    fetchStudents();
  }
};


// Fetch the list of students when the component is mounted
onMounted(() => {
  fetchStudents();
});

// Sort and select functions
const sort = ref({
  column: 'rank',
  direction: 'asc',
});
function select(row: User) {
  const index = selected.value.findIndex((item) => item.email === row.email);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

// Table columns
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'rank', label: 'Rank', sortable: true },
  { key: 'account', label: 'Personal Account'},
  { key: 'solution_account.classicAddress', label: 'Solution Account' },
  { key: 'oldestTransaction', label: 'Oldest Transaction Date', sortable: true },
  { key: 'actions', label: 'Actions' },
];

// Generate keys for the selected students (currently a placeholder)
const generateKeysForSelected = async () => {
  // TODO: Add logic to generate keys for selected students
};


// Action: Create a student and add to the classroom
const addStudent = async (userData: User) => {
  try {
    userData.role = 'student';
    const headers = {
      'Content-Type': 'application/json',
    };
    const result = await fetch('/api/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
    if (!result.ok) {
      throw new Error('Failed to add student');
    }
    await addToClassroom(classroomName as string, userData);
    fetchStudents();
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

// Helper: Add a student to classroom
const addToClassroom = async (classroomName: string, userData: User) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    await fetch(`/api/classrooms/${classroomName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
    fetchStudents();
  } catch (error) {
    console.error('Error adding student to classroom:', error);
  }
};

// Handle the success after adding a student
const handleStudentAdded = (userData: User) => {
  addStudent(userData);
};

// Open the modal to add a student
function onAddStudent() {
  toast.add({
    title: 'Adding Student',
    id: 'modal-success',
  });
  modal.open(TeacherAddStudent, {
    async onSuccess(state: any) {
      await addStudent(state);
      toast.add({
        title: 'Success!',
        id: 'modal-success',
      });
      modal.close();
    },
  });
}

// Action: Delete a student using their email
const deleteStudent = async (email: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const headers = {
        'content-type': 'application/json',
      };
      const body = { email };
      await fetch('/api/users', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(body),
      });
      await fetch(`/api/classrooms/${classroomName}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(body),
      });
      fetchStudents();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};


// Set layout to teacher
definePageMeta({
  layout: 'teacher',
});
</script>
<style scoped>
.teacher-dashboard {
  background-color: #f5f7fa;
}

.bg-xrp-blue {
  background-color: #00A9E0; /* XRP Ledger Brand Color */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

button {
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3498db;
}
</style>
