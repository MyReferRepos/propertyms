# Auth 架构说明 - Mock vs 真实后端

**日期**: 2025-10-23
**问题**: Auth 相关的用户登录逻辑是否应该放在 Mock 中？

---

## ✅ 好消息：架构是正确的！

### 当前架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端应用                                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  登录组件 (Login Page)                                     │   │
│  │  - 收集用户名/密码                                         │   │
│  │  - 调用 authService.login()                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AuthService (auth-service.ts) ✅ 正确                     │   │
│  │  - 调用 http.post('/api/auth/login')                     │   │
│  │  - 存储 token 和用户信息                                  │   │
│  │  - 没有业务逻辑！只负责 API 调用                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HTTP Client (http.ts)                                    │   │
│  │  - 发送 HTTP 请求                                         │   │
│  │  - 处理响应/错误                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          ↓
        ┌────────────────────────────────────┐
        │  环境判断: Mock 还是真实后端？      │
        └────────────────────────────────────┘
                          ↓
        ┌─────────────────┴──────────────────┐
        │                                    │
        ↓                                    ↓
┌──────────────────────┐        ┌────────────────────────┐
│  开发环境 (Dev)       │        │  生产环境 (Production)  │
│                      │        │                        │
│  Mock API Plugin     │        │  真实后端 API           │
│  (mockPlugin.ts)     │        │  (Backend Server)      │
│                      │        │                        │
│  拦截 API 请求       │        │  真实的登录逻辑         │
│  返回模拟数据        │        │  - 数据库查询          │
│                      │        │  - 密码验证            │
│  ⚠️ 包含验证逻辑     │        │  - JWT 生成            │
│  但这是临时的！      │        │  - 会话管理            │
└──────────────────────┘        └────────────────────────┘
```

---

## 📊 代码责任划分

### ✅ 前端 AuthService (正确的架构)

**文件**: `src/lib/auth/auth-service.ts`

```typescript
class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // ✅ 只负责调用 API，没有业务逻辑
    const response = await http.post<LoginResponse>(
      API_ENDPOINTS.auth.login,  // '/api/auth/login'
      credentials
    )

    if (response.success && response.data) {
      // ✅ 只负责存储响应数据
      tokenStorage.setAccessToken(response.data.accessToken)
      tokenStorage.setRefreshToken(response.data.refreshToken)
      userStorage.setUser(response.data.user)
    }

    return response.data
  }
}
```

**责任** ✅:
- 调用 API
- 存储 token 和用户信息
- 提供权限检查方法（基于本地存储）

**不负责** ✅:
- ❌ 密码验证
- ❌ 用户状态检查
- ❌ Token 生成
- ❌ 数据库操作

---

## 🎭 Mock API 的作用

### ⚠️ Mock Handler (开发环境临时方案)

**文件**: `src/mocks/handlers/auth.ts`

```typescript
export async function handleLogin(body: LoginRequest) {
  // ⚠️ 这些逻辑在生产环境由后端处理
  const user = getUserByEmail(email)          // 临时：查询 mock 数据
  if (!verifyPassword(email, password)) {     // 临时：验证密码
    throw createErrorResponse('Invalid', 401)
  }
  if (user.status === 'suspended') {          // 临时：状态检查
    throw createErrorResponse('Suspended', 403)
  }

  // 临时：生成假的 token
  const accessToken = generateToken(user.id, 3600)

  return { user, accessToken, refreshToken }
}
```

**作用**:
- ⚠️ **临时模拟**后端行为
- ⚠️ 仅在开发环境生效
- ⚠️ 生产环境会被禁用

**生效条件**:
```typescript
// vite.config.ts
process.env.NODE_ENV !== 'production' &&    // 非生产环境
process.env.VITE_USE_MOCK_API !== 'false' && // Mock 已启用
mockApiPlugin(),
```

---

## 🔄 请求流程对比

### 开发环境（使用 Mock）

```
用户输入用户名密码
    ↓
authService.login({ email, password })
    ↓
