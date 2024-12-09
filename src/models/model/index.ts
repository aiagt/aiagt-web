import { PaginationReq, PaginationResp, Time } from '@/models/base'

export interface GenTokenReq {
  app_id: BigInt;
  plugin_id?: BigInt;
  conversation_id: BigInt;
  call_limit: number;
}

export interface GenTokenResp {
  token: string;
  expired_at: Time;
}

export interface Model {
  id: BigInt;
  name: string;
  description: string;
  source: string;
  model_key: string;
  logo: string;
  input_price: string;
  output_price: string;
  max_token: number;
  tags: string[];
}

export interface CreateModelReq {
  name: string;
  description: string;
  source: string;
  model_key: string;
  logo: string;
  input_price: string;
  output_price: string;
}

export interface UpdateModelReq {
  id: BigInt;
  name?: string;
  description?: string;
  source?: string;
  model_key?: string;
  logo?: string;
  input_price: string;
  output_price: string;
}

export interface ListModelReq {
  pagination?: PaginationReq;
  name?: string;
  source?: string;
}

export interface ListModelResp {
  pagination: PaginationResp;
  models: Model[];
}