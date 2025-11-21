# SKUIKIT - 项目约束与开发规范

## 项目信息

**项目名称**: SKUIKIT
**版本**: 1.0.0
**描述**: Modern enterprise-grade frontend framework

## 重要约束

### AG Grid 限制

⚠️ **本项目仅使用 AG Grid Community Edition**

**禁止使用任何企业版功能，包括但不限于：**
- `enableRangeSelection` - 范围选择
- `enableCharts` - 图表功能
- `sideBar` - 工具栏/侧边栏
- `masterDetail` - 主从详情
- `pivotMode` - 透视表
- `statusBar` - 状态栏
- Excel 导出功能
- 高级过滤器
- 分组与聚合（企业功能部分）

**可用的社区版功能：**
- 基础排序、过滤、分页
- 行选择（单选/多选）
- 列的拖拽、调整大小、固定
- 自定义单元格渲染器
- 主题定制（使用 `theme="legacy"` 配合 CSS）
- CSV 导出（社区版支持）

**重要 API 变更（AG Grid v32.2+）：**
- ❌ 弃用：列定义中的 `checkboxSelection` 和 `headerCheckboxSelection`
- ❌ 弃用：`suppressRowClickSelection`
- ✅ 使用：`gridOptions.rowSelection` 对象配置
  ```typescript
  rowSelection: {
    mode: 'multiRow',           // 或 'singleRow'
    checkboxes: true,           // 启用复选框
    headerCheckbox: true,       // 列头全选框
    enableClickSelection: false, // 禁用行点击选择（替代 suppressRowClickSelection）
  }
  ```
- ✅ 设置 `paginationPageSizeSelector` 以避免警告
  ```typescript
  paginationPageSizeSelector: [10, 20, 50, 100]  // 包含 paginationPageSize 的值
  ```

参考文档：https://www.ag-grid.com/react-data-grid/licensing/

### 技术栈

**核心框架**
- React 19 + TypeScript
- Vite 7
- TanStack Router
- Zustand（状态管理）

**UI 组件**
- Shadcn UI (TailwindCSS + RadixUI)
- AG Grid Community Edition
- Lucide Icons

**核心功能模块**
- API: Axios + 拦截器
- 认证: Token-based 自定义系统
- i18n: react-i18next
- 表单: React Hook Form + Zod

## 项目结构

```
src/
├── lib/
│   ├── api/          # API 客户端封装
│   ├── auth/         # 认证系统
│   └── i18n/         # 国际化
├── components/
│   ├── auth/         # 认证组件（路由守卫、权限守卫）
│   ├── i18n/         # 语言切换器
│   ├── data-table/   # 表格组件（AG Grid）
│   └── ui/           # Shadcn UI 组件
└── routes/
    └── demo.tsx      # 功能演示页面
```

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 使用 ESLint + Prettier
- 组件使用函数式组件 + Hooks

### 命名规范
- 组件文件：kebab-case (例: `ag-grid-table.tsx`)
- 组件名：PascalCase (例: `AgGridTable`)
- Hook：use 前缀 (例: `useAuthStore`)
- 常量：UPPER_SNAKE_CASE (例: `API_ENDPOINTS`)

### 最佳实践
1. **API 调用**: 统一使用 `@/lib/api` 中的 `http` 客户端
2. **认证保护**: 使用 `ProtectedRoute` 包裹需要认证的页面
3. **权限控制**: 使用 `PermissionGuard` 控制功能访问
4. **国际化**: 所有用户可见文本使用 `t()` 函数
5. **表格**: 大数据集优先使用 AG Grid，启用分页

## 关键文件

- `README.md` - 项目总览
- `FRAMEWORK.md` - 详细框架文档
- `AG_GRID_DEMO.md` - AG Grid 演示说明
- `QUICKSTART.md` - 快速入门
- `CLEANUP_GUIDE.md` - **项目清理指南**（识别核心代码和样板代码）

## 环境变量

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## 常见任务

### 添加新页面
1. 在 `src/routes/` 下创建路由文件
2. 使用 TanStack Router 的文件路由约定
3. 需要认证的页面放在 `_authenticated/` 目录下

### 添加新的 API 端点
1. 在 `src/lib/api/config.ts` 中定义端点
2. 在 `src/lib/api/types.ts` 中定义类型
3. 使用 `http.get/post/put/delete` 调用

### 添加新语言
1. 在 `src/lib/i18n/locales/` 下创建语言文件
2. 在 `src/lib/i18n/config.ts` 中注册语言
3. 更新 `SUPPORTED_LANGUAGES` 配置

## AI 助手注意事项

在协助开发时，请确保：
1. ✅ 不使用任何 AG Grid 企业版功能
2. ✅ 遵循项目现有的代码风格和结构
3. ✅ 使用 TypeScript 类型定义
4. ✅ API 调用通过统一的 `http` 客户端
5. ✅ 所有文本内容支持国际化
6. ✅ 新增组件符合 Shadcn UI 设计规范
7. ✅ 参考 `CLEANUP_GUIDE.md` 了解核心代码和样板代码的区分

## 项目清理指导

在清理项目或识别代码性质时：
- 参考 `CLEANUP_GUIDE.md` 中的详细分类
- 核心功能（lib/api, lib/auth, lib/i18n, AG Grid等）必须保留
- 业务样板代码（features/dashboard, tasks, users等）可以删除
- 详细清理步骤和验证方法见清理指南
