<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import ModalConfirm from '/components/ModalConfirm.vue';
import ModalFileInput from '/components/ModalFileInput.vue';
import { ProjectRecord } from '~/types'
import { sections } from '~/lib/vars'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

// tooling
const { oruga } = useProgrammatic()
const route = useRoute()
const router = useRouter()

// ui variables
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
const accelerator = ref('')
const thumbnail = ref('')
const launchDate = ref(new Date())
const logo = ref('')
const visible = ref(false)

onMounted(async () => {
  await reload()
})

const reload = async () => {
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
  accelerator.value = recordInfo.accelerator
  status.value = recordInfo.status
  thumbnail.value = recordInfo.thumbnail
  launchDate.value = recordInfo.launchDate ? new Date(recordInfo.launchDate) : new Date()
  logo.value = recordInfo.logo
  visible.value = recordInfo.visible
  tags.value = recordInfo?.tags.join(' ') || ''
}

const saveProject = async () => {
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
        accelerator,
        launchDate,
        status,
        visible
      }
    })
    await reload()
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

  <div class="font-title text-xl py-2 font-bold">Contribute to the XRPL Ecosystem Map</div>

    <o-field label="Project" message="The unique project name">
      <o-input v-model="name"></o-input>
    </o-field>
    <o-field label="Project" message="The unique project name">
      <o-input v-model="name"></o-input>
    </o-field>
    
  <section v-if="loaded">



    <o-field label="Description" message="Please describe the project in as much detail as possible">
      <o-input type="textarea" v-model="description" maxlength="1000"> </o-input>
    </o-field>

    <o-field label="Section" message="The main section">
      <o-input v-model="section" maxlength="30"></o-input>
      <o-select placeholder="Select a section" v-model="section">
        <template v-for="item in sections">
          <option :value="item.name">{{ item.name }}</option>
        </template>
      </o-select>
    </o-field>

    <o-field label="Category" message="The category or sub-section">
      <o-input v-model="category" maxlength="30"></o-input>
      <o-select placeholder="Select a category" v-model="category">
        <template v-for="item in sections.find(f => f.name === section)?.categories">
          <option :value="item">{{ item }}</option>
        </template>
      </o-select>
    </o-field>

    <o-field label="Tags" message="List tags seperated by a space">
      <o-input v-model="tags"></o-input>
    </o-field>

    <o-field label="Link" message="Link to the project">
      <o-input v-model="url"></o-input>
    </o-field>

    <o-field label="Grant Recipient">
      <o-radio v-model="grants" name="grant_recipient" native-value="Yes">Yes</o-radio>
      <o-radio v-model="grants" name="grant_recipient" native-value="No">No</o-radio>
    </o-field>

    <o-field label="Accelerator Participant">
      <o-radio v-model="accelerator" name="accelerator" native-value="Yes">Yes</o-radio>
      <o-radio v-model="accelerator" name="accelerator" native-value="No">No</o-radio>
    </o-field>

    <o-field label="Project creation date">
      <o-datepicker v-model="launchDate" :show-week-number="false" locale="en-US" placeholder="Click to select..."
        trap-focus>
      </o-datepicker>
      <o-button disabled>{{ dayjs(launchDate).format('MMMM Do YYYY') }}</o-button>
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
    <o-notification class="border-2 border-">Delete the record, this action cannot be undone.
      <br />
      <br />
      <o-button label="Delete Record..." variant="danger" @click="deleteProject" size="medium" />
    </o-notification>

    <!-- <pre>{{ record }}</pre> -->

  </section>
</template>