<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import ModalConfirm from '/components/ModalConfirm.vue';
import ModalFileInput from '/components/ModalFileInput.vue';
import { ProjectRecord } from '~/types'
import { sections } from '~/models'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import debounce from '~/lib/debounce'

dayjs.extend(advancedFormat)

// authentication
const apiKey = ref<string | null>('')
apiKey.value = localStorage.getItem('xrpl_map_api_key')

// tooling
const { oruga } = useProgrammatic()
const route = useRoute()
const router = useRouter()

// ui variables
const errorMessage = ref('')
const loaded = ref(false)
const working = ref(false)

// record values
const name = ref('')
const description = ref('')
const section = ref('')
const category = ref('')
const tags = ref<string[]>([])
const allTags = ref([])
const url = ref('')
const grants = ref('No')
const status = ref('')
const accelerator = ref('No')
const thumbnail = ref('')
const launchDate = ref(new Date())
const logo = ref('')
const hideName = ref(false)
const visible = ref(false)

const record = computed(() => {
  return {
    accelerator: accelerator.value,
    category: category.value,
    description: description.value,
    grants: grants.value,
    hideName: hideName.value,
    launchDate: launchDate.value,
    logo: logo.value,
    name: name.value,
    section: section.value,
    status: status.value,
    tags: tags.value,
    thumbnail: thumbnail.value,
    url: url.value,
    visible: visible.value
  }
})


onMounted(async () => {
  await reload()
})

const reload = async () => {
  const fetchResult = await useFetch('/api/projects/' + route.params.slug)
  const recordInfo = fetchResult.data.value as ProjectRecord
  console.log('fetchResult', recordInfo)
  loaded.value = true
  // record.value = recordInfo || {}
  accelerator.value = recordInfo.accelerator || 'No'
  category.value = recordInfo.category
  description.value = recordInfo.description
  grants.value = recordInfo.grants || 'No'
  hideName.value = recordInfo.hideName || false
  launchDate.value = recordInfo.launchDate ? new Date(recordInfo.launchDate) : new Date()
  logo.value = recordInfo.logo
  name.value = recordInfo.name
  section.value = recordInfo.section
  status.value = recordInfo.status
  tags.value = recordInfo?.tags || []
  thumbnail.value = recordInfo.thumbnail
  url.value = recordInfo.url
  visible.value = recordInfo.visible

  const { data: tagsList } = await useFetch('/api/tags')
  if (tagsList.value) {
    // @ts-ignore
    allTags.value = tagsList?.value || []
  }
}

