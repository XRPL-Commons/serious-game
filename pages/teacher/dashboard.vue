<template>
  <div class="flex justify-center ">

    <div class="flex-none mr-4 ">
      <div class="flex justify-center space-x-4">
    <div class="flex-none">
      <h2 class="text-lg font-bold mb-2">Classrooms</h2>
    </div>
    <div class="flex-none transform translate-y-[-1rem]">
      <UButton class="mt-4" color="green" label="Add Classroom" @click="onAddClassroom" />
    </div>
  </div>
      <UContainer>
        <UTable :rows="classrooms" :columns="classroomColumns">
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteClassroom(row.id)" />
          </template>
        </UTable>
      </UContainer>
    </div>

    <div class="w-40"></div> 
    
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
          <template #actions-data="{ row }">
            <UButton color="gray" variant="ghost" label="Delete" @click="deleteStudent(row.id)" />
          </template>
        </UTable>
      </UContainer>
    </div>

  </div>

  <!-- <UTable :rows="classrooms"> </UTable> -->
  </template>



  <script setup lang="ts">
  definePageMeta({
  layout: 'teacher',
})

/**
 * Importation des fonctions et types nécessaires de Vue
 */
import { ref } from 'vue'; // Importation de la fonction ref de Vue pour créer des références réactives
import { useRouter } from 'vue-router'; // Importation de useRouter pour la navigation
import type { Classroom } from '~/server/connectors/mongo'; // Importation du type Classroom

/**
 * Déclaration des variables réactives
 */
const classrooms = ref<Classroom[]>([]); // Création d'une référence réactive pour stocker les classrooms
const loading = ref<boolean>(true); // Création d'une référence réactive pour l'état de chargement
const router = useRouter(); // Utilisation de useRouter pour la navigation

const fetchClassrooms = async () => {
  try {

    loading.value = true;
    const headers = {
      'content-type': 'application/json'
    }
    const result = await fetch('/api/classrooms/', {
      method: 'GET',
      headers,
    })
  
  classrooms.value = await result.json();
  } catch (error) {
    console.error('Error fetching classrooms:', error);
  } finally {
    loading.value = false;
  }
};

fetchClassrooms(); // Appel de la fonction pour récupérer les classrooms


const insertClassroom = async (classroom: any) => {
  try {
    const headers = {
      'content-type': 'application/json'
    }
    const body = JSON.stringify(classroom);
    const result = await fetch('/api/classrooms/', {
      method: 'POST',
      headers,
      body
    });

    const resultJSON = await result.json();
    console.log({ resultJSON });

  } catch (error) {
    console.error('Error adding classroom:', error);
  } finally {
    fetchClassrooms();
  }
};


import { TeacherAddClassroom } from '#components'; // Assurez-vous que le chemin est correct
const toast = useToast();
const modal = useModal();

function onAddClassroom() {
  toast.add({
    title: 'Adding Classroom',
    id: 'modal-success'
  });

  modal.open(TeacherAddClassroom, {
    async onSuccess(state: any) {
      console.log(state, 'Adding classroom from dashboard');
      await insertClassroom(state);
      toast.add({
        title: 'Classroom Added Successfully!',
        id: 'modal-success'
      });
      modal.close();
    }
  });
}


onMounted(() => {
  fetchClassrooms();
});
// To do Quand on clique sur une classroom à droite dans le tableau student on voit tous les student de la class
   // Rajouter teacher name a
  </script>

    

