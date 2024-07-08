<template>
  <div class="flex justify-center ">

    <div class="flex-none mr-4 ">
      <div class="flex justify-center space-x-4">
    <div class="flex-none">
      <h2 class="text-lg font-bold mb-2">Classrooms</h2>
    </div>
    <div class="flex-none transform translate-y-[-1rem]">
      <UButton class="mt-4" color="green" label="Add Classroom" @click="addNewClassroom" />
    </div>
  </div>
      <UContainer>
        <UTable :rows="classrooms" :columns="classroomColumns">
          <!-- Your template content for classrooms -->
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteClassroom(row.id)" />
          </template>
        </UTable>
      </UContainer>
    </div>

    <div class="w-40"></div> <!-- Espace entre les 2 containers-->
    
    <div class="flex-none">
      <div class="flex justify-center space-x-4">
        <div class="flex-none">
          <h2 class="text-lg font-bold mb-2">Students</h2>
        </div>
        <div class="flex-none transform translate-y-[-1rem]">
          <UButton class="mt-4" color="blue" label="Add a Student to the Classroom" @click="addNewStudent" />
        </div>
      </div>
      <UContainer>
        <UTable :rows="students" :columns="studentColumns">
          <!-- Votre contenu de modèle pour les étudiants -->
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteStudent(row.id)" />
          </template>
        </UTable>
      </UContainer>
    </div>

  </div>
</template>



  <script setup lang="ts">
  definePageMeta({
  layout: 'teacher',
})
  </script>
