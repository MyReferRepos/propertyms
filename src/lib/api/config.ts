/**
 * API Configuration
 * 配置API基础信息
 */

export const API_CONFIG = {
  // API基础URL，可以从环境变量读取
  // 在开发环境使用 '/api'，生产环境从环境变量读取
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  // 请求超时时间（毫秒）
  timeout: 30000,

  // 请求头配置
  headers: {
    'Content-Type': 'application/json',
  },
} as const

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register',
    profile: '/auth/profile',
    changePassword: '/auth/change-password', // 用户修改自己的密码
  },

  // 用户相关
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    batchDelete: '/users/batch-delete',
    changePassword: (id: string) => `/users/${id}/password`,
    changeStatus: (id: string) => `/users/${id}/status`,
  },

  // 角色相关
  roles: {
    list: '/roles',
    detail: (id: string) => `/roles/${id}`,
    create: '/roles',
    update: (id: string) => `/roles/${id}`,
    delete: (id: string) => `/roles/${id}`,
    permissions: (id: string) => `/roles/${id}/permissions`,
  },

  // 权限相关
  permissions: {
    list: '/permissions',
    tree: '/permissions/tree',
    detail: (id: string) => `/permissions/${id}`,
    create: '/permissions',
    update: (id: string) => `/permissions/${id}`,
    delete: (id: string) => `/permissions/${id}`,
  },

  // 菜单组管理
  menuGroups: {
    list: '/menu-groups',
    detail: (id: string) => `/menu-groups/${id}`,
    create: '/menu-groups',
    update: (id: string) => `/menu-groups/${id}`,
    delete: (id: string) => `/menu-groups/${id}`,
    batchDelete: '/menu-groups/batch-delete',
  },

  // 菜单管理（统一菜单表）
  menus: {
    sidebar: '/menus/sidebar',
    list: '/menus',
    tree: '/menus/tree',
    detail: (id: string) => `/menus/${id}`,
    create: '/menus',
    update: (id: string) => `/menus/${id}`,
    delete: (id: string) => `/menus/${id}`,
    batchDelete: '/menus/batch-delete',
    updateSort: '/menus/sort',  // 使用 PUT 方法
  },

  // 可以根据实际业务扩展更多端点
} as const
