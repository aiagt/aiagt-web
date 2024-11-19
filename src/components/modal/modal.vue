<script setup lang="ts">
import { CSSProperties } from 'vue'

withDefaults(defineProps<{
  title?: string;
  visible?: boolean;
  btnCancelText?: string;
  btnConfirmText?: string;
  allowConfirm?: boolean;
  width?: number | string;
  small?: boolean;
  modalClass?: string;
  modalStyle?: CSSProperties;
  hideFooter?: boolean;
}>(), {
  title: '',
  visible: false,
  btnCancelText: 'Cancel',
  btnConfirmText: 'Confirm',
  allowConfirm: true,
  width: 420,
  small: false,
  modalClass: '',
  hideFooter: false
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
    :modal-class="modalClass"
    :modal-style="modalStyle"
    @cancel="emits('cancel')"
    @ok="emits('confirm')"
    :footer="!hideFooter"
  >
    <template #title>
      <slot name="header">
        <div class="text-black text-lg font-medium w-full" :class="{'!text-[16px]': small}">
          {{ title }}
        </div>
      </slot>
    </template>
    <template #footer>
      <slot name="footer">
        <div class="flex justify-between items-center">
          <slot name="footer-extend">
            <div></div>
          </slot>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-500 text-sm font-normal hover:bg-gray-100 active:bg-gray-300 transition duration-300"
              :class="{'!px-3 !py-1.5 !text-xs': small}"
              @click="() => {changeVisible(false); emits('cancel')}"
            >
              {{ btnCancelText }}
            </button>
            <button
              class="px-4 py-1.5 bg-blue-700 rounded-lg text-white text-sm font-normal hover:bg-blue-600 active:bg-blue-800 transition duration-300"
              @click="() => {if (allowConfirm) {changeVisible(false); emits('confirm')}}"
              :class="{'!px-3 !py-1.5 !text-xs': small, '!bg-blue-500 !cursor-not-allowed': !allowConfirm}"
            >
              {{ btnConfirmText }}
            </button>
          </div>
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