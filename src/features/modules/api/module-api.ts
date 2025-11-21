/**
 * Module API Service
 * 模块管理API服务
 */

import { http } from '@/lib/api/client'
import type { Module, ModuleListItem, CreateModuleRequest, UpdateModuleRequest } from '../types'

const BASE_URL = '/modules'

export class ModuleApi {
  /**
   * 获取模块列表
   * @param activeOnly 是否只获取激活的模块
   */
  async list(activeOnly: boolean = false): Promise<ModuleListItem[]> {
    const response: any = await http.get(BASE_URL, {
      params: { activeOnly }
    })
    return response.data || []
  }

  /**
   * 获取单个模块详情
   * @param id 模块ID
   */
  async get(id: string): Promise<Module> {
    const response: any = await http.get(`${BASE_URL}/${id}`)
    return response.data
  }

  /**
   * 创建模块
   * @param data 创建数据
   */
  async create(data: CreateModuleRequest): Promise<Module> {
    const response: any = await http.post(BASE_URL, data)
    return response.data
  }

  /**
   * 更新模块
   * @param id 模块ID
   * @param data 更新数据
   */
  async update(id: string, data: UpdateModuleRequest): Promise<Module> {
    const response: any = await http.put(`${BASE_URL}/${id}`, data)
    return response.data
  }

  /**
   * 删除模块
   * @param id 模块ID
   */
  async delete(id: string): Promise<void> {
    await http.delete(`${BASE_URL}/${id}`)
  }
}

export const moduleApi = new ModuleApi()
