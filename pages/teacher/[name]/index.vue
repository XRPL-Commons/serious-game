<template>
  <div class="w-full text-center">
    <div class="flex-none">
      <nav class="mb-4">
        <UButton color="blue" @click="goToDashboard">Go back to Dashboard</UButton>
      </nav>
    </div>
    <div class="flex-row transform translate-y-1 mb-4">
      <h2 class="text-lg font-bold mb-2">Students</h2>
      <UButton color="primary" variant="solid" @click="onAddStudent">Add Student</UButton>
      <div class="mt-2">
        <label for="numStages">Number of Stages:</label>
        <input type="number" v-model="numStages" id="numStages" class="ml-2 mt-4 mb-2 p-1 border rounded" />
        <UButton color="green" variant="solid" class="ml-2" @click="updateMultipleStages">Update Multiple Stages</UButton>
      </div>
      <UButton color="green" variant="solid" class="mt-2 ml-2 mr-5" @click="updateAccounts">Update Accounts</UButton>
      <UButton color="red" variant="solid" class="mt-2 mr-5" @click="sendFinalTransaction">Send Final Tx</UButton>
      <UButton color="orange" variant="solid" class="mt-2 mr-5" @click="addOldestTransaction">Add Oldest Transaction</UButton>
      <UButton color="purple" variant="solid" class="mt-2 mr-5" @click="resetGameStages">Reset Game Stages</UButton>
      <UButton color="blue" variant="solid" class="mt-2" @click="sendMemo">Send Memo</UButton>
    </div>
    <div class="max-h-[calc(70vh-9rem)] overflow-y-auto w-full px-4">
      <div v-if="loading" class="flex justify-center mt-8">
        Loading...
      </div>
      <div v-else class="max-w-full overflow-x-auto">
        <UTable v-model:selected="selected" :sort="sort" :rows="students" :columns="columns" class="min-w-full max-w-full" @select="select">          
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteStudent(row.email)" />
          </template>
        </UTable>
      </div>
    </div>
    <TeacherAddStudent @success="handleStudentAdded" />
    <div v-if="selected.length > 0" class="mt-4">
      <UButton color="green" variant="solid" @click="generateKeysForSelected">Generate Keys for selected people</UButton>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '~/server/connectors/mongo';
import { TeacherAddStudent } from '#components';

const toast = useToast();
const modal = useModal();

const students = ref<User[]>([]);
const loading = ref<boolean>(true);
const numStages = ref<number>(3); // Default number of stages
const router = useRouter();
const classroomName = router.currentRoute.value.params.name;



const fetchStudents = async () => {
  try {
    loading.value = true;
    const headers = {
      'Content-Type': 'application/json',
    };
    const result = await fetch(`/api/classrooms/${classroomName}`, {
      method: 'GET',
      headers,
    });

    if (!result.ok) {
      throw new Error('Failed to fetch students');
    }

    students.value = await result.json();
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    loading.value = false;
  }
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

    fetchStudents();
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

    fetchStudents();
  } catch (error) {
    console.error('Error updating multiple stages:', error);
    toast.add({
      title: 'Error updating multiple stages',
      id: 'update-stages-error',
      variant: 'error',
    });
  }
};

const sendFinalTransaction = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({ classroomName });

    const result = await fetch('/api/jeu', {
      method: 'POST',
      headers,
      body,
    });

    if (!result.ok) {
      throw new Error('Failed to send transactions');
    }

    toast.add({
      title: 'Transactions sent successfully!',
      id: 'send-tx-success',
    });

    fetchStudents();
  } catch (error) {
    console.error('Error sending transactions:', error);
    toast.add({
      title: 'Failed to send transactions',
      id: 'send-tx-error',
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

    fetchStudents();
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
      method: 'POST',
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

    fetchStudents();
  } catch (error) {
    console.error('Error resetting game stages:', error);
    toast.add({
      title: 'Failed to reset game stages',
      id: 'reset-stages-error',
      type: 'error',
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
      throw new Error('Failed to send memo transactions');
    }

    toast.add({
      title: 'Memo transactions sent successfully!',
      id: 'send-memo-success',
    });

    fetchStudents();
  } catch (error) {
    console.error('Error sending memo transactions:', error);
    toast.add({
      title: 'Failed to send memo transactions',
      id: 'send-memo-error',
      type: 'error',
    });
  }
};

onMounted(() => {
  fetchStudents();
});

const goToDashboard = () => {
  router.push('/teacher');
};

const sort = ref({
  column: 'rank',
  direction: 'asc',
});

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'rank', label: 'Rank', sortable: true },
  { key: 'account', label: 'Personal Account'},
  { key: 'solution_account.classicAddress', label: 'Solution Account' },
  { key: 'oldestTransaction', label: 'Oldest Transaction Date', sortable: true },
  { key: 'actions', label: 'Actions' },
];

const selected = ref<User[]>([]);

function select(row: User) {
  const index = selected.value.findIndex((item) => item.email === row.email);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

const generateKeysForSelected = async () => {
  console.log('Generating keys for selected students:', selected.value);

};


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

const handleStudentAdded = (userData: User) => {
  addStudent(userData);
};

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

const deleteStudent = async (email: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const headers = {
        'content-type': 'application/json',
      };
      const body = { email };
      console.log({ body });

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

definePageMeta({
  layout: 'teacher',
});
</script>
