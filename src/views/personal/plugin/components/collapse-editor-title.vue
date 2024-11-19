<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  allowEdit?: boolean
  fixedState?: 'edit' | 'buttons'
}>()

const allowEdit = ref(props.allowEdit)
const emits = defineEmits(['update:allowEdit', 'cancel', 'save', 'click_edit'])
</script>

<template>
  <div class="w-full flex-1 flex items-center justify-between">
    <div class="font-medium text-sm">{{ title }}</div>
    <button
      class="text-blue-700 p-1 rounded-lg hover:bg-gray-100 text-xs font-medium"
      @click.stop="allowEdit=true; emits('update:allowEdit', allowEdit); emits('click_edit')"
      v-if="fixedState == 'edit' || !allowEdit"
    >
      <icon-edit />
      Edit
    </button>
    <div class="flex gap-3" v-else>
      <button
        class="bg-white border text-xs py-1 px-2 rounded-lg hover:bg-gray-100 active:bg-gray-300 transition duration-300"
        @click.stop="allowEdit=false; emits('update:allowEdit', allowEdit); emits('cancel')">Cancel
      </button>
      <button
        class="bg-blue-700 text-white text-xs py-1 px-2 rounded-lg hover:bg-blue-600 active:bg-blue-800 transition duration-300"
        @click.stop="allowEdit=false; emits('update:allowEdit', allowEdit); emits('save')"
      >
        Save
      </button>
    </div>
  </div>
</template>