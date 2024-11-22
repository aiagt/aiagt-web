<script setup lang="ts">
import { useHomeStore } from '@/store/home.ts'
import { usePersonalStore } from '@/store/personal.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const homeStore = useHomeStore()
const personalStore = usePersonalStore()

document.title = 'Personal - Aiagt'
homeStore.focusTabByName('Personal')
</script>

<template>
  <div class="flex flex-col px-6 py-2 items-center h-full overflow-y-auto">
    <div class="w-full py-4 flex-1">
      <router-view />
    </div>

    <div
      class="sticky bottom-0 flex gap-1 p-1 rounded-full shadow-lg shadow-gray-200 bg-white border-[0.5px]"
    >
      <button
        v-for="tab  of personalStore.tabs"
        class="rounded-full px-6 py-1.5 text-sm font-normal transition duration-300 hover:bg-[#eaedf7] hover:text-blue-600 flex gap-1.5 items-center justify-center"
        :class="{'border border-blue-500 bg-[#eaedf7] !text-blue-600 !font-medium': tab.focused, '!cursor-not-allowed': tab.link == '#'}"
        @click="router.push(tab.link)"
      >
        {{ tab.title }}
      </button>
    </div>
  </div>
</template>