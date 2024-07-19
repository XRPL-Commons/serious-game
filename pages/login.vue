<template>
  <div>
    <UContainer class="max:w-sm space-y-4">
      <p class="font-title">Login</p>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="DoLogin">
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>
    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
    </UContainer>
    <pre>{{ email }} {{ password }}</pre>
  </div>
</template>

<script lang="ts" setup>

import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import alex_first_api from '~/server/client'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with event.data
}

const router = useRouter()
const email = ref('')
const password = ref('')
const working = ref(false)
const token = ref<string | null>(null);
const setUserInfo = inject('setUserInfo') as any

const DoLogin = async () => {
  working.value = true
  //Let's factorize the code above thanks to /secret/api/plugins/clients.ts
  const resultJSON = await alex_first_api.login({email: state.email,
      password: state.password})
    if (resultJSON.success) {
      const userRole = resultJSON.role;
      setUserInfo(resultJSON)
      router.push(`/${userRole}`);
      return
    }
    alert('Wrong username or password')
    working.value = false
  }
  const loading = ref(true);

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

const CheckLogin = async () => {
  try {
    const decodedToken = await fetchToken();

    if (decodedToken.role) {
      router.push(`/${decodedToken.role}`);
    }
  } catch (err) {
    console.error('Error during token verification:', err);
    alert('Please log in');
    router.push('/login');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  CheckLogin();
});

</script>
