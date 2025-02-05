<script lang="ts" setup>

import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

// Emit event for successful form submission
const emit = defineEmits(['success'])

// Validation schema for the form inputs
// Ensures valid email, password (min 8 characters), and name
const schema = object({
  email: string().email('Invalid email').required('Required'),
  name: string().required('Required'),
  password: string().min(8, 'Must be at least 8 characters').required('Required'),
});

// Define the type of the schema
type Schema = InferType<typeof schema>;

// Reactive state to hold form input values
const state = reactive({
  email: undefined,
  password: undefined,
  name: undefined,
  role: 'student',
})

// Handle form data submission
async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit('success', state)
}

</script>

<template>
  <UModal>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

      <!-- Modal header with title -->
      <template #header>
        <p class="font-title">Add a student</p>
      </template>

      <!-- Input fields for user details -->
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
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

