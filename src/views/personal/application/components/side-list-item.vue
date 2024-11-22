<script setup lang="ts">
import AiListItem from '@c/ai-list/ai-list-item/ai-list-item.vue'
import { ref } from 'vue'

const props = defineProps<{
  defaultShowInner?: boolean
  disabled?: boolean
}>()

const showInner = ref(props.defaultShowInner)
</script>

<template>
  <ai-list-item
    class="!rounded-lg !px-1 hover:!bg-[#eeeeee] side-list-item"
    inner-class="px-1 py-3"
    :class="{'!cursor-not-allowed': disabled}"
  >
    <div class="flex flex-col gap-2 w-full">
      <div class="flex items-center gap-2">
        <div @click.stop="showInner = !disabled && !showInner">
          <icon-right v-show="!showInner" />
          <icon-down v-show="showInner" />
        </div>
        <slot />
      </div>
      <div v-show="showInner">
        <slot name="inner" />
      </div>
    </div>
  </ai-list-item>
</template>

<style>
.side-list-item:last-child .ai-list-item-content {
  @apply border-b;
}
</style>