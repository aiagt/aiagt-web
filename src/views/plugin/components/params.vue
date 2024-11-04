<script setup lang="ts">
import { computed, reactive, watch, watchEffect } from 'vue'
import { Message, TableColumnData, TableData } from '@arco-design/web-vue'
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
import { v4 as uuid } from 'uuid'
import { JSONSchema, jsonToJSONSchema, mergeSchemas } from '@/utils/json_schema.ts'
import Modal from '@c/modal/modal.vue'
import Editor from '@c/editor/editor.vue'

// using v-model will keep refreshing the page structure and affect the experience, so v-model is not supported.
const props = defineProps<{
  raw: string;  // base64 value
  allowEdit?: boolean;
  preview?: boolean;
}>()

const param = computed((): JSONSchema => props.raw ? JSON.parse(atob(props.raw)) : { type: 'null' })

const emits = defineEmits(['update:raw', 'update:schema'])

const columns: TableColumnData[] = [
  { title: 'Name', dataIndex: 'name', slotName: 'name', minWidth: 120 },
  { title: 'Type', dataIndex: 'type', slotName: 'type', minWidth: 100 },
  { title: 'Description', dataIndex: 'description', slotName: 'description', minWidth: 120 },
  { title: 'Required', dataIndex: 'required', slotName: 'required', width: 90, align: 'center' },
  { title: 'Default', dataIndex: 'default', slotName: 'defaultSlot', minWidth: 120 },
  { title: 'Delete', slotName: 'delete', width: 80, align: 'center' },
  { title: 'Add Child', slotName: 'addChild', width: 100, align: 'center' }
]

const previewColumns: TableColumnData[] = [
  { title: 'Name', dataIndex: 'name', slotName: 'name', align: 'center' },
  { title: 'Type', dataIndex: 'type', slotName: 'type', align: 'center' },
  { title: 'Required', dataIndex: 'required', slotName: 'required', align: 'center' }
]

const typeOptions = ['string', 'integer', 'number', 'array', 'object', 'boolean']

const tableData = reactive([] as TableData[])
const expandedKeys = reactive([] as string[])

function schema2Data(schema: JSONSchema, name: string, required?: string[]): TableData {
  const k = uuid().toString()
  expandedKeys.push(k)

  const result: TableData = {
    key: k,
    name: name,
    description: schema.description,
    type: schema.type,
    required: required?.includes(name),
    default: schema.default
  }

  if (schema.type === 'object' && schema.properties) {
    for (const [key, property] of Object.entries(schema.properties)) {
      if (!result.children?.length) {
        result.children = []
      }
      result.children.push(schema2Data(property, key, schema.required))
    }
  } else if (schema.type === 'array' && schema.items) {
    result.children = []
    result.children.push(schema2Data(schema.items, ''))
  }

  return result
}

function data2Schema(data: TableData): JSONSchema {
  const schema: JSONSchema = {
    description: data.description,
    type: data.type,
    required: [],
    default: data.default
  }

  if (data.type === 'object' && data.children?.length) {
    schema.properties = {}
    for (const child of data.children) {
      if (schema.required && child.required) schema.required.push(child.name)
      schema.properties[child.name] = data2Schema(child)
    }
  } else if (data.type === 'array' && data.children?.length) {
    schema.items = data2Schema(data.children[0])
  }

  return schema
}

watch(param, () => {
  if (param.value) {
    tableData.splice(0)
    const data = schema2Data(param.value, '')
    if (data?.children) tableData.push(...data.children)
  }
}, { immediate: true })

watch(tableData, () => {
  const raw = btoa(JSON.stringify(tableParam.value))
  emits('update:raw', raw)
})

const tableParam = computed(() => {
  const schema: JSONSchema = {
    type: 'object',
    properties: {},
    required: []
  }

  for (const item of tableData) {
    if (schema.properties) schema.properties[item.name] = data2Schema(item)
    if (schema.required && item.required) schema.required.push(item.name)
  }

  return schema
})

