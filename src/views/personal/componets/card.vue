<script setup lang="ts">
import { Time } from '@/models/base'
import { useRouter } from 'vue-router'
import { asset } from '@/models/assets'

defineProps<{
  id?: BigInt
  name?: string
  logo?: string
  time?: Time
  description?: string
  labels?: {
    id: BigInt
    text: string
  }[]
  link?: string
  link2?: string
}>()

const router = useRouter()
</script>

<template>
  <div
    class="flex flex-col justify-between gap-7 border rounded-lg p-5 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-100 personal-card"
    @click="router.push({path: link})"
  >
    <slot>
      <div class="flex flex-col gap-2.5">
        <div class="flex gap-2.5 items-center">
          <img :src="asset(logo)" :alt="name" class="w-11 h-11 bg-white rounded-lg">
          <div class="flex flex-col">
            <div class="text-lg font-medium">{{ name }}</div>
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

      <div class="flex justify-between items-center">
        <div class="flex flex-wrap gap-1">
          <div
            v-for="label of labels"
            :key="label.id.toString()"
            class="rounded bg-gray-100 text-xs px-1.5 py-0.5 scale-90 text-gray-700"
          >
            {{ label.text }}
          </div>
        </div>
        <div
          class="personal-card-chat hidden items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium text-blue-600"
          v-if="link2"
          @click.stop="router.push({path: link2})"
        >
          <icon-robot :stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
          chat
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.personal-card:hover {
  .personal-card-chat {
    display: flex;
  }
}
</style>