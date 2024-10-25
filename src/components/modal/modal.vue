<script setup lang="ts">
defineProps({
  ...{
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    btnCancelText: {
      type: String,
      default: 'Cancel'
    },
    btnConfirmText: {
      type: String,
      default: 'Confirm'
    },
    allowConfirm: {
      type: Boolean,
      default: true
    },
    width: {
      type: [Number, String],
      default: 420
    }
  }
})

const emits = defineEmits(['update:visible', 'cancel', 'confirm'])

function changeVisible(v: boolean) {
  emits('update:visible', v)
}
</script>

<template>
  <a-modal
    :visible="visible"
    @update:visible="changeVisible"
    :width="width"
    @cancel="emits('cancel')"
    @ok="emits('confirm')"
  >
    <template #title>
      <slot name="header">
        <div class="text-black text-lg font-medium w-full">
          {{ title }}
        </div>
      </slot>
    </template>
    <template #footer>
      <slot name="footer">
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-1.5 border border-gray-300 rounded-md text-gray-500 text-sm font-normal"
            @click="() => {changeVisible(false); emits('cancel')}"
          >
            {{ btnCancelText }}
          </button>
          <button
            class="px-4 py-1.5 bg-blue-700 rounded-md text-white text-sm font-normal"
            @click="() => {if (allowConfirm) {changeVisible(false); emits('confirm')}}"
            :class="{'!bg-blue-500 !cursor-not-allowed': !allowConfirm}"
          >
            {{ btnConfirmText }}
          </button>
        </div>
      </slot>
    </template>
    <slot></slot>
  </a-modal>
</template>

<style>
.arco-modal {
  @apply rounded-2xl;
}

.arco-modal-header {
  @apply py-5;
  border-bottom: unset;
  height: unset;
}

.arco-modal-footer {
  @apply py-5;
  border-top: unset;
}

.arco-modal-body {
  @apply px-5 py-0 overflow-y-auto;
  max-height: 83.3%;
}
</style>