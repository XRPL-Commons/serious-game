<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type { User } from '~/server/connectors/mongo'; 
import { AdminAddUser } from '#components'  
import { callApi } from '~/constants';

// Reactive variables to hold users and loading state
const users = ref<User[]>([]);
const loading = ref<boolean>(true);

// Router instance to navigate between pages
const router = useRouter();

const toast = useToast()
const modal = useModal()

// Function to open the modal for adding a new user
function onAddUser () {
  toast.add({
        title: 'TEST !',
        id: 'modal-success'
      })
  modal.open(AdminAddUser, {
    async onSuccess (state : any) {
      await insertUser(state)
      toast.add({
        title: 'Success !',
        id: 'modal-success'
      })
      modal.close()
    }
  })
}

// Function to send a POST request to add a new user, might need to be updated with callApi
const insertUser = async (user: any) => {
  try {
    const result = await callApi('createUser', { body: user }); 
    console.log('User created:', result);
    fetchUsers();
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

// Columns for the user table
const columns = [{
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'role',
  label: 'Role',
  sortable : true
}, {
  key: 'actions',
  label : 'Actions'
}]

// Function to fetch the list of users from the server
const fetchUsers = async () => {
  try {
    loading.value = true;
    const result = await callApi('getUsers');
    users.value = result; // `result` est déjà un objet JSON pas besoin de le convertir
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

// Function to delete a user using his email
const deleteUser = async (email: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const result = await callApi('deleteUser', { email });
      console.log('User deleted successfully:', result);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    fetchUsers();
  }
};

// Navigate to the teacher's dashboard
const goToDashboard = () => {
  router.push('/teacher');
};

// Fetch users when the page is loaded
fetchUsers();

</script>

<template>
    <div class="flex justify-center">
    <div class="flex-none mr-4">

      <!-- Page Header -->
      <h2 class="text-lg font-bold mb-2">Users</h2>
      
      <!-- Buttons to go to dashboard and add a new user -->
      <div class="flex justify-center space-x-4">

        <!-- Go to Teacher's Dashboard -->          
        <div class="flex-none">          
          <UButton color="blue" @click="goToDashboard">Go To Teacher's Dashboard</UButton>
        </div>
        <div class="flex-none transform translate-y-[-1rem]">

          <!-- Open modal to add a user -->
          <UButton class="mt-4" color="primary" variant="solid" label="Add User" @click="onAddUser" />
        </div>
      </div>

      <!-- User table with a scrollable container -->
      <div class="max-h-[calc(70vh-9rem)] overflow-y-auto mt-4">
        <div v-if="loading" class="mt-4">Loading...</div>
        <div v-else>
          <UTable :rows="users" :columns="columns">
            <template #actions-data="{ row }">
              
              <!-- Button to delete a user -->
              <UButton color="gray" variant="ghost" label="Delete" @click="deleteUser(row.email)" />
            </template>
          </UTable>
        </div>
      </div>
    </div>
  </div>
</template>
