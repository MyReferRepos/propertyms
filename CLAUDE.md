# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概述

PropertyMS (ZoranMS) 是一个基于 React + TypeScript 的企业级房产管理系统前端，采用 TanStack Router 文件路由和模块化 i18n 架构。

**核心特性**:
- Menu-Permission Driven RBAC 权限体系
- 自动化模块化国际化 (中/英)
- AG Grid Community 表格集成
- shadcn/ui 组件库
- Mock 数据驱动开发

---

## 开发命令

```bash
# 开发模式 (必须验证能否启动)
npm run dev

# 构建 (每次代码调整后必须验证)
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format

# 依赖分析
npm run knip
```

**重要**: 每次调整代码后必须运行 `npm run build` 和 `npm run dev` 验证项目可以顺利编译和启动。

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **核心** | React | 19 |
| **类型** | TypeScript | 5.9 |
| **构建** | Vite | 7 |
| **路由** | TanStack Router | latest |
| **状态** | Zustand + TanStack Query | latest |
| **UI** | shadcn/ui + Tailwind CSS 4 | latest |
| **表格** | AG Grid Community | 34.2 |
| **表单** | React Hook Form + Zod | latest |
| **HTTP** | Axios | latest |

---

## 架构要点

### 1. 文件路由系统 (TanStack Router)

- **路由定义位置**: `src/routes/`
- **认证路由**: `src/routes/_authenticated/` - 需要登录访问
- **公开路由**: `src/routes/(auth)/` - 登录、注册等
- **错误页面**: `src/routes/(errors)/` - 401, 403, 404, 500, 503

**关键文件**:
- `src/routes/_authenticated/route.tsx` - 认证路由布局，包裹所有需要登录的页面
- `src/routeTree.gen.ts` - 自动生成的路由树 (不要手动编辑)

**路由命名规范**:
```typescript
// 基础路由
src/routes/_authenticated/dashboard.tsx → /_authenticated/dashboard

// 嵌套路由
src/routes/_authenticated/properties/index.tsx → /_authenticated/properties
src/routes/_authenticated/properties/$propertyId.tsx → /_authenticated/properties/:propertyId

// 布局路由 (无 UI，仅提供 Outlet)
src/routes/_authenticated/reports.tsx → 布局路由
src/routes/_authenticated/reports.index.tsx → /reports (默认页面)
src/routes/_authenticated/reports.rental-price.tsx → /reports/rental-price
```

### 2. 模块化 i18n 系统

**核心原则**: **所有用户可见文本必须使用 `t()` 函数，严禁硬编码中英文！**

**自动加载机制**:
- 使用 Vite `import.meta.glob` 自动发现翻译文件
- 支持全局翻译和功能模块翻译
- 运行时自动合并翻译命名空间

**目录结构**:
```
src/
├── locales/                  # 全局翻译
│   ├── en/
│   │   ├── common.json      # 通用文本
│   │   ├── nav.json         # 导航菜单
│   │   ├── auth.json        # 认证相关
│   │   └── ...
│   └── zh-CN/
│       └── (同结构)
│
└── features/                 # 功能模块翻译
    ├── dashboard/
    │   └── locales/
    │       ├── en.json
    │       └── zh-CN.json
    └── properties/
        └── locales/
            └── (同结构)
```

**使用方式**:
```typescript
import { useI18n } from '@/lib/i18n'

function MyComponent() {
  const { t, language, setLanguage } = useI18n()

  return (
    <div>
      {/* 全局翻译 */}
      <h1>{t('common.save')}</h1>

      {/* 功能模块翻译 */}
      <p>{t('dashboard.welcome')}</p>

      {/* 带参数的翻译 */}
      <span>{t('user.greeting', { name: 'John' })}</span>
    </div>
  )
}
```

**翻译键命名规范**:
```typescript
// ✅ 正确
'common.save'
'common.cancel'
'nav.dashboard'
'user.list.title'
'error.invalid_email'
'message.save_success'

// ❌ 错误
'text1'              // 无意义
'userNameLabel'      // 驼峰命名
'保存'               // 硬编码中文
'Save'               // 硬编码英文
```

**实现细节**:
- `src/lib/i18n/loader.ts` - 翻译文件自动加载器
- `src/lib/i18n/context.tsx` - i18n Context Provider
- `src/lib/i18n/types.ts` - 类型定义

### 3. API 调用架构

**简化版 HTTP 客户端**: `src/lib/api/client.ts`

```typescript
import { http } from '@/lib/api/client'

// 自动携带 Bearer Token
const response = await http.get('/properties')
const created = await http.post('/properties', data)
const updated = await http.put('/properties/123', data)
await http.delete('/properties/123')
```

**响应拦截器**: 自动提取 `response.data`

**请求拦截器**: 自动添加 `Authorization: Bearer {token}` (从 localStorage 读取)

