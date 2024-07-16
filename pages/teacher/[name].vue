// pages/teacher/[name].vue
<script setup lang="ts">


import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type { User } from '~/server/connectors/mongo'; 
import { TeacherAddStudent } from '#components';

const toast = useToast()
const modal = useModal()

const students = ref<User[]>([]);
const loading = ref<boolean>(true);
const router = useRouter();

const fetchStudents = async () => {
  try {
    loading.value = true;
    const classroomName = router.currentRoute.value.params.name;
    console.log("classroomName", {classroomName });
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
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

const deleteStudent = async (email: string) => {
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

    fetchStudents  }
};

onMounted(() => {
  fetchStudents();
});

const goToDashboard = () => {
  router.push('/teacher');
};

const columns = [{
  key: 'name',
  label: 'Name'
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'actions',
  label: 'Actions'
}];

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
    const classroomName = router.currentRoute.value.params.name;
    await addToClassroom(classroomName as string, userData);

    // Refresh student list after addition
    fetchStudents();
  } catch (error) {
    console.error('Error adding student:', error);
  }
};
function onAddStudent () {
  toast.add({
        title: 'TEST !',
        id: 'modal-success'
      })
  modal.open(TeacherAddStudent, {
    async onSuccess (state : any) {
      console.log(state,'celui de [name].vue')
      await addStudent(state)
      toast.add({
        title: 'Success !',
        id: 'modal-success'
      })
      modal.close()
    }
  })
}

const addToClassroom = async (classroomName: string, userData: User) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const result = await fetch(`/api/classrooms/${classroomName}/addStudent`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    if (!result.ok) {
      throw new Error('Failed to add student to classroom');
    }
  } catch (error) {
    console.error('Error adding student to classroom:', error);
  }
};

const handleStudentAdded = (userData: User) => {
  addStudent(userData);
};


definePageMeta({
  layout: 'teacher',
});
</script>

<template>
  <div class="w-full text-center">
    <div class="flex-none">
          <nav class="mb-4">
        <UButton color="blue" @click="goToDashboard">Go To Teacher's Dashboard from here</UButton>
      </nav>
        </div>
    <div class="flex-row transform translate-y-1">
      <h2 class="text-lg font-bold mb-2">Students</h2>
        <UButton color="primary" variant="solid" @click="onAddStudent">Add Student</UButton>
      </div>
      <div class="flex justify-center space-x-4 mb-4">
        
      <div v-if="loading" class="flex justify-center mt-8">
        Loading...
      </div>
      <div v-else>
        <UTable :rows="students" :columns="columns" class="w-full" >
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteStudent(row.email)" />
          </template>
        </UTable>
      </div>
    </div>
    <TeacherAddStudent @success="handleStudentAdded" />
  </div>
</template>
