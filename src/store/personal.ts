import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

export const usePersonalStore = defineStore('personal', () => {
  const tabs = reactive([
    { title: 'Application', focused: true, link: '/personal/application' },
    { title: 'Plugin', focused: false, link: '/personal/plugin' },
    { title: 'Workflow', focused: false, link: '#' },
    { title: 'Knowledge', focused: false, link: '#' }
  ])

  function focus(idx: number) {
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
