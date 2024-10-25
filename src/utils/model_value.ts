import { EmitFn } from '@vue/runtime-core'

export const modelValueProps = () => {
  return { modelValue: { type: String, default: '' } }
}

export const modelValueEmits = () => ['update:modelValue', 'change']

export function updateModelValue(emits: EmitFn, modelValue: String) {
  emits('update:modelValue', modelValue)
  emits('change', modelValue)
}
