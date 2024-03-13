<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProjectRecord } from '@/types'
import { sections, grants, statuses } from '@/models'

const records = inject('records', [])
const tags = inject('tags', [])

const { searchQuery = ref('') } = inject('globalSearchModal', { searchQuery: ref('') })

const localRecords = ref<Array<ProjectRecord>>([])
const selectedTags = ref<Array<string>>([])
const selectedStatus = ref<Array<string>>([])
const selectedGrants = ref<Array<string>>([])
const selectedSections = ref<Array<string>>([])
const selectedCategories = ref<Array<string>>([])

const queryParams = computed(() => {
  const route = useRoute();
  const params = route.query;
  selectedTags.value = params.tags ? (Array.isArray(params.tags) ? params.tags.map(String) : [String(params.tags)]) : [];
  selectedStatus.value = params.status ? (Array.isArray(params.status) ? params.status.map(String) : [String(params.status)]) : [];
  selectedGrants.value = params.grants ? (Array.isArray(params.grants) ? params.grants.map(String) : [String(params.grants)]) : [];
  selectedSections.value = params.sections ? (Array.isArray(params.sections) ? params.sections.map(String) : [String(params.sections)]) : [];
  selectedCategories.value = params.categories ? (Array.isArray(params.categories) ? params.categories.map(String) : [String(params.categories)]) : [];
  searchQuery.value = typeof params.search === 'string' ? params.search : ''
  return params;
})
const filterTags = ref<Array<string>>([])
const filterStatus = ref<Array<string>>(statuses)
const filterGrants = ref<Array<string>>(grants)

const categoriesBySection = ref({})
const projectsByCategoryBySection = ref({})

const loadRecords = async () => {
  const queryString = `?tags=${selectedTags.value.join(',')}` +
    '&status=' + selectedStatus.value.join(',') +
    '&grants=' + selectedGrants.value.join(',')
  const fetchResult = await useFetch(`/api/projects`)
  const records = fetchResult.data.value as unknown as Array<ProjectRecord> || []

  localRecords.value = records

  // filterTags
  // @ts-ignore
  const fTags: Array<string> = [...new Set(records.reduce((r, i) => [...r, ...(i.tags || [])], []))].sort().filter(i => i !== '')
  filterTags.value = fTags
}
// const searchRecords = computed(() => {
//   return records.filter((record: ProjectRecord) => {
//     const query = searchQuery.value.toLowerCase();
//     return record.name.toLowerCase().includes(query) || (record.tags || []).some(tag => tag.toLowerCase().includes(query));
//   }).slice(0, 10)
// })
const projectsByCategory = computed(() => {
  const projects = (records || [])
    .filter((r: ProjectRecord) => {
      if (searchQuery.value) {
        return `${r.name}${r.tags && r.tags.join(' ')}`.toLowerCase().includes(searchQuery.value.toLowerCase());
      } else {
        return true
      }
    })
    .filter((r: ProjectRecord) => {
      if (selectedStatus.value.length > 0 && !selectedStatus.value.includes(r.status)) {
        return false
      }
      if (selectedGrants.value.length > 0 && !selectedGrants.value.includes(r.grants)) {
        return false
      }
      if (selectedTags.value.length > 0) {
        if (!r.tags || !Array.isArray(r.tags)) {
          return false
        }
        // we need at least one match
        for (let n = 0; n < r.tags.length; n++) {
          const tag = r.tags[n]
          // console.log(selectedTags.value, 'maybe includes', tag, selectedTags.value.includes(tag))
          if (selectedTags.value.includes(tag)) {
            return true
          }
        }
        return false
      }
      if (selectedSections.value.length > 0 && !selectedSections.value.includes(r.section)) {
        console.log(r, selectedSections.value)
        return false
      }

      if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(r.category)) {
        return false
      }

      return true
    })

  const report: any = []
  Object.values(sections).forEach(section => {

    const categories = section.categories.map(categoryName => {
      return {
        name: categoryName,
        projects: projects.filter((r: ProjectRecord) => r.section === section.name && r.category === categoryName)
      }
    })
    report.push({
      name: section.name,
      primaryColorName: section.primaryColorName,
      primaryColor: section.primaryColor,
      textColor: section.textColor,
      categories
    })
  })
  return report

})
onMounted(async () => {
  await loadRecords()
})
</script>

