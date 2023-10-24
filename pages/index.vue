<script setup lang="ts">
import { computed, ref } from 'vue'
import { ProjectRecord } from '~/types'
import { sections, grants, statuses } from '~/lib/vars'
import { report } from 'process';

const search = ref('')

const localRecords = ref<Array<ProjectRecord>>([])
const selectedTags = ref<Array<string>>(['all'])
const selectedStatus = ref<Array<string>>(['Pre-launch', 'Active'])
const selectedGrants = ref<Array<string>>(['Yes', 'No'])

const filterTags = ref<Array<string>>([])
const filterStatus = ref<Array<string>>(statuses)
const filterGrants = ref<Array<string>>(grants)

const categoriesBySection = ref({})
const projectsByCategoryBySection = ref({})


const loadRecords = async () => {
  const queryString = `?tags=${selectedTags.value.join(',')}` +
    '&status=' + selectedStatus.value.join(',') +
    '&grants=' + selectedGrants.value.join(',')
  const fetchResult = await useFetch(`/api/projects${queryString}`)
  const records = fetchResult.data.value as Array<ProjectRecord>

  localRecords.value = records

  // filterTags
  // @ts-ignore
  const fTags: Array<string> = [...new Set(records.reduce((r, i) => [...r, ...(i.tags || [])], []))].sort().filter(i => i !== '')
  filterTags.value = fTags
}
const projectsByCategory = computed(() => {
  const records = localRecords.value

  .filter(r => {
    if (search) {
      return `${r.name}${r.tags}`.toLowerCase().includes(search.value.toLowerCase())
    } else {
      return true
    }
})
  .filter(r => {
    if (!selectedStatus.value.includes('all') && !selectedStatus.value.includes(r.status)) {
      return false
    }
    if (!selectedGrants.value.includes('all') && !selectedGrants.value.includes(r.grants)) {
      return false
    }
    if (!selectedTags.value.includes('all')) {
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

    return true
  })

  const report: any = []
  Object.values(sections).forEach(section => {

    const categories = section.categories.map(categoryName => {
      return {
        name: categoryName,
        projects: records.filter(r => r.section === section.name && r.category === categoryName)
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
  <div class="flex justify-end items-center fixed w-full z-20 backdrop-blur-md bg-white-100/75 shadow shadow-gray-200 pr-6 py-2 left-[-0.5rem] bg-ecru-white-50/25">
    <DropDownSelector v-model="selectedTags" name="Tags" :options="filterTags" :count="selectedTags && selectedTags.length"/>
    <DropDownSelector v-model="selectedGrants" name="Grants" :options="filterGrants" />
    <DropDownSelector v-model="selectedStatus" name="Project Status" :options="filterStatus" />
    <!-- <div>{{ selectedTags }} {{ selectedGrants }} {{ selectedStatus }}</div> -->
    <input placeholder="Search..." v-model="search" type="search" icon="search" class="px-4 py-2 text-sm rounded-full"/>  
  </div>
  <div class="pt-[3rem]"></div>
  <template v-for="section in projectsByCategory">
    <div class="text-2xl bg-yellow-200 mt-4 p-2 rounded-md mb-4">{{ section.name }}</div>
    <div class="text-gray-900 align-top relative">
      <template v-for="category in section.categories">
        <GridView v-if="category.projects && category.projects.length > 0" :projects="category.projects"
          :category="category.name" :color="section.primaryColor" :textColor="section.textColor" />
      </template>
    </div>
  </template>
  <span class="bg-dodger-blue" />
</template>
