<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  name: string;
  required?: boolean;
  direction?: 'vertical' | 'horizontal';
  size?: string | number;
  allowClear?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: unknown;
  placeholder?: string;
  maxLength?: number;
  showWordLimit?: boolean;
  autoSize?: boolean | {
    minRows?: number | undefined;
    maxRows?: number | undefined;
  };
  type?: 'text' | 'password' | 'textarea';
}>()

const input = ref<HTMLInputElement>()
const value = ref<string>()
const updated = ref(false)

const valid = computed((): boolean => {
  return !updated.value || !props.required || !!value.value?.length
})
</script>

<template>
  <div class="flex flex-col gap-2" :class="{'!flex-row items-start justify-between': direction === 'horizontal'}">
    <div
      class="text-[14px] font-medium text-black flex gap-1 items-center"
      @click="input?.focus()"
    >
      {{ name }}
      <span class="text-[14px] text-red-600" v-if="required">*</span>
    </div>

    <slot>
      <a-input
        v-if="!type || type === 'text' || type === 'password'"
        ref="input"
        v-bind="Object({ ...props, ...$attrs })"
        v-model="value"
        :error="!valid"
        @input="updated=true"
      />
      <a-textarea
        v-else-if="type === 'textarea'"
        ref="input"
        v-bind="Object({ ...props, ...$attrs })"
        v-model="value"
        :error="!valid"
        @input="updated=true"
      />
    </slot>
  </div>
</template>

<style>

</style>