import axios from 'axios'
import '@arco-design/web-vue/es/message/style/css.js'
import { useAuthStore } from '@/store/auth.ts'
import JSONBigInt from 'json-bigint'

const authStore = useAuthStore()

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  transformResponse: (data: any) => {
    return JSONBigInt.parse(data)
  }
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
      return Promise.reject(response.data)
    }

    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