**API 服务层**:
- `src/services/api/` - API 服务封装
- 每个功能模块一个服务文件 (如 `properties.ts`, `dashboard.ts`)

**后端分页响应格式**:
```typescript
{
  "success": true,
  "data": [{ /* 数据项 */ }],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### 4. 认证系统

**简化版认证服务**: `src/lib/auth/auth-service-simple.ts`

```typescript
import { authService } from '@/lib/auth'

// 登录 (目前为 Mock 实现)
await authService.login({ email, password })

// 登出
await authService.logout()

// 检查认证状态
const isAuth = authService.isAuthenticated()

// 获取当前用户
const user = authService.getStoredUser()
```

**存储位置**: `localStorage`
- `access_token` - 访问令牌
- `refresh_token` - 刷新令牌
- `user` - 用户信息 (JSON)

**测试账号**:
- Email: `admin@example.com`
- Password: `NewPass@123`

### 5. 功能模块组织

**目录结构** (Feature-based):
```
src/features/
├── auth/                # 认证
├── dashboard/           # 仪表盘
├── properties/          # 房产管理
│   ├── pages/          # 页面组件
│   ├── components/     # 功能组件
│   └── locales/        # 模块翻译
├── tenancies/          # 租约管理
├── tenants/            # 租客管理
├── compliance/         # 合规检查
├── reports/            # 报表
├── ai-insights/        # AI 洞察
└── ...
```

**当前功能模块**:
- `auth` - 登录、注册、OTP
- `dashboard` - 仪表盘
- `properties` - 房产管理
- `tenancies` - 租约管理
- `tenants` - 租客管理
- `compliance` - 合规检查
- `reports` - 报表 (包括租金价格报告)
- `ai-insights` - AI 洞察
- `ai-features` - AI 功能 (Property Pilot)
- `maintenance` - 维护管理
- `financials` - 财务管理
- `inspections` - 检查管理
- `investor` - 投资者仪表盘
- `settings` - 设置
- `errors` - 错误页面

### 6. 表格实现

**简单表格**: 使用 shadcn/ui 或 shadcn-admin 的 data-table

**复杂表格**: 使用 AG Grid Community 版本
- 组件位置: `src/components/data-table/ag-grid-table.tsx`
- 仅使用社区版功能，企业功能自行封装

**服务端分页组件**: `src/components/data-table/server-pagination.tsx`

### 7. Mock 数据

**位置**: `src/data/mock/`

**可用数据集**:
- `properties.ts` - 房产数据
- `tenancies.ts` - 租约数据
- `tenants.ts` - 租客数据
- `owners.ts` - 业主数据
- `maintenance.ts` - 维护记录
- `compliance.ts` - 合规数据
- `ai-insights.ts` - AI 洞察
- `tenant-credit.ts` - 租客信用
- `investment-data.ts` - 投资数据

### 8. UI 组件

**shadcn/ui 组件**: `src/components/ui/`
- ESLint 配置已忽略此目录 (自动生成代码)
- 通过 `components.json` 管理

**布局组件**: `src/components/layout-v2/`
- `app-shell.tsx` - 主应用外壳
- `app-sidebar.tsx` - 侧边栏
- `app-header.tsx` - 顶部导航

**通用组件**:
- `language-switcher.tsx` - 语言切换器
- `theme-switch.tsx` - 主题切换
- `password-input.tsx` - 密码输入框
- `confirm-dialog.tsx` - 确认对话框

---

## 开发规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserListPage`, `PropertyCard` |
| 函数/变量 | camelCase | `getUserById`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY` |
| 类型/接口 | PascalCase | `User`, `ApiResponse` |
| 翻译键 | 小写点分隔 | `user.list.title`, `common.save` |

### TypeScript 规范

1. **优先使用类型推断**
2. **公共 API 必须明确类型定义**
3. **使用 `interface` (除非需要 union/intersection)**
4. **避免 `any`，必要时使用 `unknown`**
5. **强制使用 type-only imports**:
   ```typescript
   import type { User } from './types'
   import { type User, getUser } from './api'
   ```

### 代码风格

**ESLint 规则** (见 `eslint.config.js`):
- `no-console: error` - 禁止 console (生产代码)
- `@typescript-eslint/no-unused-vars: error` - 禁止未使用变量 (支持 `_` 前缀忽略)
- `@typescript-eslint/consistent-type-imports: error` - 强制类型导入
- `no-duplicate-imports: error` - 禁止重复导入

**Prettier 配置**:
- 通过 `.trivago/prettier-plugin-sort-imports` 自动排序导入
- 通过 `prettier-plugin-tailwindcss` 自动排序 Tailwind 类名

---

## 路径别名

```typescript
// tsconfig.json 和 vite.config.ts 配置
"@/*" → "./src/*"

