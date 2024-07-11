<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = inject('userInfo') as any;
const userName = userInfo.value?.name;
console.log('userName est ', userName);

const links = [{
  label: 'Home',
  to: '/teacher'
}, {
  label: 'Dashboard',
  to: `/teacher/dashboard`
}, {
  label: 'Start a Serious Game',
  to: '/teacher/game'
}, {
  label: `Logged in as : ${userName}`,
},{
  label: 'Log out',
  to: '/login',
  click : async () => {
    logout()
  }
}];
const logout = async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log( 'result success est ' ,result.success);
    if (result.success) {
      alert('You have been logged out');
      router.push('/login');
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error during logout:', error);
    alert('Error during logout');
  }
};
</script>

<template>
  <div class="flex justify-center items-center w-full top-10 shadow-md fixed">
    <div class="flex justify-center h-16 items-center">
      <UHorizontalNavigation :links="links">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>
    </div>
  </div>
</template>
