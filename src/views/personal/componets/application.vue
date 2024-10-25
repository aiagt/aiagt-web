<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { App, ListAppReq, CreateAppReq, AppLabel } from '@/models/app'
import { createAppAPI, listAppAPI, listAppLabelAPI } from '@/api/app'
import { PaginationResp } from '@/models/base'
import { useRouter } from 'vue-router'
import Modal from '@c/modal/modal.vue'
import InputGroup from '@c/input-group/input-group.vue'
import { FileItem, Message } from '@arco-design/web-vue'
import { uploadAssetsAPI } from '@/api/assets'

const router = useRouter()

const listCfg = reactive({
  apps: [] as App[],
  req: { page: 1, page_size: 20 } as ListAppReq,
  pagination: {} as PaginationResp
})

const modalConfig = reactive({
  visible: false
})

const createAppReq = reactive({} as CreateAppReq & { logoFile: string | undefined })

const createAppReqValid = computed((): boolean => {
  return !!(createAppReq.name && createAppReq.logo)
})

async function uploadIcon(_: any, fileItem: FileItem) {
  if (!fileItem || !fileItem.file) return
  const resp = await uploadAssetsAPI(fileItem.file)
  createAppReq.logo = `/api/assets/${resp.filename}`
  createAppReq.logoFile = fileItem.url
}

function changeLabels(value: any) {
  if (!value) return
  const labels = value as (number | string)[]
  createAppReq.label_ids = []
  createAppReq.label_texts = []

  for (const label of labels) {
    switch (typeof label) {
      case 'string':
        createAppReq.label_texts.push(label)
        break
      case 'number':
        createAppReq.label_ids.push(label)
        break
    }
  }
}

async function createApp() {
  await createAppAPI(createAppReq)
  Message.success('Create app success')
}

const appLabels = ref([] as AppLabel[])

async function init() {
  const listAppResp = await listAppAPI(listCfg.req)
  listCfg.apps = listAppResp.apps
  listCfg.pagination = listAppResp.pagination

  const listLabelResp = await listAppLabelAPI({ page_size: 10000 })
  appLabels.value = listLabelResp.labels
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
      class="w-full grid grid-cols-1 w2:grid-cols-2 w4:grid-cols-3 w6:grid-cols-4 w8:grid-cols-5 w10:grid-cols-6 gap-7 min-w-80">
      <div
        v-for="app of listCfg.apps"
        class="flex flex-col justify-between gap-7 border border-gray-200 rounded-xl p-5 hover:text-blue-700 hover:border-blue-700 hover:border-2 cursor-pointer transition duration-300"
        @click="router.push({path: `/app/dev/${app.id}`})"
      >
        <div class="flex flex-col gap-2">
          <div class="flex gap-2.5 items-center">
            <img :src="app.logo" :alt="app.name" class="w-9">
            <div class="text-xl font-medium">{{ app.name }}</div>
          </div>
          <div class="text-xs font-normal text-gray-800">{{ app.description }}</div>
        </div>

        <div class="flex flex-wrap gap-1">
          <div
            v-for="label of app.labels"
            class="rounded bg-gray-100 text-xs px-1.5 py-0.5 scale-90 text-gray-700"
          >
            {{ label.text }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <modal
    title="Create App"
    v-model:visible="modalConfig.visible"
    :allow-confirm="createAppReqValid"
    @confirm="createApp"
  >
    <div class="py-3 flex flex-col gap-8">
      <input-group
        name="Icon"
        required
        direction="horizontal"
      >
        <div>
          <a-upload
            @change="uploadIcon"
            :show-file-list="false"
            :auto-upload="false"
          >
            <template #upload-button>
              <div v-if="createAppReq.logoFile"
                   class="!w-20 !h-20 !m-0 arco-upload-list-picture custom-upload-avatar border !rounded-lg">
                <img :src="createAppReq.logoFile" alt="">
                <div class="arco-upload-list-picture-mask" style="line-height: 5rem !important">
                  <IconEdit />
                </div>
              </div>
              <div v-else>
                <div
                  class="w-20 h-20 flex justify-center items-center border border-gray-300 rounded-lg text-gray-500 hover:border-blue-700 hover:bg-gray-50 hover:text-blue-700 active:bg-gray-200 transition duration-300">
                  <icon-upload />
                </div>
              </div>
            </template>
          </a-upload>
        </div>
      </input-group>
      <input-group
        name="App name"
        placeholder="Please enter app name"
        required
        :max-length="32"
        show-word-limit
        v-model="createAppReq.name"
      />
      <input-group
        name="App description"
        type="textarea"
        placeholder="Please enter app description"
        :auto-size="{ minRows: 4, maxRows: 4 }"
        :max-length="600"
        show-word-limit
        v-model="createAppReq.description"
      >
      </input-group>
      <input-group
        name="App labels"
      >
        <a-select
          placeholder="Please select app labels"
          allow-create
          multiple
          :max-tag-count="8"
          @change="changeLabels"
        >
          <a-option v-for="label of appLabels" :key="label.id" :value="label.id">
            {{ label.text }}
          </a-option>
        </a-select>
      </input-group>
    </div>
  </modal>
</template>