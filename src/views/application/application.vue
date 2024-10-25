<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getAppAPI } from '@/api/app'
import { reactive } from 'vue'
import { App } from '@/models/app'

const route = useRoute()
const appInfo = reactive({
  id: route.params.id,
  app: {} as App
})

async function init() {
  appInfo.app = await getAppAPI(Number(appInfo.id))
}

init()
</script>

<template>
  <div>
    <div class="text-xl text-black font-normal">{{ appInfo.app.name }}</div>
    <div>{{ appInfo.app.description }}</div>
  </div>
</template>