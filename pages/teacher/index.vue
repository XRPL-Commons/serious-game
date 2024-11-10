<!-- 
Key operations here include:
1. Fetching and displaying classrooms.
2. Adding new classrooms.
3. Deleting classrooms.
4. Navigating to a specific classroom for detailed management.
-->

<template>
  <div class="flex justify-center ">
    <div class="flex-none mr-4 ">

     <!-- Header and Add Classroom Button -->
      <div class="flex justify-center space-x-4">
    <div class="flex-none">
      <h2 class="text-lg font-bold mb-2">Classrooms</h2>
    </div>
    <div class="flex-none transform translate-y-[-1rem]">
      <UButton class="mt-4" color="green" label="Add Classroom" @click="onAddClassroom" />
    </div>
  </div>

   <!-- Table Displaying Classrooms -->
      <UContainer>
        <UTable :rows="classrooms" :columns="classroomColumns" @select="selectClassroom">
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteClassroom(row.classroomName)" />
          </template>
        </UTable>
      </UContainer>
    </div>
  </div>
  </template>

  <script setup lang="ts">
  definePageMeta({
  layout: 'teacher',
})

import { ref } from 'vue'; 
import { useRouter } from 'vue-router'; 
import type { Classroom } from '~/server/connectors/mongo'; 
import { TeacherAddClassroom } from '#components'; // Assurez-vous que le chemin est correct


// State variables
const classrooms = ref<Classroom[]>([]);
const loading = ref<boolean>(true); 

// Toast and modal instances
const toast = useToast();
const modal = useModal();

// Router instance to navigate between pages
const router = useRouter(); 

// Table column configuration
const classroomColumns = [ {
  key: 'classroomName',
  label: 'Class Name',
  sortable: true
}, {
  key: 'teacherMail',
  label: 'Teacher\'s Mail',
  sortable : true
}, {
  key: 'actions',
  label: 'Actions'
}];

// Fetch classrooms from the API
const fetchClassrooms = async () => {
  try {
    loading.value = true;
    const headers = {
      'content-type': 'application/json'
    }
    const result = await fetch('/api/classrooms/', {
      method: 'GET',
      headers,
    })
  classrooms.value = await result.json();
  } catch (error) {
    console.error('Error fetching classrooms:', error);
  } finally {
    loading.value = false;
  }
};

fetchClassrooms(); 

// Function to add a new classroom
const insertClassroom = async (classroom: any) => {
  try {
    const headers = {
      'content-type': 'application/json'
    }
    const body = JSON.stringify(classroom);
    const result = await fetch('/api/classrooms/', {
      method: 'POST',
      headers,
      body
    });
    const resultJSON = await result.json();
  } catch (error) {
    console.error('Error adding classroom:', error);
  } finally {
    fetchClassrooms();
  }
};



// Function to open the modal to add a classroom
function onAddClassroom() {
  toast.add({
    title: 'Adding Classroom',
    id: 'modal-success'
  });
  modal.open(TeacherAddClassroom, {
    async onSuccess(state: any) {
      await insertClassroom(state);
      toast.add({
        title: 'Classroom Added Successfully!',
        id: 'modal-success'
      });
      modal.close();
    }
  });
}

// Function to delete a classroom
const deleteClassroom = async (name: string) => {
  if (confirm('Are you sure you want to delete this classroom ?')) {
    console.log('Deleting classroom:', name);
    try {
      const headers = {
      'content-type': 'application/json'
    }
    const body = {
      name,
    }
    await fetch('/api/classrooms', {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body)
    })
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
    fetchClassrooms();
  }
};

// Navigate to a specific classroom
const selectClassroom = async (row: any) => {
  router.push(`/teacher/${row.classroomName}`);
}

// Fetch classrooms when the component is mounted
onMounted(() => {
  fetchClassrooms();
});

  </script>

    

