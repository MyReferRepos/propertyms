# 菜单系统国际化实现总结

**日期**: 2025-10-23
**版本**: 1.0

---

## 📋 完成的工作

### 1. 数据库表结构优化 ✅

**文件**: `database-migration-suggestions.sql`

#### 主要变更：

##### 1.1 新增国际化字段
```sql
-- menu_groups 表
ALTER TABLE menu_groups ADD COLUMN i18n_key VARCHAR(100);

-- menus 表
ALTER TABLE menus ADD COLUMN i18n_key VARCHAR(100);
```

**说明**：
- `name`/`title` 字段：存储英文名称（用于后台管理）
- `i18nKey` 字段：存储翻译键（用于前端国际化）
- 示例：
  ```
  name: "System Management"
  i18nKey: "nav.system"
  ```

##### 1.2 新增功能字段
```sql
-- 路由重定向（用于目录默认跳转）
ALTER TABLE menus ADD COLUMN redirect VARCHAR(255);

-- 面包屑控制
ALTER TABLE menus ADD COLUMN hidden_in_breadcrumb BOOLEAN NOT NULL DEFAULT false;

-- 菜单显示控制
ALTER TABLE menus ADD COLUMN always_show BOOLEAN NOT NULL DEFAULT false;

-- 元数据字段
ALTER TABLE menus ADD COLUMN meta JSONB;
```

##### 1.3 唯一性约束
```sql
-- menu_groups.code 必须唯一
ALTER TABLE menu_groups ADD CONSTRAINT UQ_menu_groups_code UNIQUE (code);

-- menus.name 必须唯一（仅在有效数据中）
CREATE UNIQUE INDEX UQ_menus_name_active ON menus (name) WHERE deleted_at IS NULL;

-- 防止重复关联
ALTER TABLE menu_permissions ADD CONSTRAINT UQ_menu_permissions_menu_permission
  UNIQUE (menu_id, permission_id);
```

##### 1.4 设计决策
- ✅ **保留** 原 `name`/`title` 字段存储英文
- ✅ **新增** `i18n_key` 字段用于前端国际化
- ✅ **移除** 数据库层面的 `menu_type` 约束（由后端枚举约定）
- ❌ **不添加** 外键约束（由应用层控制）
- ❌ **不添加** 性能索引（数据库已有）

---

### 2. 前端 TypeScript 类型定义 ✅

**文件**: `src/features/menu/types.ts`

#### 主要变更：

##### 2.1 更新 MenuType 枚举
```typescript
// 旧版本（首字母大写）
export enum MenuType {
  DIRECTORY = 'Directory',
  MENU = 'Menu',
  BUTTON = 'Button'
}

// 新版本（小写，与后端枚举一致）
export enum MenuType {
  DIRECTORY = 'directory',  // 目录（容器节点）
  MENU = 'menu',            // 菜单（实际页面）
  BUTTON = 'button'         // 按钮（操作项）
}
```

##### 2.2 更新 MenuGroup 接口
```typescript
export interface MenuGroup {
  id: string
  name: string              // 菜单组名称（英文）
  code: string              // 菜单组代码
  i18nKey?: string | null   // 🆕 国际化翻译键
  icon?: string             // 🆕 图标名称
  description?: string      // 🆕 描述
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

##### 2.3 更新 Menu 接口
```typescript
export interface Menu {
  id: string
  parentId: string | null
  menuGroupId: string | null
  name: string                      // 路由名称（英文）
  title: string                     // 显示标题（英文）
  i18nKey?: string | null          // 🆕 国际化翻译键
  path?: string
  component?: string
  redirect?: string
  icon?: string
  badge?: string                    // 🆕 徽章文本
  sortOrder: number
  menuType: MenuType
  visible: boolean
  isActive: boolean
  keepAlive: boolean
  isExternal: boolean
  hiddenInBreadcrumb?: boolean     // 🆕 是否在面包屑中隐藏
  alwaysShow?: boolean             // 🆕 是否总是显示
  remark?: string
  permissions?: Permission[]
  children?: Menu[]
  meta?: MenuMeta
  createdAt?: string
  updatedAt?: string
  group?: MenuGroup
}
```

##### 2.4 更新表单数据接口
- `MenuGroupFormData`: 新增 `i18nKey`, `icon`, `description` 字段
- `MenuFormData`: 新增 `i18nKey`, `badge`, `hiddenInBreadcrumb`, `alwaysShow` 字段

---

### 3. 国际化翻译配置 ✅

#### 3.1 英文翻译 (`src/locales/en/menu.json`)

```json
{
  "menuType": {
    "directory": "Directory",
    "menu": "Menu",
    "button": "Button"
  }
}
```

#### 3.2 中文翻译 (`src/locales/zh-CN/menu.json`)

```json
{
  "menuType": {
    "directory": "目录",
    "menu": "菜单",
    "button": "按钮"
  }
}
```

---

### 4. 菜单工具函数库 ✅

**文件**: `src/lib/menu-utils.ts`

#### 核心函数：

##### 4.1 国际化相关

```typescript
/**
 * 获取菜单标题（支持国际化）
 * 优先使用 i18nKey，如果不存在则降级使用 title
 */
export function getMenuTitle(menu: Menu, t: TranslateFn): string

/**
 * 获取菜单组名称（支持国际化）
 */
export function getMenuGroupName(group: MenuGroup, t: TranslateFn): string

/**
 * 获取菜单类型标签（支持国际化）
 */
export function getMenuTypeLabel(menuType: MenuType | string, t: TranslateFn): string

/**
 * 递归翻译菜单树
 */