function changeType(record: TableData) {
  if (record.type === 'array') {
    if (!record.children || record.children.length === 0) {
      addChildren(record)
    } else {
      record.children.splice(1, record.children.length - 1)
    }
  } else if (record.type === 'object') {
    if (!record.children) addChildren(record)
  } else record.children = undefined
}

function addChildren(record: TableData) {
  if (!record.children) record.children = []
  record.children.push({ key: uuid(), type: 'string', required: true } as TableData)

  if (record.key) expandedKeys.push(record.key)
}

function addParameter() {
  const key = uuid()
  expandedKeys.push(key)

  tableData.push({ key: key, type: 'string', required: true } as TableData)
}

function deleteChildren(data: TableData | undefined, record: TableData): boolean {
  if (!data || !data.children) return false

  for (let i = 0; i < data.children.length; i++) {
    if (data.children[i] === record) {
      if (data.type === 'array') {
        Message.error('array element cannot be deleted')
        return true
      }
      data.children.splice(i, 1)
      if (data.children.length === 0) data.children = undefined
      return true
    }
    if (deleteChildren(data.children[i], record)) {
      return true
    }
  }

  return false
}

function deleteParameter(record: TableData) {
  deleteChildren({ children: tableData } as TableData, record)
}

const extractModal = reactive<{
  visible: boolean,
  json?: string,
  schema?: JSONSchema,
  raw?: string
}>({
  visible: false
})

watchEffect(async () => {
  extractModal.schema = await jsonToJSONSchema(extractModal.json)
  if (extractModal.schema) extractModal.raw = btoa(JSON.stringify(extractModal.schema))
})

function extractSchema() {
  const schema = mergeSchemas(tableParam.value, extractModal.schema)
  emits('update:schema', schema)
}
</script>

<template>
  <div
    class="w-full h-full params overflow-x-auto" id="params"
    :class="{'params-editable': allowEdit, 'preview': preview}"
  >
    <a-table
      :columns="preview ? previewColumns : columns"
      :data="tableData"
      :pagination="false"
      :hoverable="false"
      :expanded-keys="expandedKeys"
    >
      <template #name="{ record }">
        <a-input
          v-model="record.name"
          placeholder="Parameter name"
          style="min-width: 100px"
          :disabled="!allowEdit"
          v-if="!preview"
        />
        <div v-else>{{ record.name || '-' }}</div>
      </template>
      <template #type="{ record }" v-if="!preview">
        <a-select v-model="record.type" placeholder="Parameter type" @change="changeType(record)"
                  :disabled="!allowEdit">
          <a-option v-for="option of typeOptions" :key="option" :value="option">{{ option }}</a-option>
        </a-select>
      </template>
      <template #description="{ record }" v-if="!preview">
        <a-input v-model="record.description" placeholder="Parameter description" :disabled="!allowEdit" />
      </template>
      <template #required="{ record }" v-if="!preview">
        <a-checkbox v-model="record.required" :disabled="!allowEdit" />
      </template>
      <template #defaultSlot="{ record }" v-if="!preview">
        <a-input v-model="record.default" placeholder="Parameter default value" :disabled="!allowEdit" />
      </template>
      <template #delete="{ record }">
        <button
          class="rounded-full bg-transparent w-5 h-5 inline-flex justify-center items-center hover:bg-white active:bg-gray-300 transition duration-300"
          @click="deleteParameter(record)"
          v-show="allowEdit"
        >
          <icon-delete class="!stroke-gray-500 !text-[13px]" />
        </button>
      </template>
      <template #addChild="{ record }">
        <button
          class="rounded-full bg-white w-5 h-5 inline-flex justify-center items-center hover:bg-gray-200 active:bg-gray-300 transition duration-300"
          v-show="allowEdit && record.type === 'object'"
          @click="addChildren(record)"
        >
          <icon-plus class="!stroke-gray-500 !text-xs" />
        </button>
      </template>
      <template #expand-icon="{ expanded, record }">
        <icon-down v-if="expanded" @click="() => {
          const idx = expandedKeys.findIndex(v => v === record.key)
          expandedKeys.splice(idx, 1)
        }" />
        <icon-right v-else @click="expandedKeys.push(record.key)" />
      </template>
      <template #footer v-if="!preview">
        <div class="flex gap-2">
          <button
            @click="addParameter"
            class="bg-white rounded-lg px-2.5 py-1.5 text-xs border border-gray-100 hover:bg-gray-100 active:bg-gray-300 transition duration-300"
            v-show="allowEdit"
          >
            <icon-plus />
            Add Parameter
          </button>
          <button
            @click="extractModal.visible=true"
            class="bg-white rounded-lg px-2.5 py-1.5 text-xs border border-gray-100 hover:bg-gray-100 active:bg-gray-300 transition duration-300"
            v-show="allowEdit"
          >
            <icon-upload />
            Extract
          </button>
        </div>
      </template>
    </a-table>
  </div>
  <modal
    title="Extract Schema From JSON"
    btn-confirm-text="Extract"
    v-model:visible="extractModal.visible"
    @confirm="extractSchema"
    :width="540"
    small
  >
    <div class="flex flex-col gap-4">
      <editor
        v-model="extractModal.json"
        :visible="extractModal.visible"
      />
      <div
        v-if="!preview && extractModal.raw"
        class="flex flex-col gap-4"
      >
        <div class="text-sm font-medium">Preview</div>
        <params
          :raw="extractModal.raw"
          :allow-edit="false"
          preview
        />
      </div>
    </div>
  </modal>
