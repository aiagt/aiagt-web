import { PaginationReq, PaginationResp, Time } from '@/models/base'

export enum MessageType {
  TEXT,
  IMAGE,
  FILE,
  FUNCTION,
  FUNCTION_CALL
}

export enum MessageRole {
  USER,
  ASSISTANT,
  SYSTEM,
  FUNCTION
}

export interface MessageContentValue {
  text?: MessageContentValueText;
  image?: MessageContentValueImage;
  file?: MessageContentValueFile;
  func?: MessageContentValueFunc;
  func_call?: MessageContentValueFuncCall;
}

export interface MessageContentValueText {
  text: string;
}

export interface MessageContentValueImage {
  url: string;
}

export interface MessageContentValueFile {
  url: string;
  type: string;
}

export interface MessageContentValueFunc {
  name: string;
  content: string;
}

export interface MessageContentValueFuncCall {
  name: string;
  arguments: string;
}

export interface MessageContent {
  type: MessageType;
  content: MessageContentValue;
}

export interface ChatReq {
  conversation_id?: number;
  app_id: number;
  messages: MessageContent[];
}

export interface ChatResp {
  messages: Message[];
  conversation_id: number;
  conversation_title?: string;
}

export interface ChatRespMessage {
  role: MessageRole;
  content: MessageContent;
}

export interface Conversation {
  id: number;
  user_id: number;
  app_id: number;
  title: string;
  created_at: Time;
  updated_at: Time;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: MessageContent;
  created_at: Time;
  updated_at: Time;
}

export interface UpdateMessageReq {
  id: number;
  message: MessageContent;
}

export interface ListMessageReq {
  pagination?: PaginationReq;
  conversation_id: number;
}

export interface ListMessageResp {
  pagination: PaginationResp;
  messages: Message[];
}

export interface UpdateConversationReq {
  id: number;
  title: string;
}

export interface ListConversationReq {
  pagination?: PaginationResp;
  app_id: number;
}

export interface ListConversationResp {
  pagination: PaginationResp;
  conversations: Conversation[];
}

export interface InitDevelopReq {
  app_id: number;
}

export interface InitDevelopResp {
  conversation: Conversation;
  messages: Message[];
}