const saveProject = debounce(async () => {
  try {
    working.value = true
    const { data, error }: { data: any, error: any } = await useFetch('/api/projects/' + route.params.slug, {
      headers: {
        'Authorization': `Bearer ${apiKey.value}`
      },
      method: 'PUT',
      body: {
        accelerator,
        category,
        description,
        grants,
        hideName,
        launchDate,
        name,
        section,
        status,
        tags,
        url,
        visible
      }
    })
    if (error.value) {
      throw new Error(error.value.toString())
    }
    oruga.notification.open({
      duration: 3000,
      message: 'Record saved!',
      rootClass: 'toast-notification !bg-black px-4 py-2',
      variant: 'success',
      position: 'top'
    })
    console.log({ data })
    if (data.value.slug !== route.params.slug) {
      router.push(`/admin/${data.value.slug}`)
      return
    }
    await reload()
  } catch (e) {
    console.log(e)
    const message = e instanceof Error ? e.toString() : 'An error occured while saving...'
    oruga.notification.open({
      duration: 5000,
      message,
      rootClass: 'toast-notification',
      variant: 'warning',
      position: 'top'
    })
  } finally {
    working.value = false
  }
}, 1000)

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
      headers: {
        'Authorization': `Bearer ${apiKey.value}`
      },
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
  } catch (e: any) {
    console.error(e)
    let message = 'An error occured while uploading file: ' + e.toString()
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
      headers: {
        'Authorization': `Bearer ${apiKey.value}`
      },
      method: 'DELETE'
    })
    console.log('DELETE', data.value)
    if (data.value === true) {
      oruga.notification.open({
        duration: 5000,
        message: 'Record deleted successfully!',
        rootClass: 'toast-notification !bg-black',
        variant: '',
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

const filteredTags = ref([]);

function getFilteredTags(text: String) {
  filteredTags.value = allTags.value.filter(
    (option: string) => {
      console.log(option, option && option.toLowerCase(), option && option.toLowerCase().includes(text.toLowerCase()))
      return option && option
        .toLowerCase()
        .includes(text.toLowerCase())
    }
  )
    .filter((option: string) => tags.value.indexOf(option) === -1)
  return filteredTags.value
}

const allowNew = ref(false);
const openOnFocus = ref(false);
</script>

<template >
  <div v-if="!apiKey">This page requires authentication. Please reach out to an administrator for access.</div>
  <template v-else>


    <NuxtLink to="/admin"
      class="text-black inline-flex flex-row rounded-full pl-2 pr-4 py-2 bg-dodger-blue-200 hover:bg-dodger-blue-300 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6 mr-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      <span>Admin List</span>
    </NuxtLink>
    <br />
    <br />
    <div class="flex">
      <div>
        <ProjectDetails :item="record" />
        <hr />
        <GridViewItem :item="record" />
      </div>

      <div class="h-[calc(100vh-154px)] overflow-auto mx-4 px-4">
        <div class="rounded-lg bg-gray-100 border-2 border-yellow-950" v-if="loaded">
          <div class="font-title text-xl py-2 px-5 font-bold bg-gray-200 rounded-tr-lg rounded-tl-lg">Edit this record
          </div>

          <section class="p-5">

            <o-field label="Project" message="The unique project name">
              <o-input v-model="name" @change="saveProject"></o-input>
            </o-field>

            <o-field label="Description" message="Please describe the project in as much detail as possible">
              <o-input type="textarea" v-model="description" maxlength="1000" @keyup="saveProject"> </o-input>
            </o-field>

            <o-field label="Section" message="The main section">
              <!-- <o-input v-model="section" maxlength="30"></o-input> -->
              <o-select placeholder="Select a section" v-model="section" @change="saveProject">
                <template v-for="item in sections">
                  <option :value="item.name">{{ item.name }}</option>
                </template>
              </o-select>
            </o-field>

            <o-field label="Category" message="The category or sub-section">
              <!-- <o-input v-model="category" maxlength="30"></o-input> -->
              <o-select placeholder="Select a category" v-model="category" @change="saveProject">
                <template v-for="item in sections.find(f => f.name === section)?.categories">
                  <option :value="item">{{ item }}</option>
                </template>
              </o-select>
            </o-field>

            <o-field label="Tags" message="List tags seperated by a space">
              <!-- <o-input v-model="tags"></o-input> -->
              <o-inputitems v-model="tags" :data="filteredTags" :allow-autocomplete="true" :allow-new="true"
                :open-on-focus="true" field="tag" placeholder="Start typing..." @typing="getFilteredTags"
                @add="saveProject" @remove="saveProject" />

            </o-field>

            <o-field label="Link" message="Link to the project">
              <o-input v-model="url" @change="saveProject"></o-input>
            </o-field>

            <o-field label="Grant Recipient">
              <o-radio v-model="grants" name="grant_recipient" native-value="Yes" @change="saveProject">Yes</o-radio>
              <o-radio v-model="grants" name="grant_recipient" native-value="No" @change="saveProject">No</o-radio>
            </o-field>

            <o-field label="Accelerator Participant">
              <o-radio v-model="accelerator" name="accelerator" native-value="Yes" @change="saveProject">Yes</o-radio>
              <o-radio v-model="accelerator" name="accelerator" native-value="No" @change="saveProject">No</o-radio>
            </o-field>

            <o-field label="Project creation date">
              <o-datepicker v-model="launchDate" :show-week-number="false" locale="en-US" placeholder="Click to select..."
                trap-focus @blur="saveProject">
              </o-datepicker>
              <o-button disabled>{{ dayjs(launchDate).format('MMMM Do YYYY') }}</o-button>
            </o-field>

            <o-field label="Status">
              <o-radio v-model="status" name="status" native-value="Pre-launch" @change="saveProject">Pre-launch</o-radio>
              <o-radio v-model="status" name="status" native-value="Active" @change="saveProject">Active</o-radio>
              <o-radio v-model="status" name="status" native-value="Inactive" @change="saveProject">Inactive</o-radio>
            </o-field>

            <o-field label="Logo">
              <div class="inline-block m-1 border-2 border-grey-300 p-2 bg-grey-50">
                <img v-if="thumbnail" class="w-50  p-0 m-0 " :src="thumbnail" alt="Project thumbnail">
              </div>
              <div class="inline-block m-1 border-2 border-grey-300 p-2 bg-grey-50">
                <img v-if="logo" class="w-50  p-0 m-0 " :src="logo" alt="Project logo">
              </div>
              <!-- <o-button variant="primary" label="Add logo..." @click="uploadImage"></o-button> -->

              <o-upload @change="uploadImage" rounded>
                <o-button tag="a" variant="primary" class="m-1 !rounded-full" rounded>
                  <span>Update logo...</span>
                </o-button>
              </o-upload>
            </o-field>

            <o-field label="Hide Name" message="if the logo already contains the project name, its best to hide it">
              <o-switch v-model="hideName" @change="saveProject">
                {{ hideName }}
              </o-switch>
            </o-field>

            <o-field label="Visible">
              <o-switch v-model="visible" @change="saveProject">
                {{ visible }}
              </o-switch>
            </o-field>

            <br />
            <o-button label="Save Changes" variant="black" @click="saveProject" size="medium" rounded
              :loading="working" />
          </section>
        </div>

        <br />

        <div class="rounded-lg bg-gray-100 border-2 border-yellow-950">
          <div class="font-title text-xl py-2 px-5 font-bold bg-gray-200 rounded-tr-lg rounded-tl-lg">
            Delete this record
          </div>

          <section class="p-5">
            This action cannot be undone.
            <br />
            <br />
            <o-button label="Delete Record..." variant="danger" @click="deleteProject" size="medium" rounded />
          </section>
        </div>
      </div>
    </div>

    <!-- <pre>{{ record }}</pre> -->

  </template>
</template>