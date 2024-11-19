<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    label: string;
    tips?: string;
    modelValue?: number;
    defaultValue?: number;
  }>(),
  {
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0
  }
)

const emits = defineEmits(['update:modelValue'])

const tipsLines = computed(() => {
  return props.tips?.split(/\\n|\n/) || []
})
</script>

<template>
  <div class="flex justify-between items-center gap-4 config-model-number-input" id="config-model-number-input">
    <div class="text-[13px] text-gray-500 flex gap-1 items-center min-w-48">
      <div class="text-xs">{{ label }}</div>
      <a-trigger trigger="hover" :unmount-on-close="false" position="top" :popup-translate="[10, 0]">
        <icon-info-circle />
        <template #content>
          <div class="p-2">
            <div
              class="bg-white border-gray-100 border-[0.5px] rounded-xl shadow-lg shadow-gray-100 px-4 py-3 text-sm max-w-64 flex flex-col gap-3 text-gray-600"
              style="font-size: 12px"
            >
              <div class="font-medium text-sm text-black">{{ label }}</div>
              <slot name="tips-content">
                <div v-for="line of tipsLines">
                  {{ line }}
                </div>
              </slot>
            </div>
          </div>
        </template>
      </a-trigger>
    </div>
    <div class="flex gap-4 items-center w-96">
      <a-slider
        :model-value="modelValue"
        :default-value="defaultValue"
        :min="min"
        :max="max"
        :step="step"
        @update:model-value="v => emits('update:modelValue', v)"
        style="flex-grow: 1"
      />
      <a-input-number
        :model-value="modelValue"
        :default-value="defaultValue"
        :min="min"
        :max="max"
        :step="step"
        class="max-w-40"
        @update:model-value="v => emits('update:modelValue', v)"
      />
    </div>
  </div>
</template>

<style>
#config-model-number-input {
  .arco-input-wrapper {
    @apply !rounded-[0.175rem];
  }

  .arco-input-wrapper .arco-input {
    @apply !text-xs !text-center;
  }

  .arco-input-suffix {
    @apply !hidden;
  }
}
</style>