// 示例
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { http } from '@/lib/api/client'
```

---

## 环境变量

```bash
# .env.development (默认)
VITE_API_BASE_URL=http://localhost:5199/api
```

**注意**: 当前 `src/lib/api/client.ts` 硬编码了 `http://localhost:5199/api`，需要时可改为环境变量。

---

## 关键文件说明

### 核心配置
- `vite.config.ts` - Vite 配置 (含 TanStack Router 插件)
- `tsconfig.json` - TypeScript 主配置
- `tsconfig.app.json` - 应用 TypeScript 配置
- `eslint.config.js` - ESLint 配置 (Flat Config)
- `components.json` - shadcn/ui 组件配置

### 路由与布局
- `src/routes/__root.tsx` - 根路由
- `src/routes/_authenticated/route.tsx` - 认证布局路由
- `src/main.tsx` - 应用入口

### 核心库
- `src/lib/api/client.ts` - HTTP 客户端
- `src/lib/auth/auth-service-simple.ts` - 认证服务
- `src/lib/i18n/loader.ts` - i18n 自动加载器
- `src/lib/i18n/context.tsx` - i18n Provider

---

## 常见开发任务

### 添加新的功能模块

1. 创建模块目录:
```bash
src/features/my-feature/
├── pages/
│   └── MyFeaturePage.tsx
├── components/
│   └── MyFeatureCard.tsx
└── locales/
    ├── en.json
    └── zh-CN.json
```

2. 创建路由文件:
```bash
src/routes/_authenticated/my-feature.tsx
```

3. 添加翻译:
```json
// src/features/my-feature/locales/zh-CN.json
{
  "title": "我的功能",
  "description": "功能描述"
}
```

4. 翻译会自动加载到 `myFeature` 命名空间，使用 `t('myFeature.title')`

### 添加新的全局翻译

1. 创建翻译文件:
```bash
src/locales/en/my-module.json
src/locales/zh-CN/my-module.json
```

2. 翻译会自动加载到 `myModule` 命名空间，使用 `t('myModule.key')`

### 添加新的 API 服务

```typescript
// src/services/api/my-service.ts
import { http } from '@/lib/api/client'

export const myService = {
  async getItems() {
    return http.get('/my-items')
  },

  async createItem(data: MyItem) {
    return http.post('/my-items', data)
  }
}
```

---

## 数据库命名规范 (后端参考)

遵循用户全局 CLAUDE.md 中的数据库命名约定:

**表命名**: 小写下划线，单数形式
- `auth_user`, `sales_order`, `property_info`

**字段命名**:
- 主键: `id`
- 外键: `{table}_id` (如 `user_id`, `property_id`)
- 时间: `created_at`, `updated_at` (UTC)
- 状态: `status`
- 布尔: `is_active`, `has_paid`
- 逻辑删除: `deleted_at`

**索引与约束**:
- 主键: `pk_{table}`
- 唯一: `uk_{table}_{column}`
- 外键: `fk_{table}_{column}`
- 索引: `idx_{table}_{column}`

---

## 注意事项

1. **国际化强制要求**: 所有 UI 文本必须使用 `t()` 函数
2. **构建验证**: 每次代码调整后必须运行 `npm run build` 和 `npm run dev`
3. **AG Grid 限制**: 仅使用社区版功能
4. **路由自动生成**: `src/routeTree.gen.ts` 由 TanStack Router 插件自动生成，不要手动编辑
5. **ESLint 忽略**: `src/components/ui/` 目录已在 ESLint 配置中忽略

---

## 相关文档

项目中有大量详细文档，按需查阅:

**架构设计**:
- `API_SPEC.md` - API 接口规范
- `AUTH_ARCHITECTURE_EXPLANATION.md` - 认证架构说明
- `ROUTES_DOCUMENTATION.md` - 路由文档

**国际化**:
- `I18N_MODULAR_GUIDE.md` - 模块化 i18n 指南
- `I18N_QUICK_START.md` - i18n 快速开始
- `I18N_MIGRATION_COMPLETE.md` - i18n 迁移完成报告

**表格与分页**:
- `AG_GRID_DEMO.md` - AG Grid 使用示例
- `SERVER_PAGINATION_GUIDE.md` - 服务端分页指南

**后端对接**:
- `BACKEND_API_SPECIFICATION.md` - 后端 API 规范
- `BACKEND_DATABASE_SCHEMA_GUIDE.md` - 后端数据库模式
- `API_DIFF_REPORT.md` - API 差异报告

**开发指南**:
- `DEVELOPMENT_GUIDELINES.md` - 开发指南
- `QUICKSTART.md` - 快速开始
- `FRAMEWORK.md` - 框架说明

---

**文档版本**: 2.0
**最后更新**: 2025-12-03
**维护者**: Development Team
- > 这是个MVP的Demo,只用来分析和展示功能. 暂时不考虑后端.
- 允许你直接操作git,github进行所有分支和版本控制操作.