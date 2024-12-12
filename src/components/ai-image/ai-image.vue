<script setup lang="ts">
import { computed, ref } from 'vue'
import { asset } from '@/models/assets'

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  round?: string;
  borderSize?: string;
  borderColor?: string;
  allowPreview?: boolean;
}>(), {})

const src = computed(() => {
  return asset(props.src)
})

const showPreview = ref(false)
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    v-if="src?.length"
    v-bind="$attrs"
    style="border-style: solid"
    :class="{'cursor-pointer': allowPreview}"
    @click="() => { if (allowPreview) showPreview = true }"
  />
  <div v-else v-bind="$attrs" />
  <a-image-preview
    :src="src"
    v-model:visible="showPreview"
  />
</template>

<style scoped>

</style>