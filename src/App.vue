<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
</script>

<template>
  <a-config-provider :locale="enUS">
    <router-view />
  </a-config-provider>
</template>