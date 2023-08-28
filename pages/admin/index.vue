<script setup lang="ts">
import { computed } from 'vue'
const { data } = await useFetch('/api/projects')

const columns = ref([
  {
    field: '_id',
    label: 'ID',
    width: '40',
    numeric: true
  },
  {
    field: 'Project',
    label: 'Project',
    searchable: true
  },
  {
    field: 'Section',
    label: 'Section',
    searchable: true
  },
  {
    field: 'Category',
    label: 'Category',
    position: 'centered',
    searchable: true
  },
  {
    field: 'Tags',
    label: 'Tags'
  }
])

const selectProject = (row) => {
  console.log({ row })
  const router = useRouter()
  router.push({ path: `/admin/${row._id}` });
}

</script>

<template>
  <o-table :data="data" @select="selectProject" v-if="data">
    <o-table-column v-for="column in columns" v-bind="column" #default="props">
      {{ props?.row[column.field] }}
    </o-table-column>
  </o-table>
</template>
