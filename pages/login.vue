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
  console.log(event.data)
}

const router = useRouter()

const email = ref('')
const password = ref('')
const working = ref(false)
const isLoggedIn = ref(false);
const loggedInUser = ref({ email: '', role: '' });

const token = inject('token')

const DoLogin = async () => {
  working.value = true

  //Let's factorize the code above thanks to /secret/api/plugins/clients.ts
  const resultJSON = await alex_first_api.login({email: state.email,
      password: state.password})

    console.log({ resultJSON})
    if (resultJSON.success) {
      /* @ts-ignore */
      token.value = password.value
      const userRole = resultJSON.role;
      router.push(`/${userRole}`);
      return
    }
    alert('Wrong username or password')

    working.value = false
  }



// const checkLoggedInStatus = async () => {
//   if (authToken) {
//     try {
//       const response = await fetch('/api/verify-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`
//         }
//       });
      
//       const result = await response.json();
//       if (result.success) {
//         isLoggedIn.value = true;
//         loggedInUser.value.email = result.email;
//         loggedInUser.value.role = result.role; // If needed
//       }
//     } catch (error) {
//       console.error('Error checking login status:', error);
//     }
//   }
// };

// onMounted(async () => {
//   await checkLoggedInStatus();
// });



</script>