<template>
  <div class="text-xs absolute inline-block bg-slate-100/80 dark:bg-gray-700/80 p-4 right-0 text-black dark:text-white">
    <div><strong class="text-black dark:text-white">Tags:</strong> {{ selectedTags }}</div>
    <div><strong class="text-black dark:text-white">Status:</strong> {{ selectedStatus }}</div>
    <div><strong class="text-black dark:text-white">Grants:</strong> {{ selectedGrants }}</div>
    <div><strong class="text-black dark:text-white">Sections:</strong> {{ selectedSections }}</div>
    <div><strong class="text-black dark:text-white">Categories:</strong> {{ selectedCategories }}</div>
    {{ queryParams }}
  </div>
  <div
    class="flex justify-end items-center w-full left-[-0.5rem] bg-ecru-white-50/25 dark:bg-gray-800 text-black dark:text-white">


    <!-- <DropDownSelector v-model="selectedTags" name="Tags" :options="filterTags"
      :count="selectedTags && selectedTags.length" />
    <DropDownSelector v-model="selectedGrants" name="Grants" :options="filterGrants" :count="0" />
    <DropDownSelector v-model="selectedStatus" name="Project Status" :options="filterStatus" :count="0" /> -->
    <!-- <div>{{ selectedTags }} {{ selectedGrants }} {{ selectedStatus }}</div> -->
    <!-- <input placeholder="Search..." v-model="search" type="search" icon="search" class="px-4 py-2 text-sm rounded-full" /> -->
    <!-- <UContainer>
      <UFormGroup label="Tags">
        <USelectMenu v-model="selectedTags" :options="filterTags" multiple placeholder="Select people" variant="none"
          :ui="{ rounded: 'rounded-md' }">
          <template #label>
            <span v-if="selectedTags.length" class="truncate">{{ selectedTags.join(', ') }}</span>
            <span v-else>Select Tags</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup name="toto" label="TaGrantsgs">
        <USelectMenu v-model="selectedGrants" :options="filterGrants" multiple placeholder="Select grants" variant="none"
          :ui="{ rounded: 'rounded-md' }">
          <template #label>
            <span v-if="selectedGrants.length" class="truncate">{{ selectedGrants.join(', ') }}</span>
            <span v-else>Select Grants</span>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UChip :text="selectedStatus && selectedStatus.length || null" size="2xl">
        <USelectMenu v-model="selectedStatus" :options="filterStatus" multiple placeholder="Select people" variant="none"
          :ui="{ rounded: 'rounded-md' }">
          <template #label>
            <span v-if="selectedStatus.length" class="truncate">{{ selectedStatus.join(', ') }}</span>
            <span v-else>Select people</span>
          </template>
        </USelectMenu>
      </UChip>
      <UFormGroup label="Email" description="We'll only use this for spam.">
        <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false" v-model="search"
          variant="none" :ui="{ rounded: 'rounded-md' }" placeholder="Search..." />
      </UFormGroup>
    </UContainer> -->
  </div>

  <div class="pt-[3rem]"></div>
  <template v-for="section in projectsByCategory">
    <div class="text-2xl bg-yellow-200 mt-4 p-0 px-4 min-[420px]:p-2 rounded-md mb-4">{{ section.name }}</div>
    <div class="text-gray-900 align-top relative">
      <template v-for="category in section.categories">
        <GridView v-if="category.projects && category.projects.length > 0" :projects="category.projects"
          :category="category.name" :color="section.primaryColor" :textColor="section.textColor" />
      </template>
    </div>
  </template>
  <span class="bg-dodger-blue" />
</template>
