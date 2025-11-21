# 模块化 i18n 架构指南

## 📋 目录

1. [概述](#概述)
2. [架构设计](#架构设计)
3. [目录结构](#目录结构)
4. [使用方法](#使用方法)
5. [迁移指南](#迁移指南)
6. [最佳实践](#最佳实践)
7. [FAQ](#faq)

---

## 概述

### 为什么需要模块化 i18n？

在大型项目中，将所有翻译集中在单一文件会导致：
- **文件过大**：难以维护和查找
- **团队协作冲突**：多人同时修改同一文件产生 Git 冲突
- **模块耦合**：不同功能模块的翻译混在一起
- **无法按需加载**：必须加载所有翻译
- **微服务不友好**：各服务无法独立管理翻译

### 模块化 i18n 的优势

✅ **模块独立性** - 每个功能模块管理自己的翻译
✅ **自动发现** - 新增翻译文件自动加载，无需注册
✅ **零冲突** - 不同模块的翻译文件互不干扰
✅ **按需加载** - 支持代码分割和懒加载
✅ **类型安全** - TypeScript 支持
✅ **向后兼容** - 支持从旧版平滑迁移

---

## 架构设计

### 核心原理

```
                    ┌─────────────────────────────────┐
                    │   i18n Context Provider        │
                    │   (运行时翻译合并)              │
                    └─────────────┬───────────────────┘
                                  │
                    ┌─────────────┴───────────────────┐
                    │   Translation Loader            │
                    │   (自动发现和加载)              │
                    └─────────────┬───────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
   ┌────▼────┐              ┌────▼────┐              ┌────▼────┐
   │ Global  │              │ Feature │              │ Feature │
   │ Locales │              │ Module  │              │ Module  │
   │         │              │ Locales │              │ Locales │
   └─────────┘              └─────────┘              └─────────┘
```

### 加载模式

系统支持三种加载模式，在 `context-new.tsx` 中配置：

```typescript
type LoadMode = 'modular' | 'legacy' | 'hybrid'
```

- **modular** - 仅使用模块化翻译
- **legacy** - 仅使用旧版大文件翻译（兼容模式）
- **hybrid** - 模块化优先，大文件作为后备（推荐迁移期使用）

---

## 目录结构

### 完整目录结构

```
src/
├── locales/                              # 全局翻译
│   ├── en/                               # 英文全局翻译
│   │   ├── common.json                   # 通用词汇
│   │   ├── nav.json                      # 导航菜单
│   │   ├── auth.json                     # 认证相关
│   │   └── breadcrumb.json               # 面包屑
│   ├── zh-CN/                            # 中文全局翻译
│   │   ├── common.json
│   │   ├── nav.json
│   │   ├── auth.json
│   │   └── breadcrumb.json
│   ├── en.json                           # [遗留] 旧版大文件（保留作为后备）
│   └── zh-CN.json                        # [遗留] 旧版大文件（保留作为后备）
│
├── features/                             # 功能模块
│   ├── users/                            # 用户管理模块
│   │   ├── components/
│   │   ├── services/
│   │   └── locales/                      # 模块独立翻译
│   │       ├── en.json                   # 英文翻译
│   │       └── zh-CN.json                # 中文翻译
│   ├── dashboard/                        # 仪表盘模块
│   │   └── locales/
│   │       ├── en.json
│   │       └── zh-CN.json
│   └── settings/                         # 设置模块
│       └── locales/
│           ├── en.json
│           └── zh-CN.json
│
└── lib/
    └── i18n/
        ├── context.tsx                   # [遗留] 旧版上下文
        ├── context-new.tsx               # [新版] 模块化上下文
        ├── loader.ts                     # 翻译加载器
        └── types.ts                      # 类型定义
```

### 全局翻译 vs 模块翻译

| 类型 | 路径 | 用途 | 命名空间 |
|------|------|------|----------|
| **全局翻译** | `src/locales/{locale}/{module}.json` | 通用词汇、导航、认证等全局使用的翻译 | 直接放在根级别 `common.*`, `nav.*` |
| **模块翻译** | `src/features/{module}/locales/{locale}.json` | 特定功能模块的翻译 | 放在模块命名空间下 `users.*`, `dashboard.*` |

---

## 使用方法

### 1. 全局翻译文件

**创建文件：** `src/locales/zh-CN/common.json`

```json
{
  "save": "保存",
  "cancel": "取消",
  "delete": "删除",
  "loading": "加载中..."
}
```

**使用方式：**

```tsx
import { useI18n } from '@/lib/i18n'

function MyComponent() {
  const { t } = useI18n()

  return (
    <button>{t('common.save')}</button>
  )
}
```

### 2. 功能模块翻译

**创建文件：** `src/features/users/locales/zh-CN.json`

```json
{
  "title": "用户管理",
  "addUser": "添加用户",
  "deleteUser": "删除用户"
}
```

**使用方式：**

```tsx
import { useI18n } from '@/lib/i18n'

function UsersPage() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('users.title')}</h1>
      <button>{t('users.addUser')}</button>
    </div>
  )
}
```

### 3. 切换到新版 i18n 系统

**Step 1: 更新 App.tsx**

```tsx
// 从
import { I18nProvider } from '@/lib/i18n'

// 改为
import { I18nProvider } from '@/lib/i18n/context-new'
```

**Step 2: 配置加载模式**

在 `src/lib/i18n/context-new.tsx` 中设置：

```typescript
// 迁移期使用 hybrid 模式
const LOAD_MODE: LoadMode = 'hybrid'

// 迁移完成后使用 modular 模式
const LOAD_MODE: LoadMode = 'modular'
```

---

## 迁移指南

### 自动迁移（推荐）

使用提供的迁移脚本自动拆分大文件：

```bash
# 1. 先预览（dry run）
node scripts/migrate-i18n.js --dry-run

# 2. 确认无误后执行迁移
node scripts/migrate-i18n.js
```

迁移脚本会：
- ✅ 读取现有的 `en.json` 和 `zh-CN.json`
- ✅ 根据配置自动拆分到对应的模块文件
- ✅ 创建所需的目录结构
- ✅ 生成详细的迁移报告

### 手动迁移

**Step 1: 识别需要拆分的模块**

查看现有的翻译键，按功能分组：

```json
// 原文件 zh-CN.json
{
  "common": { "save": "保存" },       // → src/locales/zh-CN/common.json
  "nav": { "dashboard": "仪表盘" },   // → src/locales/zh-CN/nav.json
  "users": { "title": "用户管理" },   // → src/features/users/locales/zh-CN.json
  "dashboard": { ... }                // → src/features/dashboard/locales/zh-CN.json
}
```

**Step 2: 创建模块翻译文件**

```bash
# 全局翻译
mkdir -p src/locales/en src/locales/zh-CN

# 功能模块翻译
mkdir -p src/features/users/locales
mkdir -p src/features/dashboard/locales
```

**Step 3: 复制翻译内容**

将对应的键值对复制到新文件中。

**Step 4: 测试**

```bash
npm run dev
```

切换语言，确保所有翻译正常工作。

---

## 最佳实践

### 1. 命名规范

**全局翻译模块命名：**
- `common.json` - 通用词汇（保存、取消等）
- `auth.json` - 认证相关
- `nav.json` - 导航菜单
- `breadcrumb.json` - 面包屑

**功能模块翻译：**
- 文件名统一为语言代码：`en.json`, `zh-CN.json`
- 放在模块的 `locales/` 目录下

### 2. 翻译键组织

**扁平化结构（推荐）：**

```json
{
  "title": "用户管理",
  "addUser": "添加用户",
  "deleteUser": "删除用户"
}
```

**嵌套结构（不推荐）：**

```json
{
  "user": {
    "title": "用户管理",
    "actions": {
      "add": "添加用户"
    }
  }
}
```

💡 原因：扁平化结构更简洁，IDE 自动补全更好。

### 3. 避免重复

将通用翻译放在全局模块，避免在每个功能模块中重复：

```json
// ❌ 不好：每个模块都定义
// src/features/users/locales/zh-CN.json
{ "save": "保存", "cancel": "取消" }

// ✅ 好：使用全局翻译
// src/locales/zh-CN/common.json
{ "save": "保存", "cancel": "取消" }

// 使用：t('common.save')
```

### 4. 版本控制

```bash
# .gitignore
# 不要忽略翻译文件，它们是源代码的一部分
# ✅ 提交到 Git
src/locales/**/*.json
src/features/**/locales/*.json
```

### 5. 团队协作

**模块责任制：**
- 每个团队/开发者负责自己模块的翻译
- 全局翻译由核心团队统一维护
- 使用 PR review 确保翻译质量

---

## FAQ

### Q1: 如何添加新模块的翻译？

**A:** 直接在模块目录下创建 `locales/` 文件夹和翻译文件即可：

```bash
src/features/my-new-feature/
└── locales/
    ├── en.json
    └── zh-CN.json
```

系统会自动发现并加载，无需任何配置或注册！

### Q2: 如何支持新语言？

**A:** 在对应位置添加新语言的翻译文件：

```bash
# 全局翻译
src/locales/ja/common.json
src/locales/ja/nav.json

# 功能模块翻译
src/features/users/locales/ja.json
```

然后在 `src/lib/i18n/types.ts` 中添加语言定义。

### Q3: 旧版大文件可以删除吗？

**A:**
- **迁移期间**：保留作为后备（hybrid 模式）
- **迁移完成后**：确保所有翻译都已拆分，可以删除
- **建议**：保留一段时间，以防遗漏

### Q4: 性能影响？

**A:**
- 使用 `eager: true` 时，所有翻译在构建时打包，性能与旧版相同
- 可以改为懒加载模式（`eager: false`）实现代码分割
- 运行时合并翻译的性能开销可忽略不计

### Q5: 如何调试缺失的翻译？

**A:**
1. 开发环境会在控制台打印缺失的翻译键
2. 使用 `getAvailableModules()` 查看已加载的模块
3. 检查文件路径和命名是否正确

### Q6: 支持 TypeScript 类型提示吗？

**A:** 是的！可以使用工具生成翻译键的 TypeScript 类型定义：

```typescript
// 示例：auto-generated types
type TranslationKeys =
  | 'common.save'
  | 'common.cancel'
  | 'users.title'
  | 'users.addUser'
```

### Q7: 如何处理复数和格式化？

**A:** 使用占位符和 `.replace()` 方法：

```json
{
  "itemCount": "共 {count} 项"
}
```

```tsx
t('users.itemCount').replace('{count}', '5')
```

对于复杂的格式化，建议集成 `i18next` 或 `react-intl`。

---

## 相关文件

- 📄 `src/lib/i18n/loader.ts` - 翻译加载器实现
- 📄 `src/lib/i18n/context-new.tsx` - 新版 i18n Context
- 📄 `scripts/migrate-i18n.js` - 自动迁移脚本
- 📄 `I18N_MODULAR_GUIDE.md` - 本文档

---

## 支持

遇到问题？
1. 查看控制台的 `[i18n]` 日志
2. 检查文件路径和命名
3. 确认翻译文件格式正确
4. 参考示例模块（users, dashboard）

祝开发愉快！🚀
