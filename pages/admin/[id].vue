<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
const { oruga } = useProgrammatic()

const route = useRoute()

const { data } = await useFetch('/api/projects/' + route.params.id)
const item = computed(() => data)
const errorMessage = ref('')

const saveProject = async () => {

  const record = item.value.value

  const projectId = record?._id
  const Project = record?.Project
  const Description = record?.Description
  const Section = record?.Section
  const Category = record?.Category
  const Tags = record?.Tags
  const Link = record?.Link
  const Grants = record?.Grants
  const Status = record?.Status


  console.log({
    projectId,
    Project,
    Description,
    Section,
    Category,
    Tags,
    Link,
    Grants,
    Status
  })

  try {
    const response = await useFetch('/api/projects/' + route.params.id, {
      method: 'PUT',
      body: {
        Project,
        Description,
        Section,
        Category,
        Tags,
        Link,
        Grants,
        Status
      }
    })
    oruga.notification.open({
      message: 'Record saved!',
      rootClass: 'toast-notification',
      variant: 'success',
      position: 'top'
    })
  } catch (e) {
    console.log(e)
    errorMessage.value = e.message
  }

}
</script>

<template >
  <NuxtLink to="/admin" class="text-blue-500">&lt;- Back</NuxtLink>
  <br />
  <br />
  <div class="max-w-sm rounded overflow-hidden shadow-lg border-black border-2">
    <!-- <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"> -->
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">{{ item.value.Project }}</div>
      <p class="text-gray-700 text-base">
        {{ item.value.Description }}
      </p>
    </div>
    <div class="px-6 pt-4 pb-2" v-if="item.value.Tags">
      <template v-for="tag in item.value.Tags.split(' ')">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{
          tag }}</span>
      </template>
    </div>
    <div class="px-6 pt-4 pb-2" v-if="item.value.Grants === 'Yes'">
      Grant recipient
    </div>
    <div class="px-6 pt-4 pb-2">
      This project is {{ item.value.Status }}
    </div>
    <div class="px-6 pt-4 pb-2">
      <a :href="item.value.URL" target="_blank" class="text-blue-800">{{ item.value.URL }}</a>
    </div>


  </div>
  <hr />

  Edit this record

  <section>
    <o-field label="Logo">
      <o-button variant="primary" label="Add logo..."></o-button>
    </o-field>


    <o-field label="Project">
      <o-input v-model="item.value.Project"></o-input>
    </o-field>

    <o-field label="Description">
      <o-input type="textarea" v-model="item.value.Description" maxlength="300"> </o-input>
    </o-field>

    <o-field label="Section" message="The main section">
      <o-input v-model="item.value.Section" maxlength="30"></o-input>
    </o-field>

    <o-field label="Category" message="The category or sub-section">
      <o-input v-model="item.value.Category" maxlength="30"></o-input>
    </o-field>

    <o-field label="Tags">
      <o-input v-model="item.value.Tags"></o-input>
    </o-field>

    <o-field label="Link" message="Link to the project">
      <o-input v-model="item.value.URL"></o-input>
    </o-field>

    <o-field label="Grants">
      <o-radio v-model="item.value.Grants" name="grant_recipient" native-value="Yes">Yes</o-radio>
      <o-radio v-model="item.value.Grants" name="grant_recipient" native-value="No">No</o-radio>
    </o-field>

    <o-field label="Status">
      <o-radio v-model="item.value.Status" name="status" native-value="Pre-launch">Pre-launch</o-radio>
      <o-radio v-model="item.value.Status" name="status" native-value="Active">Active</o-radio>
      <o-radio v-model="item.value.Status" name="status" native-value="Inactive">Inactive</o-radio>
    </o-field>

    <br />
    <o-notification v-if="errorMessage" variant="danger">{{ errorMessage }}</o-notification>
    <o-button label="Save Changes" variant="black" @click="saveProject" size="medium" />
  </section>
</template>