/**
 * Auth Storage
 * 认证数据存储管理
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const

/**
 * Token存储服务
 */
export const tokenStorage = {
  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * 设置访问令牌
   */
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  /**
   * 移除访问令牌
   */
  removeAccessToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  /**
   * 设置刷新令牌
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
  },

  /**
   * 移除刷新令牌
   */
  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  /**
   * 清除所有token
   */
  clearTokens(): void {
    this.removeAccessToken()
    this.removeRefreshToken()
  },
}

/**
 * 用户信息存储服务
 */
export const userStorage = {
  /**
   * 获取用户信息
   */
  getUser<T = unknown>(): T | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as T
    } catch {
      return null
    }
  },

  /**
   * 设置用户信息
   */
  setUser<T = unknown>(user: T): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  /**
   * 移除用户信息
   */
  removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },
}
