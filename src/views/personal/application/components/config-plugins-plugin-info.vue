<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Plugin } from '@/models/plugin'
import { getPluginByID } from '@/api/plugin'
import AiButton from '@c/ai-button/ai-button.vue'
import { useApplicationStore } from '@/store/application.ts'
import AiList from '@c/ai-list/ai-list.vue'
import AiListItem from '@c/ai-list/ai-list-item/ai-list-item.vue'
import { asset } from '@/models/assets'

const props = defineProps<{
  pluginId?: number
}>()

const plugin = reactive({} as Plugin)

watch(props, async () => {
  if (!props.pluginId) return

  const resp = await getPluginByID(props.pluginId)
  Object.keys(plugin).forEach(key => delete (plugin as Record<string, any>)[key])
  Object.assign(plugin, resp)
}, { immediate: true })

const appStore = useApplicationStore()

function movePluginTool(toolID: number) {
  if (appStore.inputAppInfo.tool_ids?.length) {
    const idx = appStore.inputAppInfo.tool_ids.indexOf(toolID)
    if (idx >= 0) {
      appStore.inputAppInfo.tool_ids?.splice(idx, 1)
      return
    }
  } else {
    appStore.inputAppInfo.tool_ids = []
  }

  appStore.inputAppInfo.tool_ids.push(toolID)
}

function hasPluginTool(toolID: number) {
  return appStore.inputAppInfo.tool_ids?.length && appStore.inputAppInfo.tool_ids?.includes(toolID)
}
</script>

<template>
  <div
    v-if="pluginId"
    class="flex-1 p-2 flex flex-col gap-6 h-full"
  >
    <div class="flex flex-col gap-6 px-4">
      <div class="flex gap-3 items-center">
        <div class="w-14 h-14 border rounded-xl">
          <img :src="asset(plugin.logo)" :alt="plugin.name">
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-lg font-medium text-black">{{ plugin.name }}</div>
          <div class="flex gap-1">
            <div class="flex gap-1 items-center">
              <img :src="asset(plugin.author?.avatar)" :alt="plugin.author?.username" class="w-3 h-3 rounded-full">
              <div class="text-xs text-gray-500">{{ plugin.author?.username }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-gray-700 text-[13px]">
        {{ plugin.description }}
      </div>

      <div class="flex gap-2 flex-wrap">
        <div
          v-for="label of plugin.labels"
          :key="label.id"
          class="text-[10px] px-1.5 py-0.5 rounded-[0.275rem] bg-gray-200 text-gray-700"
        >
          {{ label.text }}
        </div>
      </div>

      <div class="border-b border-gray-100" />
    </div>

    <ai-list class="!p-0 !bg-transparent overflow-y-auto">
      <ai-list-item
        v-for="tool of plugin.tools"
        class="!rounded-lg hover:!bg-gray-100 config-plugin-tool-item"
      >
        <div class="flex flex-col items-start w-full gap-2">
          <div class="flex flex-col gap-2">
            <div class="text-black flex gap-2 items-center h-6">
              {{ tool.name }}
              <ai-button
                type="normal"
                :text="hasPluginTool(tool.id) ? 'Remove' : 'Add'"
                class="!py-[1px] !px-1.5 text-xs !text-[10px] !font-medium border-0 !rounded-md !bg-[#f8f8f8] move-plugin-tool-btn"
                size="small"
                :class="!hasPluginTool(tool.id) ? '!text-blue-700' : '!text-red-600'"
                @click="movePluginTool(tool.id)"
              />
            </div>
            <div class="text-xs text-gray-500">{{ tool.description }}</div>
          </div>
        </div>
      </ai-list-item>
    </ai-list>
  </div>
</template>

<style scoped>
.config-plugin-tool-item:hover .move-plugin-tool-btn {
  @apply !bg-white active:!bg-gray-200;
}
</style>