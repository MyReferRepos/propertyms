# SKUIKIT Framework Documentation

## 项目概述

**SKUIKIT** 是一个现代化的企业级前端开发框架，集成了以下核心功能：

- API 交互管理（Axios）
- 认证授权系统（Token-based）
- 国际化支持（i18next）
- 高性能表格组件（AG Grid Community）

## 技术栈

### 核心技术
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **路由**: TanStack Router
- **状态管理**: Zustand
- **UI组件**: Shadcn UI (TailwindCSS + RadixUI)
- **表格**: AG Grid Community Edition

### 核心功能模块
- **HTTP客户端**: Axios
- **国际化**: i18next + react-i18next
- **认证**: 自定义Token-based认证系统
- **表单**: React Hook Form + Zod

## 项目结构

```
src/
├── lib/                          # 核心库和工具
│   ├── api/                      # API交互模块
│   │   ├── config.ts            # API配置
│   │   ├── types.ts             # API类型定义
│   │   ├── interceptors.ts      # 请求/响应拦截器
│   │   ├── client.ts            # HTTP客户端封装
│   │   └── index.ts
│   ├── auth/                     # 认证授权模块
│   │   ├── types.ts             # 认证类型定义
│   │   ├── storage.ts           # Token存储管理
│   │   ├── auth-service.ts      # 认证服务
│   │   ├── auth-store.ts        # 认证状态管理
│   │   └── index.ts
│   └── i18n/                     # 国际化模块
│       ├── config.ts            # i18n配置
│       ├── hooks.ts             # i18n Hooks
│       ├── locales/             # 语言文件
│       │   ├── en.json
│       │   └── zh.json
│       └── index.ts
├── components/
│   ├── auth/                     # 认证相关组件
│   │   ├── protected-route.tsx  # 路由守卫
│   │   └── permission-guard.tsx # 权限守卫
│   ├── i18n/                     # 国际化组件
│   │   └── language-switcher.tsx # 语言切换器
│   └── data-table/               # 表格组件
│       ├── ag-grid-table.tsx    # AG Grid封装
│       └── index.ts
└── routes/                       # 路由页面
    └── demo.tsx                  # 功能演示页面
```

## 核心功能使用指南

### 1. API 交互

#### 基础配置

在 `.env` 文件中配置API基础URL：

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

#### 使用示例

```typescript
import { http, API_ENDPOINTS } from '@/lib/api'

// GET请求
const response = await http.get(API_ENDPOINTS.users.list)

// POST请求
const data = await http.post(API_ENDPOINTS.auth.login, {
  email: 'user@example.com',
  password: 'password'
})

// 文件上传
await http.upload('/upload', file, (progress) => {
  console.log(`Upload progress: ${progress.loaded}/${progress.total}`)
})

// 文件下载
await http.download('/download/file.pdf', 'document.pdf')
```

#### 请求拦截器特性

- 自动添加 Bearer Token
- 自动处理401错误并刷新Token
- 统一错误处理和提示
- 开发环境下的请求日志

### 2. 认证授权系统

#### 登录

```typescript
import { useAuthStore } from '@/lib/auth'

function LoginComponent() {
  const { login } = useAuthStore()

  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password'
    })
  }

  return <button onClick={handleLogin}>Login</button>
}
```

#### 路由保护

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route'

function ProtectedPage() {
  return (
    <ProtectedRoute
      requiredRole="admin"
      requiredPermission="users:write"
    >
      <YourProtectedContent />
    </ProtectedRoute>
  )
}
```

#### 权限控制

```typescript
import { PermissionGuard } from '@/components/auth/permission-guard'

function Component() {
  return (
    <PermissionGuard permission="users:delete">
      <Button>Delete User</Button>
    </PermissionGuard>
  )
}
```

#### 获取当前用户

```typescript
import { useAuthStore } from '@/lib/auth'

function UserProfile() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return <div>Please login</div>

  return (
    <div>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  )
}
```

### 3. 国际化 (i18n)

#### 使用翻译

```typescript
import { useI18n } from '@/lib/i18n'

