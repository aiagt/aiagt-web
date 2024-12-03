<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
  hideIcon?: boolean
  class?: string
  dot?: boolean
}>()
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-full w-full" :class="props.class">
    <a-spin :hide-icon="hideIcon" :dot="dot" />
  </div>
  <slot v-else />
</template>