<script setup lang="ts">
import { computed } from 'vue'
import { asset } from '@/models/assets'

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  round?: string;
  borderSize?: string;
  borderColor?: string;
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
    style="border-style: solid"
  />
  <div v-else v-bind="$attrs" />
</template>

<style scoped>

</style>