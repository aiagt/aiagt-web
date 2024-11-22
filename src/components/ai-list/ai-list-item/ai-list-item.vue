<script setup lang="ts">
withDefaults(defineProps<{
  focused?: boolean;
  hideBorder?: boolean;
  direction?: 'row' | 'column' | 'none';
  gap?: number | string;
  innerClass?: string;
  focusClass?: string;
}>(), {
  direction: 'row',
  gap: 0
})
</script>

<template>
  <div
    class="ai-list-item rounded-xl transition px-5 cursor-pointer"
    :class="[{'config-list-item-focused bg-white': focused}, focused ? focusClass : 'hover:bg-white']"
  >
    <div
      class="ai-list-item-content w-full py-3 transition text-gray-800 text-[13px]"
      :class="[
        {
          'flex justify-between items-center': direction==='row',
          'flex flex-col': direction==='column',
          '!border-0': hideBorder,
        },
        `gap-${gap}`,
        innerClass
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style>
.ai-list-item-content {
  @apply border-t border-t-gray-200;
}

.ai-list-item:first-child .ai-list-item-content {
  @apply border-t-transparent;
}


.ai-list-item:hover,
.config-list-item-focused {
  .ai-list-item-content {
    @apply border-transparent;
  }
}

.ai-list-item:hover + .ai-list-item,
.config-list-item-focused + .ai-list-item {
  .ai-list-item-content {
    @apply border-t-transparent;
  }
}
</style>