import { PaginationReq, PaginationResp, Time } from '@/models/base'
import { User } from '@/models/user'
import { PluginTool } from '@/models/plugin'

export interface App {
  id: number;
  name: string;
  description: string;
  description_md: string;
  model_id: number;
  enable_image: boolean;
  enable_file: boolean;
  version: string;
  is_private: boolean;
  home_page: string;
  preset_questions: string[];
  tool_ids: number[];
  tools: PluginTool[];
  logo: string;
  author_id: number;
  author?: User;
  label_ids: number[];
  labels: AppLabel[];
  model_config: ModelConfig;
  created_at: Time;
  updated_at: Time;
  published_at?: Time;
}

export interface ModelConfig {
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string[];
  presence_penalty?: number;
  response_format?: any;
  seed?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  top_logprobs?: number;
  user?: string;
  stream_options?: any;
}

export interface CreateAppReq {
  name: string;
  description: string;
  description_md: string;
  model_id: number;
  enable_image: boolean;
  enable_file: boolean;
  version: string;
  is_private: boolean;
  home_page: string;
  preset_questions: string[];
  tool_ids: number[];
  logo: string;
  label_ids: number[];
  label_texts: string[];
  model_config: ModelConfig;
}

export interface UpdateAppReq {
  id: number;
  name?: string;
  description?: string;
  description_md?: string;
  model_id?: number;
  enable_image?: boolean;
  enable_file?: boolean;
  version?: string;
  is_private?: boolean;
  home_page?: string;
  preset_questions?: string[];
  tool_ids?: number[];
  logo?: string;
  label_ids?: number[];
  label_texts?: string[];
  model_config?: ModelConfig;
}

export interface ListAppReq extends PaginationReq {
  author_id?: number;
  name?: string;
  description?: string;
  labels?: string[];
}

export interface ListAppResp {
  pagination: PaginationResp;
  apps: App[];
}

export interface PublishAppReq {
  id: number;
  version: string;
}

export interface AppLabel {
  id: number;
  text: string;
  created_at: Time;
}

export interface ListAppLabelReq extends PaginationReq {
  text?: string;
}

export interface ListAppLabelResp {
  pagination: PaginationResp;
  labels: AppLabel[];
}

export interface GetAppByIDReq {
  id: number;
  unfold?: boolean;
}

export interface GetAppByIDResp {
  app: App;
  ext?: GetAppByIDRespExtend;
}

export interface GetAppByIDRespExtend {
  private_tools_count: number;
}