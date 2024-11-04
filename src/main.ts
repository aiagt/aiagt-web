import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import 'flyonui/flyonui'
import { loader } from '@guolao/vue-monaco-editor'

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  }
})

const pinia = createPinia()


const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')