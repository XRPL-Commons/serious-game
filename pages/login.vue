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

const token = inject('token')
console.log( "mon token de inject est ce qui suit ", {token} );

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

const loading = ref(true);


const CheckLogin = async () => {
  try{
  console.log('token est ', token.value);
  /* @ts-ignore */
  if (!token.value) {  // If no token, redirect to login
          router.push('/login');
        }

else  {
  loading.value = true;
  const verifyResponse = await fetch('/api/users/verify', {
          method: 'GET',
          headers: {
            /* @ts-ignore */
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          }
        });
console.log('verifyResponse est ce qui suit ', { verifyResponse } );
const decodedToken = await verifyResponse.json();
        console.log({ decodedToken });
router.push(`/${decodedToken.role}`);
}
  } catch (err) {
        console.error('Error during token verification:', err);
        alert('Please log in');
        router.push('/login');
      } finally {
        loading.value = false;
  }
}


onMounted(() => {
  CheckLogin();

});




</script>
