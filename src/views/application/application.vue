<script setup lang="ts">
import { useHomeStore } from '@/store/home.ts'
import { App } from '@/models/app'
import { reactive, ref } from 'vue'
import AiList from '@c/ai-list/ai-list.vue'
import AiListItem from '@c/ai-list/ai-list-item/ai-list-item.vue'
import { listAppAPI } from '@/api/app'
import { useRouter } from 'vue-router'
import { asset } from '@/models/assets'
import AiSpin from '@c/ai-spin/ai-spin.vue'

const router = useRouter()

const homeStore = useHomeStore()

document.title = 'Personal - Aiagt'
homeStore.focusTabByName('Application')

const apps = reactive([] as App[])
const loading = ref(true)

listAppAPI({}).then(resp => {
  apps.push(...resp.apps)
  loading.value = false
})
</script>

<template>
  <ai-spin :loading="loading">
    <div class="px-8 pt-6 pb-1 text-xl text-black">
      Applications
    </div>
    <ai-list class="bg-white">
      <ai-list-item
        v-for="app of apps"
        class="hover:!bg-gray-100"
      >
        <div class="flex items-center gap-2 !py-2" @click="router.push(`/app/${app.id}`)">
          <img :src="asset(app.logo)" :alt="app.name" class="w-12 h-12 rounded-xl bg-white">
          <div class="flex flex-col gap-1">
            <div>
              {{ app.name }}
            </div>
            <div class="text-xs !text-[11px]">
              {{ app.description }}
            </div>
          </div>
        </div>
      </ai-list-item>
    </ai-list>
  </ai-spin>
</template>

<style scoped>

</style>