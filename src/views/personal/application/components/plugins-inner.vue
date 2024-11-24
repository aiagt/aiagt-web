<script setup lang="ts">
import { PluginTool } from '@/models/plugin'
import { useApplicationStore } from '@/store/application.ts'
import { reactive, watch } from 'vue'
import { asset } from '@/models/assets'

const props = defineProps<{
  tools?: PluginTool[]
}>()

const tools = reactive([] as PluginTool[])

watch(props, () => {
  tools.splice(0)
  if (props.tools) tools.push(...props.tools)
}, { immediate: true })

const appStore = useApplicationStore()

function deletePluginTool(id: number, idx: number) {
  let index = appStore.inputAppInfo.tool_ids?.indexOf(id) as number
  if (index >= 0) appStore.inputAppInfo.tool_ids?.splice(index, 1)

  tools.splice(idx, 1)
}
</script>

<template>
  <div class="flex flex-col gap-1" v-if="tools?.length">
    <div
      v-for="(tool, idx) of tools"
      :key="tool.id"
      class="px-3 py-2 rounded-lg bg-white flex justify-between items-center gap-2 hover:bg-[#f8f8f8] plugin-inner-item"
    >
      <div class="flex items-center gap-2 truncate">
        <img :src="asset(tool.plugin?.logo)" :alt="tool.name" class="w-8 h-8 bg-white rounded-lg">
        <div class="flex flex-col w-full truncate">
          <div class="truncate text-xs text-gray-700 font-medium">{{ `${tool.name} - ${tool.plugin?.name}` }}</div>
          <div class="truncate text-xs !text-[10px] text-gray-500">{{ tool.description }}</div>
        </div>
      </div>

      <a-tooltip content="Remove" content-class="!text-xs" mini>
        <div class="hidden text-gray-500 plugin-inner-item-btn" @click.stop="deletePluginTool(tool.id, idx)">
          <icon-delete stroke-linejoin="round" stroke-linecap="round" />
        </div>
      </a-tooltip>
    </div>

  </div>
  <div class="flex justify-center items-center py-2 text-gray-500 font-medium" v-else> No plugin</div>

</template>

<style scoped>
.plugin-inner-item:hover .plugin-inner-item-btn {
  @apply inline-block;
}
</style>