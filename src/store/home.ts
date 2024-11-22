import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useHomeStore = defineStore('home', () => {
  const tabList = reactive([
    { title: 'Application', link: '/application', icon: 'app', position: 'top' },
    { title: 'Plugin', link: '#', icon: 'plugin', position: 'top' },
    { title: 'Knowledge', link: '#', icon: 'knowledge', position: 'top' },
    { title: 'Personal', link: '/personal', icon: 'home', position: 'top' },
    { title: 'Development', link: '#', icon: 'develop', position: 'top' },
    { title: 'User', link: '#', icon: 'user', position: 'bottom' },
    { title: 'Settings', link: '#', icon: 'settings', position: 'bottom' }
  ])

  const focusedTab = ref(0)
  const searchText = ref('')

  function focusTab(i: number) {
    focusedTab.value = i
  }

  function focusTabByName(name: string) {
    for (let i = 0; i < tabList.length; i++) {
      if (tabList[i].title === name) {
        focusTab(i)
        break
      }
    }
  }

  function isFocused(i: number): boolean {
    return focusedTab.value === i
  }

  return { tabList, focusedTab, searchText, focusTab, focusTabByName, isFocused }
})
