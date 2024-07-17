<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type { User } from '~/server/connectors/mongo'; 
import { AdminAddUser } from '#components'  

const users = ref<User[]>([]);
const loading = ref<boolean>(true);
const router = useRouter();
const toast = useToast()
const modal = useModal()
function onAddUser () {
  toast.add({
        title: 'TEST !',
        id: 'modal-success'
      })
  modal.open(AdminAddUser, {
    async onSuccess (state : any) {
      console.log(state,'celui de users.vue')
      await insertUser(state)
      toast.add({
        title: 'Success !',
        id: 'modal-success'
      })
      modal.close()
    }
  })
}
const insertUser = async (user: any) => {
  try {
    const headers = {
      'content-type': 'application/json'
    }
    const body = JSON.stringify(user)
    const result = await fetch('/api/users/', {
      method: 'POST',
      headers,
      body})

    const resultJSON = await result.json()
    console.log({ resultJSON })

  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    fetchUsers();
  }
}
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

const fetchUsers = async () => {
  try {

    loading.value = true;
    const headers = {
      'content-type': 'application/json'
    }
    const result = await fetch('/api/users/', {
      method: 'GET',
      headers,
    })
    users.value = await result.json();
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (email: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const headers = {
      'content-type': 'application/json'
    }
    const body = {
      email,
    }
    console.log({ body })
    const result = await fetch('/api/users', {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body)
    })

      
    } catch (error) {
      console.error('Error deleting user:', error);
    }

    fetchUsers();
  }
};

const goToDashboard = () => {
  router.push('/teacher');
};
fetchUsers();

</script>

<template>
    <div class="flex justify-center">
    <div class="flex-none mr-4">
      <h2 class="text-lg font-bold mb-2">Users</h2>    
      <div class="flex justify-center space-x-4">          
        <div class="flex-none">          
          <UButton color="blue" @click="goToDashboard">Go To Teacher's Dashboard</UButton>
        </div>
        <div class="flex-none transform translate-y-[-1rem]">
          <UButton class="mt-4" color="primary" variant="solid" label="Add User" @click="onAddUser" />
        </div>
      </div>
      <div class="max-h-[calc(70vh-9rem)] overflow-y-auto mt-4">
        <div v-if="loading" class="mt-4">Loading...</div>
        <div v-else>
          <UTable :rows="users" :columns="columns">
            <template #actions-data="{ row }">
              <UButton color="gray" variant="ghost" label="Delete" @click="deleteUser(row.email)" />
            </template>
          </UTable>
        </div>
      </div>
    </div>
  </div>
</template>
