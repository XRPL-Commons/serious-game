<script lang="ts" setup>

import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { callApi } from '~/constants';

// Emit event for successful form submission
const emit = defineEmits(['success'])

// Schema to validate form input (classroom name)
const schema = object({
  classroomName: string().required('Required'),
})

type Schema = InferType<typeof schema>

  // Function to fetch and verify the token
  const fetchToken = async () => {
  try {
    const result = await callApi('verify');  // callApi function to send the verify request
    return result; 
  } catch (error) {
    console.error('Failed to verify token:', error);
    throw error; 
  }
}

// Decode the token and store necessary data
const decodedToken = await fetchToken();

// State to manage form data
const state = reactive({
  classroomName: undefined,
  teacherMail: decodedToken.email,
  students: [],
})

// Function triggered on form submission
async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit('success', state)
}

</script>

<template>
    <UModal>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

        <!-- Modal header with title -->
        <template #header>
          <p class="font-title">Add a classroom</p>
        </template>

        <!-- Classroom name input field -->
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.classroomName" />
        </UFormGroup>

        <!-- Modal footer with submit button -->
        <template #footer>
          <UButton type="submit" @click="onSubmit">
            Submit
          </UButton>
        </template>
      </UCard>
    </UModal>
  </template>