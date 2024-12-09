<script setup lang="ts">
import AiListItem from '@c/ai-list/ai-list-item/ai-list-item.vue'

withDefaults(
  defineProps<{
    text: string;
    focused?: boolean;
    focusClass?: string;
    focusInnerClass?: string;
  }>(),
  {
    focusClass: '!bg-[#dfe6fb]',
    focusInnerClass: '!text-blue-700'
  }
)
</script>

<template>
  <ai-list-item
    hide-border
    class="!rounded-lg !px-4"
    inner-class="min-w-32 !text-[13px] text-gray-600 !py-2.5"
    :focus-class="focusClass"
    :focus-inner-class="focusInnerClass"
    no-focus-class="hover:bg-gray-100"
    :focused="focused"
  >
    {{ text }}
  </ai-list-item>
</template>