<script setup lang="ts">
import { PaginationResp, Time } from '@/models/base'
import Card from '@v/personal/componets/card.vue'
import { computed, reactive } from 'vue'
import { CreatePluginReq, ListPluginReq, Plugin, PluginLabel } from '@/models/plugin'
import { createPluginAPI, listPluginAPI, listPluginLabelAPI } from '@/api/plugin'
import Modal from '@c/modal/modal.vue'
import InputGroup from '@c/input-group/input-group.vue'
import IconInputGroup from '@v/personal/componets/icon-input-group.vue'
import { useRouter } from 'vue-router'
import { usePersonalStore } from '@/store/personal.ts'

const router = useRouter()

const personalStore = usePersonalStore()
personalStore.focusByName('Plugin')

const listConfig = reactive({
  plugins: [] as Plugin[],
  req: { page: 1, page_size: 20 } as ListPluginReq,
  pagination: {} as PaginationResp
})

const modalConfig = reactive({
  visible: false,
  pluginLabels: [] as PluginLabel[],

  createPluginReq: {} as CreatePluginReq,
  createPluginReqValid: computed((): boolean => {
    return !!(modalConfig.createPluginReq.name && modalConfig.createPluginReq.logo)
  }),

  changeLabels: (value: any) => {
    if (!value) return
    const labels = value as (number | string)[]
    modalConfig.createPluginReq.label_ids = []
    modalConfig.createPluginReq.label_texts = []

    for (const label of labels) {
      switch (typeof label) {
        case 'string':
          modalConfig.createPluginReq.label_texts.push(label)
          break
        case 'number':
          modalConfig.createPluginReq.label_ids.push(label)
          break
      }
    }
  }
})

async function createPlugin() {
  await createPluginAPI(modalConfig.createPluginReq)
  Modal.success('Create plugin success')

  router.go(0)
}

async function init() {
  const listResp = await listPluginAPI(listConfig.req)
  listConfig.plugins = listResp.plugins
  listConfig.pagination = listResp.pagination

  const listLabelResp = await listPluginLabelAPI({ page_size: 10000 })
  modalConfig.pluginLabels = listLabelResp.labels
}

init()
</script>

<template>
  <div class="flex flex-col gap-5 items-start">
    <button
      class="bg-blue-700 text-sm text-white px-3 py-1.5 rounded-md hover:bg-blue-600 active:bg-blue-800 transition"
      @click="modalConfig.visible = !modalConfig.visible"
    >
      <icon-plus :size="14" />
      Create Plugin
    </button>
    <div
      class="w-full grid grid-cols-1 w2:grid-cols-2 w5:grid-cols-3 w6:grid-cols-4 w8:grid-cols-5 gap-7 min-w-80">
      <card v-for="plugin of listConfig.plugins"
            :id="plugin.id"
            :name="plugin.name"
            :logo="plugin.logo"
            :time="new Time(plugin.updated_at)"
            :description="plugin.description"
            :labels="plugin.labels"
            :link="`/plugin/dev/${plugin.key}`"
      />
    </div>
  </div>

  <modal
    title="Create Plugin"
    v-model:visible="modalConfig.visible"
    :allow-confirm="modalConfig.createPluginReqValid"
    @confirm="createPlugin"
  >
    <div class="py-3 flex flex-col gap-8">
      <icon-input-group
        v-model="modalConfig.createPluginReq.logo"
      />
      <input-group
        name="Plugin name"
        placeholder="Please enter plugin name"
        required
        :max-length="32"
        show-word-limit
        v-model="modalConfig.createPluginReq.name"
      />
      <input-group
        name="Plugin description"
        type="textarea"
        placeholder="Please enter plugin description"
        :auto-size="{ minRows: 4, maxRows: 4 }"
        :max-length="200"
        show-word-limit
        v-model="modalConfig.createPluginReq.description"
      />
      <input-group
        name="Plugin labels"
      >
        <a-select
          placeholder="Please select plugin labels"
          allow-create
          multiple
          :max-tag-count="8"
          @change="modalConfig.changeLabels"
        >
          <a-option v-for="label of modalConfig.pluginLabels" :key="label.id" :value="label.id">
            {{ label.text }}
          </a-option>
        </a-select>
      </input-group>
    </div>
  </modal>
</template>