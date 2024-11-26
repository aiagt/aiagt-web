<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModelStore } from '@/store/model.ts'
import { asset } from '@/models/assets'

const modelStore = useModelStore()
const modelOptions = modelStore.modelOptions

const props = withDefaults(defineProps<{
  modelValue?: BigInt
}>(), {})

const emits = defineEmits(['update:modelValue'])

const selectedId = ref(props.modelValue)
const popupVisible = ref(false)

watch(props, () => {
  selectedId.value = props.modelValue
}, { immediate: true })

const selectedOption = computed(() => {
  return modelStore.getModel(selectedId.value)
})
</script>

<template>
  <a-trigger trigger="click" :unmount-on-close="false" position="bl" v-model:popup-visible="popupVisible"
             :popup-translate="[0, 10]">
    <div
      class="flex gap-2 items-center bg-[#f9f9f9] py-2 px-3 rounded-xl text-xs cursor-pointer active:bg-[#eeeeee] transition"
    >
      <div class="flex-1 flex gap-4 p-3 min-w-96">
        <img :src="asset(selectedOption.logo)" :alt="selectedOption.name" class="w-20 h-20">
        <div class="flex flex-col gap-2 truncate">
          <div class="text-lg font-medium text-gray-700">{{ selectedOption.name }}</div>
          <div class="flex gap-1">
            <div class="px-1.5 py-0.5 rounded-[0.25rem] bg-[#F8F1FE] text-purple-700 text-[9px]">
              {{ `${selectedOption.source} | ${selectedOption.model_key}` }}
            </div>
            <div class="py-0.5 px-1.5 rounded-[0.25rem] bg-[#D7EDFF69] text-blue-700 text-[9px] whitespace-nowrap">
              {{ `IN-${selectedOption.input_price}/1K` }}
            </div>
            <div class="py-0.5 px-1.5 rounded-[0.25rem] bg-[#D7EDFF69] text-blue-700 text-[9px] whitespace-nowrap">
              {{ `OUT-${selectedOption.output_price}/1K` }}
            </div>
          </div>
          <div class="truncate text-gray-600">{{ selectedOption.description }}</div>
        </div>
      </div>
      <icon-up v-show="popupVisible" />
      <icon-down v-show="!popupVisible" />
    </div>
    <template #content>
      <div class="p-2 bg-white shadow-lg shadow-gray-300 rounded-lg flex flex-col gap-1 border-[0.5px]">
        <div class="pl-2 pt-3 pb-2 text-gray-400 font-medium text-xs">Models</div>
        <div
          v-for="option in modelOptions"
          class="flex gap-4 items-center py-2 px-3 rounded-lg text-xs cursor-pointer hover:bg-gray-50 active:bg-gray-200 transition duration-300"
          :class="{'!bg-gray-100': selectedId === option.id}"
          @click="selectedId = option.id; emits('update:modelValue', option.id); popupVisible=false"
        >
          <img :src="asset(option.logo)" :alt="option.name" class="w-4 h-4">
          <div class="flex-1">{{ option.name }}</div>
          <div class="inline-flex gap-1 justify-start w-40">
            <div class="py-0.5 px-1.5 rounded-[0.25rem] bg-blue-50 text-blue-700 text-[9px] whitespace-nowrap">
              {{ `IN-${option.input_price}/1K` }}
            </div>
            <div class="py-0.5 px-1.5 rounded-[0.25rem] bg-blue-50 text-blue-700 text-[9px] whitespace-nowrap">
              {{ `OUT-${option.output_price}/1K` }}
            </div>
          </div>
          <a-tooltip
            :content="option.description"
            content-class="!text-xs !max-w-56 !rounded-sm"
            mini
          >
            <icon-info-circle />
          </a-tooltip>
          <div class="w-3 flex justify-center items-center text-blue-700">
            <icon-check v-if="selectedId === option.id" stroke-linejoin="round" :stroke-width="8" />
          </div>
        </div>
      </div>
    </template>
  </a-trigger>
</template>