<script lang="ts" setup>
const emit = defineEmits(['success'])

import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  name: string().required('Required'),
  teacherId: string().required('Required'),
})

type Schema = InferType<typeof schema>

const state = reactive({
  name: undefined,
  teacherId: undefined,
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  console.log(state, 'Adding classroom')
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
          <UInput v-model="state.name" />
        </UFormGroup>
        
        <UFormGroup label="Teacher ID" name="teacherId">
          <UInput v-model="state.teacherId" />
        </UFormGroup>
  
        <template #footer>
          <UButton type="submit" @click="onSubmit">
            Submit
          </UButton>
        </template>
      </UCard>
    </UModal>
  </template>