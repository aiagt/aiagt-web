import {
  CreateAppReq, GetAppByIDResp,
  ListAppLabelReq,
  ListAppLabelResp,
  ListAppReq,
  ListAppResp,
  UpdateAppReq
} from '@/models/app'
import { get, post, put } from '@/api/axios'

export async function listAppAPI(req: ListAppReq): Promise<ListAppResp> {
  const resp = await post('/app/list', req)
  return Promise.resolve(resp.data)
}

export async function getAppAPI(id: number, onError?: (err: any) => void): Promise<GetAppByIDResp> {
  const resp = await get(`/app/${id}`, undefined, onError)
  return Promise.resolve(resp.data)
}

export async function createAppAPI(req: CreateAppReq): Promise<{}> {
  const resp = await post('/app/', req)
  return Promise.resolve(resp.data)
}

export async function updateAppAPI(req: UpdateAppReq): Promise<{}> {
  const resp = await put(`/app/${req.id}`, req)
  return Promise.resolve(resp.data)
}

export async function listAppLabelAPI(req: ListAppLabelReq): Promise<ListAppLabelResp> {
  const resp = await get('/app/label', req)
  return Promise.resolve(resp.data)
}