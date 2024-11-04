<script setup lang="ts">
import { TableColumnData, TableData } from '@arco-design/web-vue'
import { computed, reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon'
import { PluginSecret } from '@/models/plugin'

const props = defineProps<{
  allowEdit?: boolean
  secrets?: PluginSecret[]
  enableSecret?: boolean
}>()

const emits = defineEmits(['update:secrets'])

const columns: TableColumnData[] = [
  { title: 'Name', dataIndex: 'name', slotName: 'name', minWidth: 120 },
  { title: 'Description', dataIndex: 'description', slotName: 'description', minWidth: 120 },
  { title: 'AcquireMethod', dataIndex: 'acquire_method', slotName: 'acquireMethod', minWidth: 120 },
  { title: 'Link', dataIndex: 'link', slotName: 'link', minWidth: 120 },
  { title: 'Delete', slotName: 'delete', width: 80, align: 'center' }
]

const readonlyColumns: TableColumnData[] = [
  { title: '#', dataIndex: 'id', slotName: 'id' },
  { title: 'Name', dataIndex: 'name', minWidth: 100 },
  { title: 'Description', dataIndex: 'description', minWidth: 100 }
]

const secrets = computed(() => props.secrets)
const tableData = reactive<TableData[]>([] as TableData[])

watch(secrets, (oldVal, newVal) => {
  if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return

  if (secrets.value) {
    tableData.splice(0)

    for (const item of secrets.value) {
      tableData.push({ key: uuid(), ...item })
    }
  }
}, { immediate: true })

function addSecret() {
  tableData.push({
    key: uuid().toString()
  })
}

function deleteSecret(record: TableData) {
  const idx = tableData.findIndex(v => v.key === record.key)
  if (idx >= 0) tableData.splice(idx, 1)
}

watch(tableData, () => {
  const result: PluginSecret[] = []
  for (const item of tableData) {
    result.push({ ...item } as PluginSecret)
  }

  emits('update:secrets', result)
})
</script>

<template>
  <div id="secrets" class="secrets" :class="{'secrets-editable': allowEdit}">
    <a-table
      v-if="allowEdit"
      :columns="columns"
      :data="tableData"
      :pagination="false"
      :hoverable="false"
      :scrollbar="false"
      class="editable"
    >
      <template #name="{ record }">
        <a-input
          v-model="record.name"
          placeholder="Secret name"
          :disabled="!allowEdit"
        />
      </template>
      <template #description="{ record }">
        <a-input
          v-model="record.description"
          placeholder="Secret description"
          :disabled="!allowEdit"
        />
      </template>
      <template #acquireMethod="{ record }">
        <a-input
          v-model="record.acquire_method"
          placeholder="Secret acquire method"
          :disabled="!allowEdit"
        />
      </template>
      <template #link="{ record }">
        <a-input
          v-model="record.link"
          placeholder="Secret link"
          :disabled="!allowEdit"
        />
      </template>
      <template #delete="{ record }">
        <button
          class="rounded-full bg-transparent w-5 h-5 inline-flex justify-center items-center hover:bg-white active:bg-gray-300 transition duration-300"
          @click="deleteSecret(record)"
          v-show="allowEdit"
        >
          <icon-delete class="!stroke-gray-500 !text-[13px]" />
        </button>
      </template>
      <template #footer>
        <button
          @click="addSecret"
          class="bg-white rounded-lg px-2.5 py-1.5 text-xs border border-gray-100 hover:bg-gray-100 active:bg-gray-300 transition duration-300"
          v-show="allowEdit"
        >
          <icon-plus />
          Add Secret
        </button>
      </template>
      <template #empty>
        <div class="flex justify-center items-center gap-3 text-gray-500">
          <icon-empty />
          <div class="text-xs">No Secrets</div>
        </div>
      </template>
    </a-table>
    <a-table
      v-else
      :columns="readonlyColumns"
      :data="tableData"
      :pagination="false"
      :hoverable="false"
      :scrollbar="false"
      class="readonly"
    >
      <template #id="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #empty>
        <div class="flex justify-center items-center gap-3 text-gray-500 p-2">
          <icon-empty />
          <div class="text-xs">No Secrets</div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<style>
#secrets.secrets {
  @apply !border-gray-200 !border !rounded-xl;

  .arco-input-wrapper,
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
      @apply !bg-white !border-b !border-b-gray-100 !text-[13px];
    }
  }

  .arco-table tbody {
    @apply !bg-gray-50 !rounded-xl !border border-gray-400;

    .arco-table-tr,
    .arco-table-td,
    .arco-table-cell {
      @apply !bg-gray-50 !rounded-xl !border-0 !m-0;
    }

    .arco-table-cell {
      @apply !py-1 !pr-0;
    }

    .arco-table-td:last-child .arco-table-cell {
      @apply !pr-4;
    }
  }

  .arco-table.editable thead .arco-table-cell {
    @apply !mb-3;
  }

  .arco-table.readonly {
    thead .arco-table-cell {
      @apply !bg-[#f3f4f6] !border-b-gray-200;
    }

    tbody .arco-table-cell {
      @apply !py-2.5;
    }

    .arco-table-td-content {
      @apply !text-xs;
    }
  }
}

#secrets.secrets.secrets-editable {
  .arco-input-wrapper,
  .arco-textarea-wrapper {
    @apply !bg-white !border-gray-100;
  }

  .arco-input-wrapper.arco-input-focus,
  .arco-textarea-wrapper.arco-textarea-focus {
    @apply !border-blue-700;
  }
}
</style>