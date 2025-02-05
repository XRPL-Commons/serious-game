<script lang="ts" setup>
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

// Emit event when form is successfully submitted
const emit = defineEmits(['success'])

// Define form schema
const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required'),
    name: string().required('Required'),
    role: string().oneOf(["student", "admin", "teacher"], 'Role must be one of: student, admin, teacher').required('Required'),
})

// Define form schema type
type Schema = InferType<typeof schema>

// Initializing form state
const state = reactive({
  email: undefined,
  password: undefined,
  name: undefined,
  role: undefined
})

// Defining user roles
const roles = ['student', 'admin', 'teacher']

// Handle form submission
async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit('success', state)
}

</script>

<template>
  <UModal>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <!-- Modal header -->
        <template #header>
         <p class="font-title">Add a user.</p>
        </template>

        <!-- Form fields -->
        <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
        <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>
    <UFormGroup label="Role" name="role">
      <USelect v-model="state.role" :options="roles" />    
    </UFormGroup>
        <template #footer>

        <!-- Submit button -->
    <UButton type="submit" @click="onSubmit">
      Submit
    </UButton>
        </template>
      </UCard>
  </UModal>
</template>

