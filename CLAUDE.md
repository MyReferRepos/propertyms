# ZoranMS Frontend - Claude Code 指导文档

**最后更新**: 2025-10-21
**版本**: 1.0

---

## 📋 项目概述

ZoranMS前端是一个基于React + TypeScript + TanStack Router的企业级管理系统，实现了完整的Menu-Permission Driven RBAC权限体系。

---

## 🏗️ 技术栈

| 分类 | 技术选型 |
|------|---------|
| **核心框架** | React 18 + TypeScript 5 |
| **路由** | TanStack Router |
| **状态管理** | Zustand + TanStack Query |
| **UI组件** | shadcn/ui + Tailwind CSS |
| **国际化** | 自定义i18n解决方案 |
| **表单** | React Hook Form + Zod |
| **HTTP客户端** | Axios |
| **构建工具** | Vite |

---

## 🌐 国际化 (i18n) 开发规范

### 核心原则

**所有用户可见的文本都必须支持多语言，禁止硬编码中文或英文文本！**

### 实现方式

#### 1. 使用 `useI18n` Hook

```typescript
import { useI18n } from '@/lib/i18n'

function MyComponent() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{t('page.description')}</p>
    </div>
  )
}
```

#### 2. 翻译键命名规范

```typescript
// ✅ 推荐的命名方式
'common.save'              // 通用文本
'common.cancel'
'common.confirm'

'nav.dashboard'            // 导航菜单
'nav.users'
'nav.settings'

'user.list.title'          // 页面特定文本
'user.list.description'
'user.form.username'
'user.form.email'

'error.required'           // 错误消息
'error.invalid_email'
'error.network'

'message.save_success'     // 成功消息
'message.delete_confirm'

// ❌ 避免的命名方式
'text1', 'label2'          // 无意义的命名
'userNameLabel'            // 驼峰命名（应使用点分隔）
```

#### 3. 定义翻译资源

**文件位置**: `src/lib/i18n/locales/`

**中文 (zh-CN.ts)**:
```typescript
export default {
  common: {
    save: '保存',
    cancel: '取消',
    confirm: '确认',
  },
  nav: {
    dashboard: '仪表盘',
    users: '用户管理',
  },
  user: {
    list: {
      title: '用户列表',
      description: '管理系统用户账号',
    },
  },
}
```

**英文 (en-US.ts)**:
```typescript
export default {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  nav: {
    dashboard: 'Dashboard',
    users: 'User Management',
  },
  user: {
    list: {
      title: 'User List',
      description: 'Manage system user accounts',
    },
  },
}
```

#### 4. 带参数的翻译

```typescript
// 翻译定义
{
  'user.greeting': 'Hello, {{name}}!',
  'user.item_count': 'You have {{count}} items'
}

// 组件中使用
const greeting = t('user.greeting', { name: 'John' })
const itemCount = t('user.item_count', { count: 5 })
```

#### 5. 特殊场景处理

**a. 静态配置数据的多语言**

对于导航菜单等静态配置，使用翻译适配器：

```typescript
import { translateSidebarData } from './data/navigation-i18n'

const translatedData = translateSidebarData(sidebarData, (key, fallback) => {
  return t(key) || fallback || key
})
```

**b. 动态数据的多语言**

对于来自后端的数据（如菜单、权限），后端应返回翻译键：

```typescript
// 后端返回
{
  "title": "nav.dashboard",
  "description": "page.dashboard.desc"
}

// 前端使用
<h1>{t(menu.title)}</h1>
<p>{t(menu.description)}</p>
```

#### 6. 错误提示多语言

```typescript
// 表单验证
const schema = z.object({
  email: z.string().email(t('error.invalid_email')),
  password: z.string().min(8, t('error.password_min_length', { min: 8 })),
})

// API错误
try {
  await api.saveUser(data)
  toast.success(t('message.save_success'))
} catch (error) {
  toast.error(t('error.save_failed'))
}
```

### 检查清单

在提交代码前，确保：

- [ ] 所有按钮、标签、标题都使用了 `t()` 函数
- [ ] 所有错误消息、成功消息都有对应的翻译键
- [ ] 翻译键使用了清晰的命名规范
- [ ] 中英文翻译文件都已更新
- [ ] 无硬编码的中文或英文文本

### 常见错误示例

```typescript
// ❌ 错误：硬编码中文
<Button>保存</Button>
<h1>用户管理</h1>

// ✅ 正确：使用翻译
<Button>{t('common.save')}</Button>
<h1>{t('nav.users')}</h1>

// ❌ 错误：混合使用
<div>
  <span>用户名:</span> {/* 硬编码中文 */}
  <span>{t('user.form.username')}</span>
</div>

// ✅ 正确：全部使用翻译
<div>
  <span>{t('user.form.username_label')}:</span>
  <span>{t('user.form.username')}</span>
</div>
```

---

## 🔐 RBAC权限系统

### 核心概念

1. **权限类型**:
   - `page`: 页面访问权限
   - `api`: API接口权限
   - `button`: 按钮操作权限

2. **权限码格式**: `resource:operation`
   - 示例: `user:view`, `user:create`, `role:assign-permissions`

3. **权限存储**: 登录后存储在 `localStorage.permissions`

### 使用权限

#### 1. 路由守卫

