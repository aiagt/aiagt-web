<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { editor } from 'monaco-editor'
import { EditorProps, VueMonacoEditor } from '@guolao/vue-monaco-editor'

const props = defineProps<{
  modelValue?: string,
  visible: boolean,
  readonly?: boolean,
}>()

const emits = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)

watch(props, (newVal) => {
  if (newVal.modelValue) {
    value.value = newVal.modelValue
  }

  if (newVal?.visible && config.showEditorHook) {
    config.showEditorHook()
  }
})

interface EditorConfig extends EditorProps {
  options: {
    renderIndentGuides: boolean
  } & editor.IStandaloneEditorConstructionOptions
}

const config = reactive<{
  editorConfig: EditorConfig,
  showEditorHook?: () => void
}>({
  editorConfig: {
    language: 'json',
    options: {
      minimap: { enabled: false },
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      fontFamily: 'JetBrains Mono',
      fontSize: 13,
      tabSize: 2,
      renderLineHighlight: 'none',
      renderIndentGuides: false,
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden'
      },
      lineNumbersMinChars: 2,
      readOnly: props.readonly
    },
    className: 'border rounded-lg py-3.5 px-2 bg-white code-editor'
  } as EditorConfig
})

function onMountEditor(ed: editor.IStandaloneCodeEditor) {
  const [minHeight, maxHeight] = [20, 300]

  function updateEditorHeight() {
    const lineCount = ed.getModel()?.getLineCount() || 0
    const contentHeight = Math.max(minHeight, Math.min(lineCount * 20, maxHeight))
    ed.layout({ width: ed.getLayoutInfo().width, height: contentHeight })
    if (contentHeight < maxHeight) ed.setScrollPosition({ scrollTop: 0 })
  }

  ed.onDidChangeModelContent(() => {
    updateEditorHeight()
  })

  config.showEditorHook = updateEditorHeight
}
</script>

<template>
  <vue-monaco-editor
    v-bind="config.editorConfig"
    :value="value"
    @change="v => {value=v; emits('update:modelValue', value)}"
    @mount="onMountEditor"
  />
</template>

<style scoped>

</style>