<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, Backspace } from '@arco-design/web-vue/es/_utils/keycode'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 6
  }
})

const emits = defineEmits(['update:modelValue', 'change'])

const filledValue = computed(() => {
  const chars = props.modelValue.split('')
  return new Array(props.length).fill('').map((_, i) => {
    return chars[i] || ''
  })
})

const innerValue = ref(filledValue.value)

const inputRefList = ref<HTMLInputElement[]>([])

function handleFocus(i: number) {
  inputRefList?.value[i].focus()
}

function reFocus() {
  for (let i = 0; i < innerValue.value.length; i++) {
    if (!innerValue.value[i]) {
      handleFocus(i)
      break
    }
  }
}

function updateValue() {
  const value = innerValue.value.join('').trim()
  emits('update:modelValue', value)
  emits('change', value)
  reFocus()
}

watch(innerValue.value, () => {
  updateValue()
})

function onInput(event: InputEvent, i: number) {
  const inputElem = event.target as HTMLInputElement
  innerValue.value[i] = inputElem.value.length ? inputElem.value[0] : inputElem.value
}

function onKeydown(event: KeyboardEvent, i: number) {
  if (event.code === Backspace.code && !innerValue.value[i]) {
    event.preventDefault()
    innerValue.value[Math.max(i - 1, 0)] = ''
  } else if (event.code === ArrowLeft.code && i > 0) {
    event.preventDefault()
    handleFocus(i - 1)
  } else if (event.code === ArrowRight.code && i < props.length - 1) {
    event.preventDefault()
    handleFocus(i + 1)
  }
}

function onPaste(event: ClipboardEvent, index: number) {
  event.preventDefault()

  const text = event.clipboardData?.getData('text')
  if (!text) return

  text.split('').forEach((char, i) => {
    if (index + i >= props.length) return
    innerValue.value[index + i] = char
  })
}
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <input
      v-for="(_, i) of innerValue"
      v-model="innerValue[i]"
      :key="i"
      :ref="el => inputRefList[i] = el as HTMLInputElement"
      type="text"
      class="h-10 w-10 border border-solid rounded-lg text-center"
      @input="event => onInput(event as InputEvent, i)"
      @keydown="event => onKeydown(event as KeyboardEvent, i)"
      @paste="event => onPaste(event as ClipboardEvent, i)"
    />
  </div>
</template>
