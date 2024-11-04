<script setup lang="ts">
import { Time } from '@/models/base'
import { useRouter } from 'vue-router'

defineProps<{
  id: number
  name: string
  logo: string
  time: Time
  description: string
  labels: {
    id: number
    text: string
  }[]
  link: string
}>()

const router = useRouter()
</script>

<template>
  <div
    class="flex flex-col justify-between gap-7 border border-gray-200 rounded-xl p-5 hover:text-blue-700 hover:border-blue-700 hover:border-2 cursor-pointer transition duration-300"
    @click="router.push({path: link})"
  >
    <div class="flex flex-col gap-2.5">
      <div class="flex gap-2.5 items-center">
        <img :src="logo" :alt="name" class="w-10">
        <div class="flex flex-col">
          <div class="text-xl font-medium">{{ name }}</div>
          <div class="text-gray-400 text-xs scale-90 origin-bottom-left">{{ time?.string() }}</div>
        </div>
      </div>
      <div
        class="font-normal text-gray-800 line-2"
        style="font-size: 0.75rem; line-height: 1.2rem"
      >
        {{ description }}
      </div>
    </div>

    <div class="flex flex-wrap gap-1">
      <div
        v-for="label of labels"
        :key="label.id"
        class="rounded bg-gray-100 text-xs px-1.5 py-0.5 scale-90 text-gray-700"
      >
        {{ label.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>