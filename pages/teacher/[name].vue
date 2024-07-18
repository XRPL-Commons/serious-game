<template>
  <div class="w-full text-center">
    <div class="flex-none">
      <nav class="mb-4">
        <UButton color="blue" @click="goToDashboard">Go back to Dashboard</UButton>
      </nav>
    </div>
    <div class="flex-row transform translate-y-1">
      <h2 class="text-lg font-bold mb-2">Students</h2>
      <UButton color="primary" variant="solid" @click="onAddStudent">Add Student</UButton>
      <UButton color="green" variant="solid" @click="updateAccounts">Update Accounts</UButton>
      <UButton color="red" variant="solid" @click="sendFinalTransaction">Send Final Tx</UButton>
      <UButton color="orange" variant="solid" @click="addOldestTransaction">Add Oldest Transaction</UButton>
      <UButton color="purple" variant="solid" @click="startGame">Start Game</UButton>
    </div>
    <div class="flex justify-center space-x-4 mb-4">
      <div v-if="loading" class="flex justify-center mt-8">
        Loading...
      </div>
      <div v-else>
        <UTable :sort="sort" :rows="students" :columns="columns" class="w-full">
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteStudent(row.email)" />
          </template>
        </UTable>
      </div>
    </div>
    <TeacherAddStudent @success="handleStudentAdded" />
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
const router = useRouter();
const classroomName = router.currentRoute.value.params.name;

const fetchStudents = async () => {
  try {
    loading.value = true;
    const headers = {
      'Content-Type': 'application/json'
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
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ classroomName });

    const result = await fetch(`/api/jeu`, {
      method: 'PUT',
      headers,
      body
    });

    if (!result.ok) {
      throw new Error('Failed to update accounts');
    }

    toast.add({
      title: 'Accounts Updated Successfully!',
      id: 'update-success'
    });

    fetchStudents();
  } catch (error) {
    console.error('Error updating accounts:', error);
    toast.add({
      title: 'Error updating accounts',
      id: 'update-error',
      variant: 'error'
    });
  }
};

const sendFinalTransaction = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ classroomName });

    const result = await fetch('/api/jeu', {
      method: 'POST',
      headers,
      body
    });

    if (!result.ok) {
      throw new Error('Failed to send transactions');
    }

    toast.add({
      title: 'Transactions sent successfully!',
      id: 'send-tx-success'
    });

    fetchStudents();
  } catch (error) {
    console.error('Error sending transactions:', error);
    toast.add({
      title: 'Failed to send transactions',
      id: 'send-tx-error',
      type: 'error'
    });
  }
};

const addOldestTransaction = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ classroomName });

    const result = await fetch('/api/jeu/oldest-transaction', {
      method: 'PUT',
      headers,
      body
    });

    if (!result.ok) {
      throw new Error('Failed to add oldest transactions');
    }

    toast.add({
      title: 'Oldest transactions added successfully!',
      id: 'oldest-tx-success'
    });

    fetchStudents();
  } catch (error) {
    console.error('Error adding oldest transactions:', error);
    toast.add({
      title: 'Failed to add oldest transactions',
      id: 'oldest-tx-error',
      type: 'error'
    });
  }
};

const startGame = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ classroomName });

    const result = await fetch('/api/jeu/start-game', {
      method: 'POST',
      headers,
      body
    });

    if (!result.ok) {
      throw new Error('Failed to start game');
    }

    toast.add({
      title: 'Game started successfully!',
      id: 'start-game-success'
    });

    fetchStudents();
  } catch (error) {
    console.error('Error starting game:', error);
    toast.add({
      title: 'Failed to start game',
      id: 'start-game-error',
      type: 'error'
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
  direction: 'asc'
});

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'rank', label: 'Rank', sortable: true },
  { key: 'account', label: 'Personal Account' },
  { key: 'solution_account.classicAddress', label: 'Solution Account' },
  { key: 'oldestTransaction', label: 'Oldest Transaction Date', sortable: true },
  { key: 'actions', label: 'Actions' }
];

const addStudent = async (userData: User) => {
  try {
    userData.role = 'student';
    const headers = {
      'Content-Type': 'application/json'
    };
    const result = await fetch('/api/users', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
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
      'Content-Type': 'application/json'
    };
    await fetch(`/api/classrooms/${classroomName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
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
    id: 'modal-success'
  });
  modal.open(TeacherAddStudent, {
    async onSuccess(state: any) {
      await addStudent(state);
      toast.add({
        title: 'Success!',
        id: 'modal-success'
      });
      modal.close();
    }
  });
}

const deleteStudent = async (email: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const headers = {
        'content-type': 'application/json'
      };
      const body = { email };
      console.log({ body });

      await fetch('/api/users', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(body)
      });

      await fetch(`/api/classrooms/${classroomName}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(body)
      });

      fetchStudents();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

definePageMeta({
  layout: 'teacher'
});
</script>
