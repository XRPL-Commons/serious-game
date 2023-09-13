<script setup lang="ts">
import { computed } from 'vue'
import { useProgrammatic } from '@oruga-ui/oruga-next'
import ModalInput from '/components/ModalInput.vue'

const { oruga } = useProgrammatic()
const { data } = await useFetch('/api/projects')

interface recordType {
  thumbnail: string,
  name: string,
  section: string,
  category: string,
  tags: [string],
  slug: string
}
const dataSource = computed(() => {
  const dataItems = JSON.parse(JSON.stringify(data.value))
  return dataItems.map((record: recordType) => ({
    thumbnail: record.thumbnail || '',
    name: record.name,
    section: record.section || '',
    category: record.category || '',
    tags: record.tags || [],
    slug: record.slug
  }))
})
const router = useRouter()

const columns = ref([
  {
    field: 'thumbnail',
    label: 'Thumb'
  },
  {
    field: 'name',
    label: 'Project',
    searchable: true
  },
  {
    field: 'section',
    label: 'Section',
    searchable: true
  },
  {
    field: 'category',
    label: 'Category',
    position: 'centered',
    searchable: true
  },
  {
    field: 'tags',
    label: 'Tags'
  }
])

interface selectRow {
  slug: string
}
const selectProject = ({ slug }: selectRow) => {
  console.log({ slug })
  const router = useRouter()
  router.push({ path: `/admin/${slug}` });
}

interface createProjectParams {
  Project: string | boolean
}
interface ModalInputResult {
  value: string
}
const createProject = async ({ Project = false }: createProjectParams) => {
  if (!Project) {
    oruga.modal.open({
      component: ModalInput,
      props: {
        title: 'Create New Project',
        message: 'Please provide a unique name for the project.',
        confirmText: 'Create record',
        type: 'success'
      },
      events: {
        'confirm': async ({ value: Project }: ModalInputResult) => {
          console.log({ Project })
          createProject({ Project })
        },
        'close': () => { }
      },
      trapFocus: true
    })
    return
  }
  try {
    const { error, data } = await useFetch('/api/projects/', {
      method: 'POST',
      body: {
        projectName: Project
      }
    })
    if (error.value) {
      throw createError(error.value.message)
    }
    oruga.notification.open({
      message: 'Record creation successfull!',
      rootClass: 'toast-notification',
      variant: 'success',
      position: 'top'
    })
    console.log(data.value)
    // @ts-ignore
    router.push({ path: `/admin/${data.value?.slug}` })

  } catch (e) {
    let message = "An error occured while creating the record"
    if (e instanceof Error) {
      message = e.message
    }
    oruga.notification.open({
      message,
      rootClass: 'toast-notification',
      variant: 'danger',
      position: 'top'
    })
  }
}

</script>

<template>
  <o-button label="Create Record" @click="createProject" />
  <!-- <o-table :data="dataSource" @select="selectProject" v-if="data">
    <o-table-column v-for="column in columns" v-bind="column" #default="props">
      <template v-if="column.field === 'thumbnail'">
        <img :src="props.row.thumbnail" class="w-[40px]">
      </template>
      <template v-else-if="column.field === 'tags' && props.row.tags">
        <template v-for="tag in props.row.tags.split(' ')">
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{
            tag }}</span>
        </template>
      </template>
      <template v-else>{{ props?.row[column.field] }}</template>
      {{ props?.row[column.field] }}
    </o-table-column>
  </o-table> -->
  <o-table :data="dataSource" @select="selectProject" v-if="data">
    <o-table-column field="thumbnail" label="Thumb" v-slot="props">
      <img :src="props.row.thumbnail" class="w-[40px]">
    </o-table-column>
    <o-table-column field="name" label="Project" :searchable="true" v-slot="props">
      {{ props.row.name }}
    </o-table-column>
    <o-table-column field="section" label="Section" :searchable="true" v-slot="props">
      {{ props.row.section }}
    </o-table-column>
    <o-table-column field="category" label="Category" :searchable="true" v-slot="props">
      {{ props.row.category }}
    </o-table-column>
    <o-table-column field="tags" label="Tags" :searchable="true" v-slot="props">
      <template v-for="tag in props.row.tags">
        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{
          tag }}</span>
      </template>
    </o-table-column>
  </o-table>
</template>
