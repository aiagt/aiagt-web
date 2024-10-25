import { post } from '@/api/axios'

export async function uploadAssetsAPI(file: File): Promise<{ filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const resp = await post('/assets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return Promise.resolve(resp.data)
}
