# SKUIKIT - Quick Start Guide

## 快速开始

### 1. 环境要求

- Node.js 18+
- npm 或 pnpm

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置你的API地址：

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 5. 查看功能演示

访问 `/demo` 路由查看框架各项功能的演示。

## 核心功能快速使用

### API调用

```typescript
import { http } from '@/lib/api'

// GET请求
const response = await http.get('/users')

// POST请求
const data = await http.post('/users', { name: 'John' })
```

### 认证

```typescript
import { useAuthStore } from '@/lib/auth'

const { login, logout, user, isAuthenticated } = useAuthStore()

// 登录
await login({ email: 'user@example.com', password: 'password' })

// 登出
await logout()
```

### 国际化

```typescript
import { useI18n } from '@/lib/i18n'

const { t, changeLanguage } = useI18n()

// 使用翻译
<h1>{t('common.welcome')}</h1>

// 切换语言
changeLanguage('zh')
```

### 表格

```typescript
import { AgGridTable } from '@/components/data-table'

<AgGridTable
  rowData={data}
  columnDefs={columns}
  pagination
  paginationPageSize={10}
/>
```

## 项目结构

```
src/
├── lib/           # 核心功能库
├── components/    # UI组件
├── routes/        # 路由页面
└── styles/        # 样式文件
```

## 下一步

- 阅读 [FRAMEWORK.md](./FRAMEWORK.md) 了解详细文档
- 查看 `/demo` 路由的示例代码
- 根据业务需求自定义功能

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 问题排查

### 依赖安装失败

尝试清除缓存：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 类型错误

确保 TypeScript 版本正确：

```bash
npm install -D typescript@~5.9.3
```

### 构建错误

检查环境变量配置是否正确。

## 获取帮助

- 查看详细文档：[FRAMEWORK.md](./FRAMEWORK.md)
- 查看示例代码：[AG_GRID_DEMO.md](./AG_GRID_DEMO.md)
- 查阅 AI 辅助文档：[.claude/README.md](./.claude/README.md)
