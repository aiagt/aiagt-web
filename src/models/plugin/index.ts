import { Time, PaginationReq, PaginationResp } from '../base'
import { User } from '../user'

export interface Plugin {
  id: number;
  key: number;
  name: string;
  description: string;
  description_md: string;
  author_id: number;
  author?: User;
  is_private: boolean;
  home_page: string;
  enable_secret: boolean;
  secrets: PluginSecret[];
  label_ids: number[];
  labels: PluginLabel[];
  tool_ids: number[];
  tools?: PluginTool[];
  logo: string;
  created_at: Time;
  updated_at: Time;
  published_at?: Time;
}

export interface PluginSecret {
  name: string;
  description: string;
  acquire_method: string;
  link: string;
}

export interface PluginTool {
  id: number;
  name: string;
  description: string;
  plugin_id: number;
  plugin?: Plugin;
  request_type: string;
  response_type: string;
  api_url: string;
  import_model_id?: number;
  created_at: Time;
  updated_at: Time;
  tested_at?: Time;
}

export interface PluginLabel {
  id: number;
  text: string;
  created_at: Time;
}

export interface GetPluginByKeyReq {
  key: string;
}

export interface ListPluginLabelReq extends PaginationReq {
  text?: string;
}

export interface ListPluginLabelResp {
  pagination: PaginationResp;
  labels: PluginLabel[];
}

export interface CreatePluginReq {
  key: number;
  name: string;
  description: string;
  description_md: string;
  is_private: boolean;
  home_page: string;
  enable_secret: boolean;
  secrets: PluginSecret[];
  label_ids: number[];
  label_texts: string[];
  tool_ids: number[];
  logo: string;
}

export interface UpdatePluginReq {
  id: number;
  key?: number;
  name?: string;
  description?: string;
  description_md?: string;
  is_private?: boolean;
  home_page?: string;
  enable_secret?: boolean;
  secrets?: PluginSecret[];
  label_ids?: number[];
  label_texts?: string[];
  tool_ids?: number[];
  logo?: string;
}

export interface ListPluginReq extends PaginationReq {
  author_id?: number;
  name?: string;
  description?: string;
  labels?: number[];
}

export interface ListPluginResp {
  pagination: PaginationResp;
  plugins: Plugin[];
}

export interface CreatePluginToolReq {
  name: string;
  description: string;
  plugin_id: number;
  request_type: string;
  response_type: string;
  api_url: string;
  import_model_id?: number;
}

export interface UpdatePluginToolReq {
  id: number;
  name?: string;
  description?: string;
  plugin_id?: number;
  request_type?: string;
  response_type?: string;
  api_url?: string;
  import_model_id?: number;
}

export interface ListPluginToolReq {
  pagination: PaginationReq;
  plugin_id?: number;
  tool_ids?: number[];
}

export interface ListPluginToolResp {
  tools: PluginTool[];
  pagination: PaginationResp;
}

export interface CallPluginToolReq {
  plugin_id: number;
  tool_id: number;
  secrets?: { [key: string]: string };
  request: string;
}

export interface CallPluginToolResp {
  code: number;
  msg: string;
  response: string;
  http_code: string;
}

export interface TestPluginToolResp {
  code: number;
  msg: string;
  response: string;
  http_code: string;
}

export interface ListPluginByToolsReq {
  tool_ids: number[];
}

export interface ListPluginByToolsResp {
  plugins: Plugin[];
}