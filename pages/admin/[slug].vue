<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import ModalConfirm from '/components/ModalConfirm.vue';
import ModalFileInput from '/components/ModalFileInput.vue';

interface ProjectRecord {
  name: string,
  description: string,
  section: string,
  category: string,
  tags: [string],
  url: string,
  grants: string,
  status: string,
  thumbnail: string,
  logo: string,
  visible: boolean,
}

const { oruga } = useProgrammatic()

const route = useRoute()
const router = useRouter()

// const { data } = await useFetch('/api/projects/' + route.params.slug)
// const item = computed(() => data)
const errorMessage = ref('')
const loaded = ref(false)

// record values
const record = ref({})
const name = ref('')
const description = ref('')
const section = ref('')
const category = ref('')
const tags = ref('')
const url = ref('')
const grants = ref('')
const status = ref('')
const thumbnail = ref('')
const logo = ref('')
const visible = ref(false)

// watch(data, (newData: Ref) => {
//   console.log('NEW DATA', newData)
//   visible.value = newData.value.visible
//   name.value = newData.value.name
//   console.log(visible.value)
// })
onMounted(async () => {
  await reload()
})

const reload = async () => {
  console.log('HERE')
  const fetchResult = await useFetch('/api/projects/' + route.params.slug)
  const recordInfo = fetchResult.data.value as ProjectRecord
  console.log('fetchResult', recordInfo)
  loaded.value = true
  record.value = recordInfo || {}
  name.value = recordInfo.name
  description.value = recordInfo.description
  section.value = recordInfo.section
  category.value = recordInfo.category
  url.value = recordInfo.url
  grants.value = recordInfo.grants
  status.value = recordInfo.status
  thumbnail.value = recordInfo.thumbnail
  logo.value = recordInfo.logo
  visible.value = recordInfo.visible
  tags.value = recordInfo?.tags.join(' ') || ''
}

const saveProject = async () => {

  // const record = value

  // const projectId = record?._id
  // const name = record?.name
  // const description = record?.description
  // const section = record?.section
  // const category = record?.category
  // const tags = record?.tags
  // const link = record?.link
  // const grants = record?.grants
  // const status = record?.status

  console.log({
    name,
    description,
    section,
    category,
    tags,
    url,
    grants,
    status,
    visible
  })

  try {
    const response = await useFetch('/api/projects/' + route.params.slug, {
      method: 'PUT',
      body: {
        name,
        description,
        section,
        category,
        tags: tags.value.split(' '),
        url,
        grants,
        status,
        visible
      }
    })
    oruga.notification.open({
      duration: 5000,
      message: 'Record saved!',
      rootClass: 'toast-notification',
      variant: 'success',
      position: 'top'
    })
  } catch (e) {
    console.log(e)
    if (e instanceof Error) {
      errorMessage.value = e.toString()
    } else {
      errorMessage.value = 'An error occured while saving...'
    }
  }

}

const file = ref<File | null>(null)

const uploadImage = async (e: any) => {
  const slug = route.params.slug
  // file
  const files = e.target.files;
  const formData = new FormData();
  formData.append('file', files[0]);
  file.value = files[0]

  console.log(files[0], file.value)
  try {
    const result = await useFetch(`/api/projects/${slug}/media`, {
      method: 'POST',
      body: formData,
    })
    console.log('UPLOAD RESULT', result)
    if (result.error.value) {
      // @ts-ignore
      throw new Error(result.error.value.statusMessage)
    }
    oruga.notification.open({
      duration: 5000,
      message: 'Image updated!',
      rootClass: 'toast-notification',
      variant: 'success',
      position: 'top'
    })
    await reload()
  } catch (e) {
    console.error(e)
    let message = 'An error occured while uploading file...'
    if (e instanceof Error) {
      message = e.toString()
    }
    oruga.notification.open({
      duration: 5000,
      message,
      rootClass: 'toast-notification',
      variant: 'danger',
      position: 'top'
    })

  }
}
const deleteProject = async ({ confirmed = false }) => {

  const slug = route.params.slug

  // confirm
  if (confirmed === false) {
    oruga.modal.open({
      component: ModalConfirm,
      props: {
        title: 'Delete Record?',
        message: 'Do you really want to delete the record permanently?',
        confirmText: 'Delete the record',
        type: 'danger'
      },
      events: {
        'confirm': () => {
          deleteProject({ confirmed: true })
        },
        'close': () => { }
      },
      trapFocus: true
    })
    return
  }
  try {
    const { data } = await useFetch(`/api/projects/${slug}`, {
      method: 'DELETE'
    })
    console.log('DELETE', data.value)
    if (data.value === true) {
      oruga.notification.open({
        duration: 5000,
        message: 'Record deleted successfully!',
        rootClass: 'toast-notification',
        variant: 'success',
        position: 'top'
      })
      router.push('/admin')
    }
  } catch (e) {
    console.error(e)
    let message = 'An error occured while deleting the record'
    if (e instanceof Error) {
      message = e.message
    }
    oruga.notification.open({
      duration: 5000,
      message,
      rootClass: 'toast-notification',
      variant: 'danger',
      position: 'top'
    })
  }
}

