<script setup lang="ts">
import { computed, reactive } from 'vue'
import { App, ListAppReq, CreateAppReq, AppLabel } from '@/models/app'
import { createAppAPI, listAppAPI, listAppLabelAPI } from '@/api/app'
import { PaginationResp, Time } from '@/models/base'
import { useRouter } from 'vue-router'
import Modal from '@c/modal/modal.vue'
import InputGroup from '@c/input-group/input-group.vue'
import { Message } from '@arco-design/web-vue'
import Card from '@v/personal/componets/card.vue'
import IconInputGroup from '@v/personal/componets/icon-input-group.vue'
import { usePersonalStore } from '@/store/personal.ts'

const router = useRouter()

const personalStore = usePersonalStore()
personalStore.focusByName('Application')

const listCfg = reactive({
  apps: [] as App[],
  req: { page: 1, page_size: 20 } as ListAppReq,
  pagination: {} as PaginationResp
})

const modalConfig = reactive({
  visible: false,
  appLabels: [] as AppLabel[],

  createAppReq: {} as CreateAppReq,
  createAppReqValid: computed((): boolean => {
    return !!(modalConfig.createAppReq.name && modalConfig.createAppReq.logo)
  }),

  changeLabels: (value: any) => {
    if (!value) return
    const labels = value as (number | string)[]
    modalConfig.createAppReq.label_ids = []
    modalConfig.createAppReq.label_texts = []

    for (const label of labels) {
      switch (typeof label) {
        case 'string':
          modalConfig.createAppReq.label_texts.push(label)
          break
        case 'number':
          modalConfig.createAppReq.label_ids.push(label)
          break
      }
    }
  }
})

async function createApp() {
  await createAppAPI(modalConfig.createAppReq)
  Message.success('Create app success')

  router.go(0)
}

async function init() {
  const listAppResp = await listAppAPI(listCfg.req)
  listCfg.apps = listAppResp.apps
  listCfg.pagination = listAppResp.pagination

  const listLabelResp = await listAppLabelAPI({ page_size: 10000 })
  modalConfig.appLabels = listLabelResp.labels
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
      Create App
    </button>
    <div
      class="w-full grid grid-cols-1 w2:grid-cols-2 w5:grid-cols-3 w6:grid-cols-4 w8:grid-cols-5 gap-7 min-w-80">
      <card v-for="app of listCfg.apps"
            :id="app.id"
            :name="app.name"
            :logo="app.logo"
            :time="new Time(app.updated_at)"
            :description="app.description"
            :labels="app.labels"
            :link="`/app/dev/${app.id}`"
      />
    </div>
  </div>

  <modal
    title="Create App"
    v-model:visible="modalConfig.visible"
    :allow-confirm="modalConfig.createAppReqValid"
    @confirm="createApp"
  >
    <div class="py-3 flex flex-col gap-8">
      <icon-input-group
        v-model="modalConfig.createAppReq.logo"
      />
      <input-group
        name="App name"
        placeholder="Please enter app name"
        required
        :max-length="32"
        show-word-limit
        v-model="modalConfig.createAppReq.name"
      />
      <input-group
        name="App description"
        type="textarea"
        placeholder="Please enter app description"
        :auto-size="{ minRows: 4, maxRows: 4 }"
        :max-length="200"
        show-word-limit
        v-model="modalConfig.createAppReq.description"
      />
      <input-group
        name="App labels"
      >
        <a-select
          placeholder="Please select app labels"
          allow-create
          multiple
          :max-tag-count="8"
          @change="modalConfig.changeLabels"
        >
          <a-option v-for="label of modalConfig.appLabels" :key="label.id" :value="label.id">
            {{ label.text }}
          </a-option>
        </a-select>
      </input-group>
    </div>
  </modal>
</template>