http.post('/api/auth/login', { email, password })
    ↓
mockApiPlugin 拦截请求
    ↓
handlers/auth.ts → handleLogin()
    ↓
⚠️ Mock 验证逻辑（临时）:
   - 查找用户（mock 数据）
   - 验证密码（简单比较）
   - 检查状态
   - 生成假 token
    ↓
返回响应 { user, accessToken, refreshToken }
    ↓
前端存储 token 和用户信息
```

### 生产环境（真实后端）

```
用户输入用户名密码
    ↓
authService.login({ email, password })
    ↓
http.post('/api/auth/login', { email, password })
    ↓
发送到后端服务器 (https://api.zoranms.com)
    ↓
✅ 后端验证逻辑（真实）:
   - 查询数据库
   - bcrypt 验证密码
   - 检查用户状态
   - 生成真实 JWT token
   - 记录登录日志
   - 更新最后登录时间
    ↓
返回响应 { user, accessToken, refreshToken }
    ↓
前端存储 token 和用户信息
```

---

## ✅ 为什么这样设计是正确的？

### 1. 前端不知道 Mock 的存在

```typescript
// 登录组件
import { authService } from '@/lib/auth'

function LoginPage() {
  const handleLogin = async (data: LoginRequest) => {
    // ✅ 组件不关心是 Mock 还是真实 API
    await authService.login(data)
  }
}
```

### 2. 环境切换无需修改代码

```typescript
// 开发环境
VITE_USE_MOCK_API=true   → 使用 Mock API

// 生产环境
VITE_USE_MOCK_API=false  → 使用真实 API
```

### 3. Mock 只是临时替代

```
Mock 的目的:
✅ 前端独立开发（后端未完成时）
✅ 快速原型验证
✅ UI 测试
✅ 演示

Mock 不是:
❌ 真正的业务逻辑
❌ 生产环境方案
❌ 永久性代码
```

---

## ⚠️ 你的担忧是对的！

### 问题：Mock 中的逻辑太复杂了

**当前 Mock Handler** (~80 行):
```typescript
export async function handleLogin(body: LoginRequest) {
  // 验证用户
  const user = getUserByEmail(email)
  if (!user) throw error

  // 验证密码
  if (!verifyPassword(email, password)) throw error

  // 检查状态
  if (user.status === 'suspended') throw error
  if (user.status === 'inactive') throw error
  if (user.status === 'pending') throw error

  // 构造响应
  const authUser = { ...user }

  // 生成 tokens
  const accessToken = generateToken(user.id, 3600)
  const refreshToken = generateToken(user.id, 86400 * 7)

  return { user: authUser, accessToken, refreshToken }
}
```

### 简化方案：Mock 应该只返回数据

**简化的 Mock Handler** (~20 行):
```typescript
export async function handleLogin(body: LoginRequest) {
  const { email, password } = body

  // 简单查找用户（不验证密码）
  const user = mockUsers.find(u => u.email === email)
  if (!user) {
    throw createErrorResponse('Invalid credentials', 401)
  }

  // 直接返回预设数据
  return {
    user: user,
    accessToken: 'mock-access-token-' + user.id,
    refreshToken: 'mock-refresh-token-' + user.id,
  }
}
```

**优点**:
- ✅ Mock 更简单
- ✅ 更清楚这是假数据
- ✅ 开发更快

**缺点**:
- ⚠️ 不能测试错误场景（密码错误、账号被禁用等）
- ⚠️ 开发体验稍差

---

## 🎯 建议的改进方案

### 选项1: 保持当前设计（推荐）✅

**理由**:
- ✅ Mock 虽然复杂，但提供了真实的错误处理
- ✅ 可以测试各种场景（密码错误、账号状态等）
- ✅ 前端开发体验更好
- ✅ 生产环境会被完全禁用

**注意事项**:
```typescript
// 在文件顶部添加醒目注释
/**
 * ⚠️ MOCK DATA ONLY - FOR DEVELOPMENT
 *
 * This file simulates backend authentication logic for development.
 * In production, all logic below is handled by the real backend API.
 *
 * DO NOT use this for production!
 * Real backend should implement:
 * - Database queries
 * - bcrypt password hashing
 * - JWT token generation
 * - Session management
 * - Logging and auditing
 */
```

### 选项2: 简化 Mock（如果你更喜欢）

```typescript
/**
 * Simplified Mock - Just returns data
 * Use this if you prefer minimal mock logic
 */
export async function handleLogin(body: LoginRequest) {
  const user = mockUsers.find(u => u.email === body.email)

  // For development only: accept any password
  if (!user) {
    throw createErrorResponse('User not found', 401)
  }

  return {
    user,
    accessToken: `mock-token-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
  }
}
```

### 选项3: 使用真实后端（最终方案）

**步骤**:
1. 后端实现 `POST /api/auth/login`
2. 前端配置代理或 CORS
3. 禁用 Mock:
   ```bash
   VITE_USE_MOCK_API=false
   ```

---

## 📝 后端应该实现什么？

### 后端 Auth API 清单

**必需端点**:

#### 1. POST /api/auth/login
```typescript
// 请求
{
  "email": "admin@zoranms.com",
  "password": "password123"
}

// 响应
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@zoranms.com",
      "username": "admin",
      "displayName": "Administrator",
      "roles": ["ADMIN"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**后端责任**:
- ✅ 查询数据库获取用户
- ✅ 使用 bcrypt 验证密码
- ✅ 检查用户状态（active/suspended/inactive）
- ✅ 生成 JWT access token（1小时过期）
- ✅ 生成 JWT refresh token（7天过期）
- ✅ 更新用户最后登录时间
- ✅ 记录登录日志
- ✅ 返回用户信息和 tokens

#### 2. POST /api/auth/refresh
```typescript
// 刷新 token
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 3. POST /api/auth/logout
```typescript
// 登出（清除 session，加入黑名单等）
```

#### 4. GET /api/auth/profile
```typescript
// 获取当前用户信息 + 权限 + 菜单
{
  "user": { ... },
  "permissions": ["user:view", "user:create"],
  "menus": [...]
}
```

---

## 🚀 迁移到真实后端的步骤

### Phase 1: 后端准备
1. ✅ 实现 Auth API（参考 `BACKEND_API_SPECIFICATION.md`）
2. ✅ 使用提供的数据库结构（`BACKEND_DATABASE_SCHEMA_GUIDE.md`）
3. ✅ 插入种子数据（`backend_seed_data.sql`）

### Phase 2: 前端配置
```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:3000/api  # 后端地址
VITE_USE_MOCK_API=false                       # 禁用 Mock
```

### Phase 3: 测试
```bash
# 启动后端
cd backend
npm run dev

# 启动前端
cd frontend
npm run dev

# 测试登录
http://localhost:5173/sign-in
```

### Phase 4: 移除 Mock（可选）
```bash
# 生产环境构建会自动排除 Mock
npm run build

# 或者完全删除 Mock 文件
rm -rf src/mocks
```

---

## ✅ 结论

### 当前架构是正确的！

1. ✅ **前端 AuthService**: 只负责 API 调用，没有业务逻辑
2. ✅ **Mock Handler**: 临时模拟后端，仅开发环境使用
3. ✅ **真实后端**: 将实现所有认证逻辑

### Mock 中的逻辑是可接受的

虽然 Mock 包含验证逻辑，但这是为了：
- 提供更好的开发体验
- 测试各种错误场景
- 不影响生产环境

### 下一步

**短期**（当前）:
- ✅ 继续使用 Mock 开发前端
- ✅ Mock 提供了足够真实的响应

**中期**（后端就绪）:
- ✅ 后端实现 Auth API
- ✅ 禁用 Mock，连接真实后端

**长期**（生产环境）:
- ✅ Mock 完全禁用
- ✅ 所有逻辑在后端

---

**文档更新**: 2025-10-23
**结论**: 架构合理，Mock 是临时方案 ✅
