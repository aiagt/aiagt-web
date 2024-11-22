<script setup lang="ts">
import { withDefaults } from 'vue'

withDefaults(defineProps<{
  type?: 'normal' | 'primary' | 'text',
  size?: 'small' | 'medium',
  text?: string,
  bold?: boolean,
}>(), {
  type: 'primary',
  size: 'small'
})
</script>

<template>
  <button
    :class="{
      'text-gray-600 border border-gray-200 bg-white hover:bg-gray-100 active:bg-gray-200': type === 'normal',
      'text-white bg-blue-700 hover:bg-blue-600 active:bg-blue-800': type === 'primary',
      'text-gray-600 bg-transparent hover:bg-gray-100 active:bg-gray-300': type === 'text',
      'text-xs !py-1': size === 'small',
      'text-[14px]': size === 'medium',
      'font-medium': bold,
      '!px-1.5': !text?.length
    }"
    class="px-3 py-1.5 rounded-lg transition flex items-center gap-1"
  >
    <slot></slot>
    <slot name="text">
      {{ text }}
    </slot>
  </button>
</template>