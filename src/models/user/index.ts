import { Time } from '@/models/base'

export interface User {
  id: BigInt;
  username: string;
  email: string;
  phone_number: string;
  signature: string;
  homepage: string;
  description_md: string;
  github: string;
  avatar: string;
  created_at: Time;
  updated_at: Time;
}

export interface UserCaptchaResp {
  exists: boolean;
}

export interface UserRegisterReq {
  email: string;
  captcha: string;
  username?: string;
  password?: string;
}

export interface UserRegisterResp {
  token: string;
  expire: Time;
  user: User;
}

export interface UserLoginReq {
  email: string;
  password?: string;
  captcha?: string;
}

export interface UserLoginResp {
  token: string;
  expire: Time;
  user: User;
}