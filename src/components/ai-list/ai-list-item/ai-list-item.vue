<script setup lang="ts">
withDefaults(defineProps<{
  focused?: boolean;
  hideBorder?: boolean;
  direction?: 'row' | 'column' | 'none';
  gap?: number | string;
  innerClass?: string;
  focusClass?: string;
  focusInnerClass?: string;
  noFocusClass?: string;
  noFocusInnerClass?: string;
}>(), {
  direction: 'row',
  gap: 0,
  noFocusClass: 'hover:bg-white'
})
</script>

<template>
  <div
    class="ai-list-item rounded-xl transition px-5 cursor-pointer"
    :class="[
      {'config-list-item-focused bg-white': focused},
       focused ? focusClass : noFocusClass,
     ]"
  >
    <div
      class="ai-list-item-content w-full py-3 transition text-[13px]"
      :class="[
        {
          'flex justify-between items-center': direction==='row',
          'flex flex-col': direction==='column',
          '!border-0': hideBorder,
        },
        `gap-${gap}`,
        innerClass,
        focused ? focusInnerClass : noFocusInnerClass
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