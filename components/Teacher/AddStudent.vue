<script lang="ts" setup>


const emit = defineEmits(['success'])

import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import Student from '~/layouts/student.vue';


const schema = object({
  email: string().email('Invalid email').required('Required'),
  name: string().required('Required'),
  password: string().min(8, 'Must be at least 8 characters').required('Required'),
});

type Schema = InferType<typeof schema>;


const state = reactive({
  email: undefined,
  password: undefined,
  name: undefined,
  role: Student,
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  emit('success', state)
}

</script>

<template>
  <UModal>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <p class="font-title">Add a student</p>
      </template>
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <template #footer>
        <UButton type="submit" @click="onSubmit">
          Submit
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