```typescript
// 单个权限
export const Route = createFileRoute('/_authenticated/users')({
  beforeLoad: async () => {
    requirePermission('user:view')
  },
})

// 任意权限（OR逻辑）
export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: async () => {
    requireAnyPermission(['user:view', 'role:view'])
  },
})

// 所有权限（AND逻辑）
export const Route = createFileRoute('/_authenticated/super-admin')({
  beforeLoad: async () => {
    requireAllPermissions(['user:view', 'user:delete'])
  },
})
```

#### 2. UI组件权限控制

```typescript
import { hasPermission } from '@/lib/auth/permission-utils'

function UserActions() {
  return (
    <>
      {hasPermission('user:create') && (
        <Button>Create User</Button>
      )}
      {hasPermission('user:delete') && (
        <Button variant="destructive">Delete</Button>
      )}
    </>
  )
}
```

#### 3. 使用authService

```typescript
import { authService } from '@/lib/auth'

// 检查权限
if (authService.hasPermission('user:create')) {
  // 显示创建按钮
}

// 检查多个权限
if (authService.hasAnyPermission(['user:view', 'role:view'])) {
  // 显示管理菜单
}
```

---

## 📁 目录结构规范

```
src/
├── components/          # 通用组件
│   ├── ui/             # shadcn/ui组件
│   └── layout/         # 布局组件
├── features/           # 功能模块（按业务领域组织）
│   ├── users/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   └── menu/
├── lib/                # 核心库
│   ├── api/           # API配置
│   ├── auth/          # 认证模块
│   └── i18n/          # 国际化
├── routes/            # 路由定义
└── services/          # 跨模块服务
```

---

## 🎨 组件开发规范

### 1. 组件命名

```typescript
// ✅ 推荐：PascalCase，清晰描述功能
UserListPage.tsx
UserCreateDialog.tsx
PermissionSelector.tsx

// ❌ 避免：模糊不清的命名
list.tsx
dialog.tsx
selector.tsx
```

### 2. Props类型定义

```typescript
interface UserListPageProps {
  defaultPageSize?: number
  onUserCreate?: (user: User) => void
}

export function UserListPage({
  defaultPageSize = 10,
  onUserCreate
}: UserListPageProps) {
  // ...
}
```

### 3. 导出规范

```typescript
// features/users/index.ts
export { UserListPage } from './pages/UserListPage'
export { UserCreateDialog } from './components/UserCreateDialog'
export * from './types'
export { userService } from './services/user-service'
```

---

## 🔄 状态管理规范

### 1. 使用Zustand管理全局状态

```typescript
// stores/auth-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (credentials) => {
      // ...
    },
    logout: async () => {
      // ...
    },
  }))
)
```

### 2. 使用TanStack Query管理服务端状态

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// 查询
const { data, isLoading } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => userService.getUsers(filters),
})

// 变更
const mutation = useMutation({
  mutationFn: userService.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

---

## 📝 代码风格

### TypeScript规范

1. **优先使用类型推断**
2. **明确定义公共API的类型**
3. **使用接口而非type（除非需要union/intersection）**
4. **避免使用any，必要时使用unknown**

### 命名规范

- **组件**: PascalCase (`UserListPage`)
- **函数/变量**: camelCase (`getUserById`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **类型/接口**: PascalCase (`User`, `UserQueryParams`)
- **翻译键**: 小写点分隔 (`user.list.title`)

---

## 🧪 测试规范

### 组件测试

```typescript
import { render, screen } from '@testing-library/react'
import { UserListPage } from './UserListPage'

describe('UserListPage', () => {
  it('should render user list', () => {
    render(<UserListPage />)
    expect(screen.getByText(t('user.list.title'))).toBeInTheDocument()
  })
})
```

---

## 📚 相关文档

- **后端架构**: `../webapi/document/ARCHITECTURE.md`
- **API规范**: `../webapi/document/API_SPECIFICATION.md`
- **重构总结**: `../document/RBAC_REFACTORING_SUMMARY.md`
- **API使用清单**: `../document/FRONTEND_API_USAGE.md`

---

## 🚀 开发工作流

1. **启动开发服务器**: `npm run dev`
2. **类型检查**: `npm run type-check`
3. **代码格式化**: `npm run format`
4. **构建**: `npm run build`
5. **预览构建**: `npm run preview`

---

## ⚠️ 重要注意事项

1. **所有文本必须国际化** - 使用 `t()` 函数，禁止硬编码
2. **权限检查必须全面** - 路由守卫 + UI组件双重保护
3. **类型安全优先** - 确保所有公共API都有明确的类型定义
4. **遵循单一职责** - 组件、服务、工具函数都应职责清晰
5. **及时清理代码** - 移除未使用的导入、注释掉的代码

---

**文档版本**: 1.0
**最后更新**: 2025-10-21
**维护者**: Development Team
- 每次调整完代码使用npm run build 和 npm run dev验证项目是否可以顺利编译和启动.
- 测试管理员账号密码，email: admin@example.com password: NewPass@123
- 1, 开发时简单表格使用shadcn ui或者shadcn-admin的data table. 2, 复杂表格使用AG Grid社区版
- 后端api返回的分页数据返回格式结构参考:{
  "success": true,
  "data": [
    {"field1":"value1","field2":"value2"},
    {"field1":"value1","field2":"value2"}
  ],
  "pagination": {
    "total": 0,
    "page": 0,
    "pageSize": 0,
    "totalPages": 0
  }
}