import { ListModelReq, ListModelResp } from '@/models/model'
import { get } from '@/api/axios'

export async function listModelAPI(req: ListModelReq): Promise<ListModelResp> {
  const resp = await get('/model/', req)
  return Promise.resolve(resp.data)
}
