import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'
import { useAuthStore } from '@/store/auth.ts'

const authStore = useAuthStore()

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000
})

instance.interceptors.request.use(
  (config) => {
    const token = authStore.getToken()
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200 || response.data.code !== 0) {
      Message.error(response.data.msg)

      return Promise.reject(response.data.msg)
    }

    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
