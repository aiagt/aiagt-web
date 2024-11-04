<script setup lang="ts">
import AiagtLong from '@c/aiagt/aiagt-long.vue'
import Search from '@/layout/home/components/search.vue'
import { IconApp, IconPlugin, IconKnowledge, IconHome, IconDevelop } from '@arco-iconbox/vue-aiagt'
import { IconUser, IconSettings } from '@arco-design/web-vue/es/icon'
import { useHomeStore } from '@/store/home.ts'
import { eq } from '@/utils'
import '@/assets/font/font.css'
import Sidebar from '@/layout/home/components/sidebar.vue'

const homeStore = useHomeStore()
</script>

<template>
  <div class="home-layout h-screen flex p-1.5">
    <div class="min-w-48 p-4.5 pl-3 flex flex-col justify-between">
      <div class="flex flex-col gap-5">
        <aiagt-long class="w-25" />
        <search v-model="homeStore.searchText" />

        <sidebar position="top">
          <template #icons="{ icon, focused }">
            <icon-app
              :span="true" v-if="eq(icon, 'app')"
              class="text-lg stroke-[6] transition duration-300"
              :class="{'text-blue-700': focused}"
            />
            <icon-plugin
              v-else-if="eq(icon, 'plugin')"
              class="text-lg stroke-[8] transition duration-300"
              :class="{'text-blue-700': focused}"
            />
            <icon-knowledge
              v-else-if="eq(icon, 'knowledge')"
              class="text-lg stroke-[10] transition duration-300"
              :class="{'text-blue-700': focused}"
            />
            <icon-home
              v-else-if="eq(icon, 'home')"
              class="text-md stroke-[5] transition duration-300"
              :class="{'text-blue-700': focused}"
            />
            <icon-develop
              v-else-if="eq(icon, 'develop')"
              class="text-lg stroke-[5] transition duration-300"
              :class="{'text-blue-700': focused}"
            />
          </template>
        </sidebar>
      </div>

      <sidebar position="bottom">
        <template #icons="{ icon, focused }">
          <icon-user
            v-if="eq(icon, 'user')"
            class="text-lg transition duration-300"
            :class="{'!text-blue-700': focused}"
          />
          <icon-settings
            v-else-if="eq(icon, 'settings')"
            class="text-lg transition duration-300"
            :class="{'!text-blue-700': focused}"
          />
        </template>
      </sidebar>
    </div>

    <div class="w-full h-full overflow-auto bg-white flex-1 rounded-xl min-w-[520px]">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  background: linear-gradient(#F9F5FD, #FAF2FC 35%, #F0F6FE);
}
</style>