</script>

<template >
  <NuxtLink to="/admin" class="text-blue-500">&lt;- Back</NuxtLink>
  <br />
  <br />
  <ProjectDetails :item="record" />
  <hr />

  <div class="font-title text-xl py-2 font-bold">Edit this record</div>

  <section v-if="loaded">

    <o-field label="Project" message="The unique project name">
      <o-input v-model="name"></o-input>
    </o-field>

    <o-field label="Description" message="Please describe the project in as much detail as possible">
      <o-input type="textarea" v-model="description" maxlength="1000"> </o-input>
    </o-field>

    <o-field label="Section" message="The main section">
      <o-input v-model="section" maxlength="30"></o-input>
    </o-field>

    <o-field label="Category" message="The category or sub-section">
      <o-input v-model="category" maxlength="30"></o-input>
    </o-field>

    <o-field label="Tags" message="List tags seperated by a space">
      <o-input v-model="tags"></o-input>
    </o-field>

    <o-field label="Link" message="Link to the project">
      <o-input v-model="url"></o-input>
    </o-field>

    <o-field label="Grants">
      <o-radio v-model="grants" name="grant_recipient" native-value="Yes">Yes</o-radio>
      <o-radio v-model="grants" name="grant_recipient" native-value="No">No</o-radio>
    </o-field>

    <o-field label="Status">
      <o-radio v-model="status" name="status" native-value="Pre-launch">Pre-launch</o-radio>
      <o-radio v-model="status" name="status" native-value="Active">Active</o-radio>
      <o-radio v-model="status" name="status" native-value="Inactive">Inactive</o-radio>
    </o-field>


    <o-field label="Logo">
      <div class="inline-block m-1 border-2 border-grey-300 p-2 bg-grey-50">
        <img v-if="thumbnail" class="w-50  p-0 m-0 " :src="thumbnail" alt="Project thumbnail">
      </div>
      <div class="inline-block m-1 border-2 border-grey-300 p-2 bg-grey-50">
        <img v-if="logo" class="w-50  p-0 m-0 " :src="logo" alt="Project logo">
      </div>
      <!-- <o-button variant="primary" label="Add logo..." @click="uploadImage"></o-button> -->

      <o-upload @change="uploadImage">
        <o-button tag="a" variant="primary" class="m-1">
          <span>Update logo...</span>
        </o-button>
      </o-upload>
    </o-field>

    <o-field label="Visible">
      <o-switch v-model="visible">
        {{ visible }}
      </o-switch>
    </o-field>

    <br />
    <o-notification v-if="errorMessage" variant="danger">{{ errorMessage }}</o-notification>
    <o-button label="Save Changes" variant="black" @click="saveProject" size="medium" />

    <br />
    <br />
    <br />
    <o-notification class="border-2">Delete the record, this action cannot be undone.
      <br />
      <br />
      <o-button label="Delete Record..." variant="danger" @click="deleteProject" size="medium" />
    </o-notification>

    <!-- <pre>{{ record }}</pre> -->

  </section>
</template>