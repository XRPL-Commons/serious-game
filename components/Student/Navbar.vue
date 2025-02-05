<script setup lang="ts">
import { useRouter } from 'vue-router';
import { callApi } from '~/constants';

// Router instance to navigate between pages
const router = useRouter();

// Inject user information and get the user's name
const userInfo = inject('userInfo') as any;
const userName = userInfo.value?.name;

// Links for the navigation bar
const links = [{
  label: 'Home',
  to: '/student'
},{
  label: `Logged in as : ${userName}`,
}, {
  label: 'Log out',
  to: '/login',
  click : async () => {
    logout()
  }
}];

// Logout function triggered when the user clicks 'Log out'
const logout = async () => {

if (confirm('Are you sure you want to log out ?')) {
  try {
    const result = await callApi('logout'); // Use callApi function to send the logout request
    console.log('Logout response:', result); // Log the result of the API call

    if (result.success) {
      alert('You have been logged out');
      router.push('/login');
    } else {
      alert(`Logout failed: ${result.message}`);
    }
  } catch (error) {
    alert('Error during logout');
  }
} else {
  console.log('Logout cancelled by user'); // Log if the user cancels
  return;
}
};

</script>

<template>
  <div class="flex justify-center items-center w-full top-10 shadow-md fixed">

  <!-- Navigation bar container -->
    <div class="flex justify-center h-16 items-center">

  <!-- Horizontal navigation component -->
      <UHorizontalNavigation :links="links">
        <template #default="{ link }">

  <!-- Display navigation links -->
          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>
    </div>
  </div>
</template>