</template>

<style>
#params.params {
  @apply !border-gray-200 !border !rounded-xl;

  .arco-input-wrapper,
  .arco-select-view-single,
  .arco-select-view-multiple,
  .arco-textarea-wrapper {
    @apply !text-gray-900 !rounded-lg;
  }

  .arco-select-view-value {
    @apply !min-h-0;
  }

  .arco-table,
  .arco-table-container,
  .arco-table-content,
  .arco-table-footer,
  .arco-table-element {
    @apply !rounded-xl !border-0;
  }

  .arco-table thead {
    @apply !rounded-xl;

    .arco-table-tr,
    .arco-table-th {
      @apply !bg-transparent !border-0;
    }

    .arco-table-cell {
      @apply !mb-3 !bg-white !border-b !border-b-gray-100 !text-[13px];
    }
  }

  .arco-table tbody {
    @apply !bg-gray-50 !rounded-xl !border border-gray-400;

    .arco-table-tr,
    .arco-table-td,
    .arco-table-cell {
      @apply !bg-gray-50 !rounded-xl !border-0;
    }

    .arco-table-cell {
      @apply !py-1;
    }
  }

  .arco-scrollbar-thumb.arco-scrollbar-thumb-direction-horizontal {
    display: none;
  }
}

#params.params.params-editable {
  .arco-input-wrapper,
  .arco-select-view-single,
  .arco-select-view-multiple,
  .arco-textarea-wrapper {
    @apply !bg-white !border-gray-100;
  }

  .arco-input-wrapper.arco-input-focus,
  .arco-textarea-wrapper.arco-textarea-focus,
  .arco-select-view-single.arco-select-view-focus,
  .arco-select-view-multiple.arco-select-view-focus {
    @apply !border-blue-700;
  }
}

#params.params.preview .arco-table {
  tbody {
    .arco-table-tr,
    .arco-table-td,
    .arco-table-cell {
      @apply !bg-white;
    }

    .arco-table-cell {
      @apply !py-2;
    }
  }

  thead .arco-table-cell {
    @apply !mb-0 !bg-gray-100;
  }
}
</style>