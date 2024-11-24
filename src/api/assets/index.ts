import { post } from '@/api/axios'
import { UploadAssetResp } from '@/models/assets'
import { Message } from '@arco-design/web-vue'

export async function uploadAssetsAPI(type: string, file: File): Promise<UploadAssetResp> {
  if (!type?.length) {
    Message.error('upload error')
    return Promise.reject({})
  }

  const formData = new FormData()
  formData.append('file', file)

  const resp = await post(`/assets/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return Promise.resolve(resp.data)
}
