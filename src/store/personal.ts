import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

export const usePersonalStore = defineStore('personal', () => {
  const tabs = reactive([
    { title: 'Application', focused: true },
    { title: 'Plugin', focused: false },
    { title: 'Workflow', focused: false },
    { title: 'Knowledge', focused: false }
  ])

  function focus(idx: number) {
    console.log('focus')
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].focused = i === idx
    }
  }

  function focusByName(name: string) {
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].focused = tabs[i].title === name
    }
  }

  const focused = computed(() => {
    for (const tab of tabs) {
      if (tab.focused) {
        return tab
      }
    }

    return null
  })

  return { tabs, focus, focusByName, focused }
})
