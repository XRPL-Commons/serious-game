<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps<{
  name: string
  options: Array<string>
  modelValue: Array<string>
  count: number
}>()
const { name, modelValue, options, count } = toRefs(props)
const emit = defineEmits(['update:modelValue'])

const onChange = (clickedItem: { name: string, selected: boolean } | null, all?: boolean | undefined) => {
  console.log('clickedItem', clickedItem)
  let newValue: Array<string>
  if (clickedItem === null) {
    if (all === true) {
      newValue = ['all']
    } else if (all === false) {
      newValue = []
    } else {
      return
    }
  } else {
    // must deal with all / none
    if (modelValue.value.indexOf(clickedItem.name) !== -1) {
      newValue = modelValue.value.filter(i => i !== clickedItem.name)
    } else {
      modelValue.value.push(clickedItem.name)
      newValue = modelValue.value
    }
  }
  console.log({ newValue })
  emit('update:modelValue', newValue)
}

const localOptions = computed(() => {
  return options.value.map(o => ({
    name: o,
    selected: (modelValue.value.indexOf('all') !== -1) || (modelValue.value.indexOf(o) !== -1)
  }))
})
</script>

<template>
  <o-dropdown aria-role="list" class="mr-4" :scrollable="true">
    <template #trigger="{ active }">
      <span variant=""
        class="flex flex-rows cursor-pointer scale-90 hover:scale-100 transition-all duration-500 hover:text-spring-green-700"
        :class="{ 'scale-100': active, 'text-spring-green-700': active, 'text-spring-green-600': modelValue.indexOf('all') === -1 }">
        <!-- <span v-if="count" class="bg-black rounded-full text-ecru-white-50 py-1 px-2 mr-1 text-xs inline-block">{{count}}</span> -->
        <span class="pr-2">{{ name }}</span>
        <template v-if="!active">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

        </template>
        <template v-else> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </template>
      </span>
    </template>

    <o-dropdown-item aria-role="listitem" @click="onChange(null, true)" :value="null">
      <div class="flex flex-cols">
        <span class="w-4 h-4 text-ecru-white-900 mr-2"></span>
        <span>Select all</span>
      </div>
    </o-dropdown-item>
    <o-dropdown-item aria-role="listitem" @click="onChange(null, false)" :value="null">
      <div class="flex flex-cols">
        <span class="w-4 h-4 text-ecru-white-900 mr-2"></span>
        <span>Unselect all</span>
      </div>
    </o-dropdown-item>
    <template v-for="item in localOptions">

      <o-dropdown-item aria-role="listitem" @click="onChange(item)" :value="null">
        <div class="flex flex-cols">
          <span class="w-4 h-4 text-ecru-white-900 mr-2">
            <svg v-if="item.selected" width="20" height="20" viewBox="0 0 23 23" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <!-- <path
                d="M21.7072 11.6117C21.7072 17.3753 17.2046 21.9885 11.722 21.9885C6.23939 21.9885 1.73676 17.3753 1.73676 11.6117C1.73676 5.84811 6.23939 1.23492 11.722 1.23492C17.2046 1.23492 21.7072 5.84811 21.7072 11.6117Z"
                stroke="#444" stroke-width="1.95789" /> -->
              <path d="M8.04102 10.5153L11.22 13.3113L16.2641 8.24411" stroke="#444" stroke-width="1.95789"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </span>
          <span>{{ item.name }}</span>
        </div>
      </o-dropdown-item>
    </template>
  </o-dropdown>
  <!-- <div>{{ localOptions }}</div> -->
</template>