<script setup lang="ts">
import { useHomeStore } from '@/store/home.ts'
import { usePersonalStore } from '@/store/personal.ts'
import Application from '@v/personal/application.vue'
import Plugin from '@v/personal/plugin.vue'
import { eq } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const homeStore = useHomeStore()
const personalStore = usePersonalStore()

homeStore.focusTabByName('Personal')
</script>

<template>
  <div class="flex flex-col px-8 py-4 items-center h-full">
    <div class="w-full py-4 flex-1">
      <router-view />
    </div>

    <div
      class="flex gap-1 bg-[#cdccdf] p-1 rounded-full"
      style="background: #f6f5f6"
    >
      <button
        v-for="(tab, i)  of personalStore.tabs"
        class="rounded-full px-6 py-1.5 text-sm font-normal transition duration-300 hover:bg-white flex gap-1.5 items-center justify-center"
        :class="{'border border-blue-700 bg-white text-black font-medium': tab.focused}"
        @click="router.push(tab.link)"
      >
        {{ tab.title }}
      </button>
    </div>
  </div>
</template>