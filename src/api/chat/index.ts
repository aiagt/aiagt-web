import {
  ChatReq,
  ChatResp,
  InitDevelopReq,
  InitDevelopResp,
  ListConversationReq, ListConversationResp,
  ListMessageReq,
  ListMessageResp, UpdateConversationReq, UpdateMessageReq
} from '@/models/chat'
import { sse } from '@/utils/sse.ts'
import { useAuthStore } from '@/store/auth.ts'
import { del, get, post, put } from '@/api/axios'

const authStore = useAuthStore()

export function chatAPI(
  req: ChatReq,
  onMessage: (event: string, data: ChatResp | string) => void,
  onError: (error: any) => void = console.error
) {
  let headers: Record<string, string> = {}

  const token = authStore.getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  sse(`/api/chat/chat`, req, headers, message => {
    switch (message.event) {
      case 'chunk':
        onMessage(message.event, JSON.parse(message.data) as ChatResp)
        break
      default:
        onMessage(message.event, message.data)
        break
    }

  }, onError)
}

export async function initDevelopAPI(req: InitDevelopReq): Promise<InitDevelopResp> {
  const resp = await post('/chat/conversation/develop', req)
  return Promise.resolve(resp.data)
}

export async function listMessageAPI(req: ListMessageReq): Promise<ListMessageResp> {
  const resp = await get('/chat/message/', req)
  return Promise.resolve(resp.data)
}

export async function listConversationAPI(req: ListConversationReq): Promise<ListConversationResp> {
  const resp = await get('/chat/conversation/', req)
  return Promise.resolve(resp.data)
}

export async function deleteConversationAPI(id: number): Promise<void> {
  const resp = await del(`/chat/conversation/${id}`)
  return Promise.resolve(resp.data)
}

export async function updateConversationAPI(req: UpdateConversationReq): Promise<void> {
  const resp = await put(`/chat/conversation/${req.id}`, req)
  return Promise.resolve(resp.data)
}

export async function deleteMessageAPI(id: number, more?: boolean): Promise<void> {
  const resp = await del(`/chat/message/${id}${more ? '?more=1' : ''}`)
  return Promise.resolve(resp.data)
}

export async function updateMessageAPI(req: UpdateMessageReq): Promise<void> {
  const resp = await put(`/chat/message/${req.id}`, req)
  return Promise.resolve(resp.data)
}