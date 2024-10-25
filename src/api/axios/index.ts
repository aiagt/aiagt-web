import instance from './instance.ts'
import { AxiosRequestConfig } from 'axios'

export interface Response {
  code: number;
  msg: string;
  data?: any;
}


export async function get(url: string, params?: object | undefined): Promise<Response> {
  const response = await instance.get<Response>(url, { params })
  return Promise.resolve(response.data)
}

export async function post(url: string, data?: object | undefined, config?: AxiosRequestConfig<object> | undefined): Promise<Response> {
  const response = await instance.post<Response>(url, data, config)
  return Promise.resolve(response.data)
}

export async function put(url: string, data?: object | undefined, config?: AxiosRequestConfig<object> | undefined): Promise<Response> {
  const response = await instance.put<Response>(url, data, config)
  return Promise.resolve(response.data)
}

export async function del(url: string, config?: AxiosRequestConfig<any>): Promise<Response> {
  const response = await instance.delete<Response>(url, config)
  return Promise.resolve(response.data)
}

export async function patch(url: string, data?: object | undefined, config?: AxiosRequestConfig<object> | undefined): Promise<Response> {
  const response = await instance.patch<Response>(url, data, config)
  return Promise.resolve(response.data)
}
