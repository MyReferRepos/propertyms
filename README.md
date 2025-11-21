# ZoranMS WebUI

<div align="center">

**企业级管理系统前端框架 - Menu-Permission Driven RBAC**

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](./README.md) | [简体中文](./README.zh-CN.md)

</div>

---

## 📋 目录

- [项目简介](#-项目简介)
- [核心特性](#-核心特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [核心功能](#-核心功能)
- [开发指南](#-开发指南)
- [部署](#-部署)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

---

## 🎯 项目简介

ZoranMS WebUI 是一个现代化的企业级管理系统前端框架，采用 **Menu-Permission Driven RBAC** 架构设计，提供完整的用户权限管理、动态菜单配置和国际化支持。

### 设计理念

- **🔐 安全第一** - 完整的Token认证机制和细粒度权限控制
- **🎨 开箱即用** - 预配置的完整解决方案，无需从零开始
- **🌍 国际化** - 内置中英文支持，易于扩展多语言
- **📱 响应式设计** - 适配各种设备屏幕
- **⚡ 性能优化** - 基于Vite构建，开发体验极佳
- **🧩 模块化架构** - 清晰的代码组织，易于维护和扩展

---

## ✨ 核心特性

### 🔐 认证与授权

- ✅ **JWT Token认证** - 支持access token和refresh token
- ✅ **自动Token刷新** - 无感知的token续期机制
- ✅ **路由守卫** - 基于权限的路由访问控制
- ✅ **菜单权限** - 动态菜单根据用户权限渲染
- ✅ **按钮权限** - 细粒度的UI元素权限控制

### 📊 用户权限管理 (RBAC)

- ✅ **用户管理** - 完整的用户CRUD操作
- ✅ **角色管理** - 灵活的角色定义和分配
- ✅ **权限管理** - 三种权限类型：页面、API、按钮
- ✅ **权限树** - 层级化的权限组织结构

### 🎨 UI/UX

- ✅ **shadcn/ui组件库** - 基于Radix UI的现代化组件
- ✅ **亮/暗主题** - 自动主题切换
- ✅ **响应式布局** - 移动端友好
- ✅ **AG Grid表格** - 强大的数据表格功能

### 🌍 国际化 (i18n)

- ✅ **多语言支持** - 中文/英文内置
- ✅ **动态语言切换** - 无需刷新页面
- ✅ **易于扩展** - 结构化的翻译文件

### 🍔 菜单管理

- ✅ **动态菜单配置** - 后端API驱动的菜单系统
- ✅ **菜单组管理** - 组织化的菜单结构
- ✅ **菜单项管理** - 完整的菜单CRUD
- ✅ **层级支持** - 支持多级菜单嵌套
- ✅ **图标集成** - Lucide Icons动态映射

---

## 🛠️ 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19 | UI框架 |
| **TypeScript** | 5 | 类型安全 |
| **Vite** | 7 | 构建工具 |
| **TanStack Router** | latest | 文件路由 |
| **Zustand** | latest | 状态管理 |

### UI & 样式

| 技术 | 用途 |
|------|------|
| **shadcn/ui** | 组件库 |
| **Tailwind CSS** | CSS框架 |
| **Radix UI** | 无障碍组件基础 |
| **Lucide Icons** | 图标库 |

### 数据处理

| 技术 | 用途 |
|------|------|
| **TanStack Query** | 数据获取与缓存 |
| **Axios** | HTTP客户端 |
| **React Hook Form** | 表单管理 |
| **Zod** | 数据验证 |
| **AG Grid** | 数据表格 |

### 工具链

| 技术 | 用途 |
|------|------|
| **ESLint** | 代码检查 |
| **Prettier** | 代码格式化 |
| **i18next** | 国际化 |

---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **pnpm** >= 8.0.0

### 1. 克隆项目

```bash
git clone https://github.com/ZoranMS/WebUI.git
cd WebUI
```

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 3. 配置环境变量

创建 `.env.development` 文件：

```env
# API基础URL
VITE_API_BASE_URL=http://localhost:5199/api

# 其他配置
VITE_APP_TITLE=ZoranMS
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 5. 默认登录账号

```
Email: admin@example.com
Password: NewPass@123
```

---

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # shadcn/ui组件
│   ├── layout/         # 布局组件
│   └── auth/           # 认证组件
│
├── features/           # 功能模块（按业务领域组织）
│   ├── users/          # 用户管理
│   │   ├── pages/      # 页面组件
│   │   ├── components/ # 功能组件
│   │   ├── services/   # API服务
│   │   └── types.ts    # 类型定义
│   └── menu/           # 菜单管理
│       ├── menu-groups/
│       ├── menu-items/
│       └── menu-management/
│
├── lib/                # 核心库
│   ├── api/           # API配置
│   │   ├── client.ts  # HTTP客户端
│   │   ├── interceptors.ts  # 拦截器
│   │   └── config.ts  # API端点配置
│   ├── auth/          # 认证模块
│   │   ├── auth-service.ts  # 认证服务
│   │   ├── auth-store.ts    # 认证状态
│   │   └── permission-utils.ts  # 权限工具
│   └── i18n/          # 国际化
│       └── locales/   # 翻译文件
│
├── routes/            # 路由定义（文件路由）
│   ├── _authenticated/ # 需要认证的路由
│   └── auth/          # 认证相关路由
│
└── services/          # 跨模块服务
```

---

## 💡 核心功能

### 1. 认证系统

#### Token管理

```typescript
import { authService } from '@/lib/auth'

// 登录
await authService.login({ email, password })

// 登出
await authService.logout()

// 获取当前用户
const user = authService.getStoredUser()

// 检查权限
const hasPermission = authService.hasPermission('user:create')
```

#### 请求拦截器

所有API请求自动携带Token：

```typescript
// 自动添加 Authorization: Bearer {token}
const users = await http.get('/users')
```

### 2. 权限控制

#### 路由守卫

```typescript
// routes/_authenticated/users/index.tsx
export const Route = createFileRoute('/_authenticated/users')({
  beforeLoad: async () => {
    requirePermission('user:view')
  },
})
```

#### 组件级权限

```typescript
import { hasPermission } from '@/lib/auth'

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

### 3. 国际化

#### 使用翻译

```typescript
import { useI18n } from '@/lib/i18n'

function MyComponent() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('user.greeting', { name: 'John' })}</p>
    </div>
  )
}
```

#### 语言切换

```typescript
import { useI18n } from '@/lib/i18n'

function LanguageSwitcher() {
  const { language, changeLanguage } = useI18n()

  return (
    <Select value={language} onValueChange={changeLanguage}>
      <SelectItem value="zh-CN">中文</SelectItem>
      <SelectItem value="en">English</SelectItem>
    </Select>
  )
}
```

### 4. API调用

#### 基础用法

```typescript
import { http } from '@/lib/api/client'

// GET请求
const users = await http.get('/users', { params: { page: 1 } })

// POST请求
const newUser = await http.post('/users', { name: 'John' })

// PUT请求
const updated = await http.put('/users/123', { name: 'Jane' })

// DELETE请求
await http.delete('/users/123')
```

#### 文件上传

```typescript
const result = await http.upload('/upload', file, (progress) => {
  console.log(`Upload progress: ${progress.loaded}/${progress.total}`)
})
```

---

## 👨‍💻 开发指南

### 开发命令

```bash
# 开发模式
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 代码规范

#### 组件命名

```typescript
// ✅ 推荐：PascalCase
UserListPage.tsx
UserCreateDialog.tsx

// ❌ 避免
userList.tsx
dialog.tsx
```

#### 类型定义

```typescript
// ✅ 推荐：明确的类型定义
interface UserListProps {
  users: User[]
  onUserClick: (user: User) => void
}

// ❌ 避免：使用any
function UserList(props: any) { }
```

#### 国际化

```typescript
// ✅ 推荐：所有文本使用翻译
<Button>{t('common.save')}</Button>

// ❌ 避免：硬编码文本
<Button>保存</Button>
<Button>Save</Button>
```

### 添加新功能模块

1. 在 `src/features/` 下创建模块目录
2. 创建必要的子目录：`pages/`, `components/`, `services/`, `types.ts`
3. 在 `src/routes/_authenticated/` 下创建路由文件
4. 添加相应的翻译键到 `src/locales/`

示例：

```bash
src/features/products/
├── pages/
│   └── ProductListPage.tsx
├── components/
│   └── ProductForm.tsx
├── services/
│   └── product-service.ts
└── types.ts
```

---

## 📦 部署

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录。

### 环境变量

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/zoranms-webui/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5199;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码审查标准

- ✅ 遵循项目代码规范
- ✅ 包含必要的类型定义
- ✅ 所有UI文本支持国际化
- ✅ 通过ESLint检查
- ✅ 构建无错误

---

## 📚 相关文档

- [CLAUDE.md](./CLAUDE.md) - Claude Code开发指导文档
- [API_SPEC.md](./API_SPEC.md) - API接口规范
- [USER_MANAGEMENT_UI_SUMMARY.md](./USER_MANAGEMENT_UI_SUMMARY.md) - 用户管理UI说明

---

## 🙏 致谢

本项目基于以下优秀的开源项目：

- [shadcn-admin](https://github.com/satnaing/shadcn-admin) - UI布局基础
- [shadcn/ui](https://ui.shadcn.com) - 组件库
- [TanStack Router](https://tanstack.com/router) - 路由方案
- [AG Grid](https://www.ag-grid.com) - 数据表格

感谢所有开源贡献者！

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

---

## 🔗 相关链接

- **后端仓库**: [ZoranMS/API](https://github.com/ZoranMS/API)
- **文档**: [ZoranMS Docs](https://github.com/ZoranMS/Docs)
- **问题反馈**: [GitHub Issues](https://github.com/ZoranMS/WebUI/issues)

---

<div align="center">

**Made with ❤️ by ZoranMS Team**

⭐ 如果这个项目对您有帮助，请给我们一个星标！

</div>
