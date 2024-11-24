<script setup lang="ts">
import { computed } from 'vue'
import { asset } from '@/models/assets'

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
}>(), {})

const src = computed(() => {
  return asset(props.src)
})
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    v-if="src?.length"
    v-bind="$attrs"
  />
  <div v-else v-bind="$attrs" />
</template>

<style scoped>

</style>