export function translateMenuTree(menus: Menu[], t: TranslateFn): Menu[]
```

##### 4.2 菜单操作相关

```typescript
/**
 * 获取菜单的完整路径（面包屑）
 */
export function getMenuBreadcrumbs(
  menuId: string,
  allMenus: Menu[],
  t: TranslateFn
): Array<{ id: string; title: string; path?: string }>

/**
 * 检查菜单是否可见
 */
export function isMenuVisible(menu: Menu): boolean

/**
 * 过滤可见菜单
 */
export function filterVisibleMenus(menus: Menu[]): Menu[]

/**
 * 将扁平菜单列表转换为树形结构
 */
export function buildMenuTree(flatMenus: Menu[]): Menu[]

/**
 * 根据排序值对菜单排序
 */
export function sortMenus(menus: Menu[]): Menu[]

/**
 * 查找菜单项
 */
export function findMenu(menus: Menu[], predicate: (menu: Menu) => boolean): Menu | undefined
export function findMenuByPath(menus: Menu[], path: string): Menu | undefined
export function findMenuByName(menus: Menu[], name: string): Menu | undefined
```

---

## 🎯 使用示例

### 示例 1: 在组件中使用国际化菜单

```typescript
import { useI18n } from '@/lib/i18n'
import { getMenuTitle, getMenuTypeLabel } from '@/lib/menu-utils'

function MenuItem({ menu }: { menu: Menu }) {
  const { t } = useI18n()

  // 优先使用 i18nKey，如果没有则降级使用 title
  const displayTitle = getMenuTitle(menu, t)
  const typeLabel = getMenuTypeLabel(menu.menuType, t)

  return (
    <div>
      <span>{displayTitle}</span>
      <span className="text-muted-foreground">{typeLabel}</span>
    </div>
  )
}
```

### 示例 2: 翻译整个菜单树

```typescript
import { translateMenuTree } from '@/lib/menu-utils'

function NavigationMenu({ menus }: { menus: Menu[] }) {
  const { t } = useI18n()

  // 翻译整个菜单树
  const translatedMenus = translateMenuTree(menus, t)

  return <MenuTree data={translatedMenus} />
}
```

### 示例 3: 获取面包屑

```typescript
import { getMenuBreadcrumbs } from '@/lib/menu-utils'

function Breadcrumb({ currentMenuId, allMenus }: Props) {
  const { t } = useI18n()

  const breadcrumbs = getMenuBreadcrumbs(currentMenuId, allMenus, t)

  return (
    <nav>
      {breadcrumbs.map(item => (
        <span key={item.id}>{item.title}</span>
      ))}
    </nav>
  )
}
```

---

## 📊 数据示例

### 后端 API 应返回的数据格式

```json
{
  "id": "uuid-123",
  "name": "dashboard",
  "title": "Dashboard",
  "i18nKey": "nav.dashboard",
  "path": "/dashboard",
  "icon": "home",
  "menuType": "menu",
  "badge": null,
  "redirect": null,
  "hiddenInBreadcrumb": false,
  "alwaysShow": false,
  "sortOrder": 0,
  "visible": true,
  "isActive": true,
  "keepAlive": false,
  "isExternal": false,
  "meta": null
}
```

### 菜单组数据示例

```json
{
  "id": "uuid-456",
  "name": "System Management",
  "code": "system",
  "i18nKey": "nav.system",
  "icon": "settings",
  "description": "System configuration and management",
  "sortOrder": 0,
  "isActive": true
}
```

---

## 🚧 后续工作（需要用户指导）

### 需要后端 API 调整

1. **菜单 API 响应字段**：
   - ✅ 确保返回 `i18nKey` 字段
   - ✅ 确保返回新增的字段：`badge`, `hiddenInBreadcrumb`, `alwaysShow`
   - ✅ 确保 `menuType` 使用小写值：`directory`, `menu`, `button`

2. **菜单组 API 响应字段**：
   - ✅ 将 `title` 重命名为 `name`（或同时返回两者以兼容）
   - ✅ 确保返回 `i18nKey`, `icon`, `description` 字段

3. **API 端点**（待确认）：
   - `GET /api/menus/user-navigation` - 获取当前用户的导航菜单
   - `GET /api/menu-groups` - 获取所有菜单组
   - `GET /api/menus` - 获取所有菜单
   - `POST /api/menus` - 创建菜单
   - `PUT /api/menus/:id` - 更新菜单
   - `DELETE /api/menus/:id` - 删除菜单

---

## ✅ 验证清单

执行 SQL 后，使用以下查询验证：

```sql
-- 1. 检查字段是否添加成功
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('menu_groups', 'menus')
  AND column_name IN ('i18n_key', 'redirect', 'hidden_in_breadcrumb', 'always_show', 'meta')
ORDER BY table_name, ordinal_position;

-- 2. 检查唯一约束
SELECT constraint_name, table_name, column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_name IN ('menu_groups', 'menus', 'menu_permissions')
ORDER BY tc.table_name;
```

---

## 📚 相关文件

| 文件 | 说明 |
|------|------|
| `database-migration-suggestions.sql` | 数据库迁移 SQL |
| `src/features/menu/types.ts` | TypeScript 类型定义 |
| `src/lib/menu-utils.ts` | 菜单工具函数 |
| `src/locales/en/menu.json` | 英文翻译 |
| `src/locales/zh-CN/menu.json` | 中文翻译 |
| `CLAUDE.md` | 项目开发规范 |

---

## 🔜 下一步

等待用户确认后，将根据实际后端 API 设计：

1. 实现菜单获取逻辑
2. 实现导航菜单显示组件
3. 实现权限过滤逻辑
4. 集成到现有的布局系统

---

**文档版本**: 1.0
**最后更新**: 2025-10-23
