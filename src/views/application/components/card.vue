<script setup lang="ts">
import { App, AppLabel } from '@/models/app'
import AiImage from '@c/ai-image/ai-image.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  app: App
}>()

const router = useRouter()

const showLabels = computed(() => {
  if (props.app.labels?.length > 2) {
    return [...props.app.labels.slice(0, 2), { text: `+${props.app.labels.length - 2}` } as AppLabel]
  }
  return props.app.labels
})
</script>

<template>
  <div
    class="flex flex-col gap-2 p-4 rounded-2xl border border-[#e3e3e3] cursor-pointer transition hover:shadow-lg hover:shadow-[#eeeeee]"
    @click="router.push(`/app/${app.id}`)"
  >

    <div class="flex items-center gap-2 h-11">
      <ai-image :src="app.logo" :alt="app.name" class="w-11 h-11 border border-[#f2f2f2] rounded-xl" />

      <div class="flex flex-col gap-1.5">
        <div class="font-medium text-gray-700">{{ app.name }}</div>
        <div class="flex gap-1 overflow-hidden whitespace-nowrap max-w-48">
          <div
            v-for="label of showLabels"
            class="text-[10px] text-blue-800 bg-[#E8EDFB] rounded-sm px-1 py-0.5 shrink-0"
          >
            {{ label.text }}
          </div>
        </div>
      </div>
    </div>

    <div class="h-12">
      <div class="text-xs !text-[11px] text-gray-500 line-2">
        {{ app.description }}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <ai-image :src="app.author?.avatar" class="w-3 h-3 rounded-full" />
      <div class="text-gray-500 text-xs">
        {{ app.author?.username }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>