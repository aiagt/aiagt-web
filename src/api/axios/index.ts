import instance from './instance.ts'
import { AxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'

export interface Response {
  code: number;
  msg: string;
  data?: any;
}


export async function get(url: string, params?: object | undefined, onError?: (resp: any) => void): Promise<Response> {
  try {
    const response = await instance.get<Response>(url, { params })
    return Promise.resolve(response.data)
  } catch (err: any) {
    if (onError) onError(err)
    else Message.error(err.msg)

    return Promise.reject(err)
  }
}

export async function post(url: string, data?: object | undefined, config?: AxiosRequestConfig<object> | undefined, onError?: (resp: any) => void): Promise<Response> {
  try {
    const response = await instance.post<Response>(url, data, config)
    return Promise.resolve(response.data)
  } catch (err: any) {
    if (onError) onError(err)
    else Message.error(err.msg)

    return Promise.reject(err)
  }
}

export async function put(url: string, data?: object | undefined, config?: AxiosRequestConfig<object> | undefined, onError?: (resp: any) => void): Promise<Response> {
  try {
    const response = await instance.put<Response>(url, data, config)
    return Promise.resolve(response.data)
  } catch (err: any) {
    if (onError) onError(err)
    else Message.error(err.msg)

    return Promise.reject(err)
  }
}

export async function del(url: string, config?: AxiosRequestConfig<any>, onError?: (resp: any) => void): Promise<Response> {
  try {
    const response = await instance.delete<Response>(url, config)
    return Promise.resolve(response.data)
  } catch (err: any) {
    if (onError) onError(err)
    else Message.error(err.msg)

    return Promise.reject(err)
  }
}

export async function patch(url: string, data?: object | undefined, config?: AxiosRequestConfig<object> | undefined, onError?: (resp: any) => void): Promise<Response> {
  try {
    const response = await instance.patch<Response>(url, data, config)
    return Promise.resolve(response.data)
  } catch (err: any) {
    if (onError) onError(err)
    else Message.error(err.msg)

    return Promise.reject(err)
  }
}
