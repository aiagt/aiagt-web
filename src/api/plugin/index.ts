import { del, get, post, put } from '@/api/axios'
import {
  CallPluginToolReq,
  CreatePluginReq, CreatePluginToolReq, GetPluginByKeyReq,
  ListPluginLabelReq,
  ListPluginLabelResp,
  ListPluginReq,
  ListPluginResp,
  Plugin, TestPluginToolResp, UpdatePluginReq, UpdatePluginToolReq
} from '@/models/plugin'

export async function listPluginAPI(req: ListPluginReq): Promise<ListPluginResp> {
  const resp = await post('/plugin/list', req)
  return Promise.resolve(resp.data)
}

export async function listPluginLabelAPI(req: ListPluginLabelReq): Promise<ListPluginLabelResp> {
  const resp = await get('/plugin/label', req)
  return Promise.resolve(resp.data)
}

export async function createPluginAPI(req: CreatePluginReq): Promise<{}> {
  const resp = await post('/plugin/', req)
  return Promise.resolve(resp.data)
}

export async function getPluginByKey(req: GetPluginByKeyReq): Promise<Plugin> {
  const resp = await get('/plugin/', req)
  return Promise.resolve(resp.data)
}

export async function updatePluginAPI(req: UpdatePluginReq): Promise<{}> {
  const resp = await put(`/plugin/${req.id}`, req)
  return Promise.resolve(resp.data)
}

export async function updatePluginToolAPI(req: UpdatePluginToolReq): Promise<{}> {
  const resp = await put(`/plugin/tool/${req.id}`, req)
  return Promise.resolve(resp.data)
}

export async function createPluginToolAPI(req: CreatePluginToolReq): Promise<{}> {
  const resp = await post('/plugin/tool', req)
  return Promise.resolve(resp.data)
}

export async function deletePluginToolAPI(id: number): Promise<{}> {
  const resp = await del(`/plugin/tool/${id}`)
  return Promise.resolve(resp.data)
}

export async function testPluginToolAPI(req: CallPluginToolReq): Promise<TestPluginToolResp> {
  const resp = await post(`/plugin/tool/test`, req)
  return Promise.resolve(resp.data)
}