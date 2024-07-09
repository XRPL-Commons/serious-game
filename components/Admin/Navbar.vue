<script setup lang="ts">
import { useRouter } from 'vue-router';
import { setCookie } from 'h3'

const router = useRouter();
const links = [{
  label: 'Home',
  to: '/admin'
}, {
  label: 'Dashboard',
  to: `/admin/dashboard`
}, {
  label: 'List of Users',
  to: '/admin/users'
}, {
  label: 'Log out',
  to: '/login',
  click : async () => {
    logout()
    alert('You have been logged out');
  }
}];
const logout = async () => {
  //setCookie(event, 'token', '', { maxAge: 0, path: '/', sameSite: 'None', secure: true });('token', '');
  alert('You have been logged out');
  router.push('/login');
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