function MyComponent() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.save')}</button>
    </div>
  )
}
```

#### 切换语言

```typescript
import { LanguageSwitcher } from '@/components/i18n/language-switcher'

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  )
}
```

#### 添加新语言

1. 在 `src/lib/i18n/config.ts` 中添加语言定义：

```typescript
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '简体中文', flag: '🇨🇳' },
  es: { name: 'Español', flag: '🇪🇸' }, // 新增
}
```

2. 创建语言文件 `src/lib/i18n/locales/es.json`

3. 在 `config.ts` 中导入并注册

### 4. AG Grid 表格

> ⚠️ **重要提示**: 本项目仅使用 **AG Grid Community Edition**，不使用任何企业版功能。
>
> 禁止使用的企业版功能包括：
> - `enableRangeSelection` - 范围选择
> - `enableCharts` - 图表功能
> - `sideBar` - 侧边栏
> - `masterDetail` - 主从表
> - Excel导出、透视表等其他企业功能
>
> 详见：https://www.ag-grid.com/react-data-grid/licensing/

#### 基础使用

```typescript
import { AgGridTable } from '@/components/data-table'
import type { ColDef } from 'ag-grid-community'

interface User {
  id: string
  name: string
  email: string
}

function UserTable() {
  const users: User[] = [
    { id: '1', name: 'John', email: 'john@example.com' }
  ]

  const columnDefs: ColDef<User>[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
  ]

  return (
    <AgGridTable
      rowData={users}
      columnDefs={columnDefs}
      pagination
      paginationPageSize={10}
    />
  )
}
```

#### 高级功能（仅社区版）

```typescript
<AgGridTable
  rowData={data}
  columnDefs={columns}
  height="600px"
  pagination
  paginationPageSize={20}
  onRowClicked={(data) => console.log('Clicked:', data)}
  onSelectionChanged={(rows) => console.log('Selected:', rows)}
  gridOptions={{
    rowSelection: {                // 行选择配置（v32.2+）
      mode: 'multiRow',           // 多行选择模式
      checkboxes: true,           // 启用复选框
      headerCheckbox: true,       // 列头全选框
      enableClickSelection: false, // 禁用行点击选择
    },
    animateRows: true,             // 行动画
    paginationPageSizeSelector: [20, 50, 100],  // 分页大小选择器
  }}
/>
```

## 环境配置

创建 `.env` 文件：

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 最佳实践

### API调用

1. 将API端点定义在 `src/lib/api/config.ts` 中
2. 使用TypeScript类型定义请求和响应
3. 在拦截器中统一处理错误

### 认证

1. 所有需要认证的页面使用 `ProtectedRoute` 包裹
2. 敏感操作使用 `PermissionGuard` 进行权限控制
3. Token自动刷新已内置，无需手动处理

### 国际化

1. 所有用户可见文本都应该使用 `t()` 函数
2. 按功能模块组织翻译文件
3. 使用插值语法处理动态内容

### 表格

1. 优先使用AG Grid处理大数据集
2. 合理使用分页减少性能开销
3. 根据需要启用过滤、排序等功能

## 常见问题

### Q: 如何自定义API拦截器？

A: 编辑 `src/lib/api/interceptors.ts` 文件，添加你的自定义逻辑。

### Q: 如何添加新的路由守卫规则？

A: 在 `ProtectedRoute` 组件中添加额外的判断逻辑，或创建新的守卫组件。

### Q: AG Grid样式如何自定义？

A: AG Grid支持CSS变量自定义，参考官方文档：https://www.ag-grid.com/react-data-grid/themes/

### Q: 如何处理API错误？

A: 所有API错误都会在拦截器中统一处理，并通过 `toast` 显示错误信息。

## 更多资源

- [shadcn-admin 官方文档](https://github.com/satnaing/shadcn-admin)
- [TanStack Router 文档](https://tanstack.com/router)
- [AG Grid 文档](https://www.ag-grid.com/react-data-grid/)
- [i18next 文档](https://www.i18next.com/)
- [Zustand 文档](https://github.com/pmndrs/zustand)

## 贡献

欢迎提交 Issue 和 Pull Request！

## License

MIT
