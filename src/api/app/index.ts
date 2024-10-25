import { App, CreateAppReq, ListAppLabelReq, ListAppLabelResp, ListAppReq, ListAppResp } from '@/models/app'
import { get, post } from '@/api/axios'

export async function listAppAPI(req: ListAppReq): Promise<ListAppResp> {
  const resp = await post('/app/list', req)
  return Promise.resolve(resp.data)
}

export async function getAppAPI(id: number): Promise<App> {
  const resp = await get(`/app/${id}`)
  return Promise.resolve(resp.data)
}

export async function createAppAPI(req: CreateAppReq): Promise<{}> {
  const resp = await post('/app/', req)
  return Promise.resolve(resp.data)
}

export async function listAppLabelAPI(req: ListAppLabelReq): Promise<ListAppLabelResp> {
  const resp = await get('/app/label', req)
  return Promise.resolve(resp.data)
}