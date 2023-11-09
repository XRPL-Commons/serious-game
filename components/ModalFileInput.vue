<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['title', 'message', 'projectId', 'cancelText', 'confirmText', 'type', 'projectId'])
const { title, message, projectId } = toRefs(props)
const emit = defineEmits(['confirm', 'close'])
const file = ref<File | null>(null)
const confirmFile = async () => {
  console.log(file.value, file.value?.name)

  if (file.value) {
    const formData = new FormData()
    formData.append('file.txt', file.value)
    // axios.post('https://httpbin.org/post', formData, { headers }).then((res) => {
    //   res.data.files; // binary representation of the file
    //   res.status; // HTTP status
    // });
    const response = await useFetch(`/api/projects/${props.projectId}/media`, {
      method: 'POST',
      body: file
    })
    // emit('confirm', { file: formData })
    // emit('close')
  }
}

const onChange = async (e: any) => {
  const files = e.target.files;
  const formData = new FormData();
  formData.append('file', files[0]);
  file.value = files[0]
  console.log(files[0], file.value)
  await useFetch(`/api/projects/${props.projectId}/media`, {
    method: 'post',
    body: formData,
  });
};
</script>
<template>
  <form @submit.prevent="confirmFile">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <div>{{ message }}</div>
        <o-upload @change="onChange">
          <o-button tag="a" variant="primary">
            <span>Click to upload</span>
          </o-button>
        </o-upload>
        <!-- <input type="file" name="file" @change="onChange"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" /> -->
        <span v-if="file">
          {{ file.name }}
        </span>
      </section>
      <footer class="modal-card-foot">
        <o-button :label="cancelText || 'Cancel'" @click="$emit('close')" rounded />
        <o-button :variant="type || 'primary'" :label="confirmText || 'OK'" type="is-primary" @click="confirmFile"
          rounded />
      </footer>
    </div>
  </form>
</template>
