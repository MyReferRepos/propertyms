/**
 * JWT Utility Functions
 * JWT 工具函数 - 解码和验证 token
 */

interface JwtPayload {
  exp?: number // 过期时间（Unix 时间戳，秒）
  iat?: number // 签发时间（Unix 时间戳，秒）
  sub?: string // 主题（通常是用户ID）
  [key: string]: unknown
}

/**
 * 解码 JWT token（不验证签名）
 * 注意：这只是解码 payload，不验证 token 的有效性
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JwtPayload
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * 检查 token 是否已过期
 * @param token JWT token 字符串
 * @returns true 如果已过期，false 如果未过期或无法判断
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) {
    return true
  }

  const payload = decodeJwt(token)
  if (!payload || !payload.exp) {
    // 如果无法解码或没有过期时间，认为已过期（安全起见）
    return true
  }

  // exp 是秒级时间戳，Date.now() 是毫秒级
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * 检查 token 是否即将过期（在指定时间内）
 * @param token JWT token 字符串
 * @param beforeSeconds 提前多少秒认为即将过期（默认 5 分钟）
 * @returns true 如果即将过期或已过期
 */
export function isTokenExpiringSoon(
  token: string | null,
  beforeSeconds: number = 5 * 60 // 默认 5 分钟
): boolean {
  if (!token) {
    return true
  }

  const payload = decodeJwt(token)
  if (!payload || !payload.exp) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp - currentTime < beforeSeconds
}

/**
 * 获取 token 的剩余有效时间（秒）
 * @param token JWT token 字符串
 * @returns 剩余秒数，如果已过期或无效返回 0
 */
export function getTokenRemainingTime(token: string | null): number {
  if (!token) {
    return 0
  }

  const payload = decodeJwt(token)
  if (!payload || !payload.exp) {
    return 0
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const remaining = payload.exp - currentTime
  return remaining > 0 ? remaining : 0
}
