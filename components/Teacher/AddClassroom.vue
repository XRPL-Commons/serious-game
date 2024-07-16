<script lang="ts" setup>
const emit = defineEmits(['success'])

import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'


const schema = object({
  classroomName: string().required('Required'),
})

type Schema = InferType<typeof schema>
  const fetchToken = async () => {
  const response = await fetch('/api/users/verify', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to verify token');
  }

  return await response.json();
};

const decodedToken = await fetchToken();

const state = reactive({
  classroomName: undefined,
  teacherMail: decodedToken.email,
  students: [],
})
// export const generateSlug = (projectName: String) => {
//   if (!projectName){
//     return ''
//   } 
//   return projectName
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]+/g, '')
//     .replace(/--+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }
// const newclassroomName = generateSlug(state.classroomName)

async function onSubmit (event: FormSubmitEvent<Schema>) {
  console.log(state, 'Adding classroom')
    // state.classroomName = newclassroomName
  emit('success', state)
}
</script>


<template>
    <UModal>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <p class="font-title">Add a classroom</p>
        </template>
        
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.classroomName" />
        </UFormGroup>
        <template #footer>
          <UButton type="submit" @click="onSubmit">
            Submit
          </UButton>
        </template>
      </UCard>
    </UModal>
  </template>