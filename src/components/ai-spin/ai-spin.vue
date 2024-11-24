<script setup lang="ts">
defineProps<{
  loading?: boolean
  hideIcon?: boolean
  dot?: boolean
}>()
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-full w-full" v-bind="$attrs">
    <a-spin :hide-icon="hideIcon" :dot="dot" />
  </div>
  <slot v-else />
</template>