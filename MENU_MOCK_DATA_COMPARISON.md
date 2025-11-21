# 菜单 Mock 数据对比：当前 vs 新要求

---

## 📊 MenuGroup 对比

### ❌ 当前 Mock 数据 (src/mocks/data/menus.ts)

```typescript
{
  id: 'group-1',
  title: '通用功能',        // ❌ 字段名错误 + 存储中文
  code: 'general',
  sortOrder: 1,
  isActive: true,
  remark: '通用功能菜单组',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}
```

### ✅ 新要求 (应该是)

```typescript
{
  id: 'group-1',
  name: 'General',              // ✅ 字段名正确 + 英文
  code: 'general',
  i18nKey: 'nav.general',       // ✅ 新增：翻译键
  icon: 'layers',               // ✅ 新增：图标
  description: 'General features menu group',  // ✅ 新增：描述
  sortOrder: 1,
  isActive: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}
```

**问题总结**:
1. ❌ `title` 应改为 `name`
2. ❌ `name` 存储的应该是英文，不是中文
3. ❌ 缺少 `i18nKey` 字段
4. ❌ 缺少 `icon` 字段
5. ❌ 缺少 `description` 字段
6. ❌ `remark` 字段已移除（用 `description` 替代）

---

## 📊 Menu 对比

### ❌ 当前 Mock 数据

```typescript
{
  id: 'menu-1',
  parentId: null,
  menuGroupId: 'group-1',
  name: 'Dashboard',              // ✅ 英文名称正确
  title: '仪表盘',                 // ❌ 存储中文
  path: '/dashboard',
  component: '@/features/dashboard/pages/DashboardPage',
  icon: 'layout-dashboard',
  sortOrder: 1,
  menuType: 'Menu' as any,        // ❌ 首字母大写 + 强制类型转换
  visible: true,
  isActive: true,
  keepAlive: true,
  isExternal: false,
  permissions: [],
  meta: {
    title: '仪表盘',              // ❌ 存储中文
    icon: 'layout-dashboard',
    keepAlive: true,
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}
```

### ✅ 新要求

```typescript
{
  id: 'menu-1',
  parentId: null,
  menuGroupId: 'group-1',
  name: 'Dashboard',              // ✅ 英文名称
  title: 'Dashboard',             // ✅ 英文标题
  i18nKey: 'nav.dashboard',       // ✅ 新增：翻译键
  path: '/dashboard',
  component: '@/features/dashboard/pages/DashboardPage',
  redirect: undefined,            // ✅ 新增字段
  icon: 'layout-dashboard',
  badge: undefined,               // ✅ 新增：徽章
  sortOrder: 1,
  menuType: MenuType.MENU,        // ✅ 使用枚举 ('menu')
  visible: true,
  isActive: true,
  keepAlive: true,
  isExternal: false,
  hiddenInBreadcrumb: false,      // ✅ 新增：面包屑控制
  alwaysShow: false,              // ✅ 新增：显示控制
  remark: undefined,
  permissions: [],
  children: undefined,
  meta: {
    title: 'Dashboard',           // ✅ 英文
    icon: 'layout-dashboard',
    keepAlive: true,
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}
```

**问题总结**:
1. ❌ `title` 存储中文，应该是英文
2. ❌ 缺少 `i18nKey` 字段
3. ❌ `menuType: 'Menu'` 应为 `MenuType.MENU` (值为 `'menu'`)
4. ❌ 缺少 `badge` 字段
5. ❌ 缺少 `hiddenInBreadcrumb` 字段
6. ❌ 缺少 `alwaysShow` 字段
7. ❌ `meta.title` 也存储了中文

---

## 📊 目录菜单对比 (Directory)

### ❌ 当前 Mock 数据

```typescript
{
  id: 'menu-3',
  parentId: null,
  menuGroupId: 'group-2',
  name: 'UserManagement',
  title: '用户管理',              // ❌ 中文
  path: null,
  redirect: '/users',            // ✅ 有 redirect
  icon: 'users',
  sortOrder: 1,
  menuType: 'Directory' as any,  // ❌ 首字母大写
  visible: true,
  isActive: true,
  keepAlive: false,
  isExternal: false,
  permissions: [],
  children: [/* ... */],
  meta: {
    title: '用户管理',            // ❌ 中文
    icon: 'users',
  },
}
```

### ✅ 新要求

```typescript
{
  id: 'menu-3',
  parentId: null,
  menuGroupId: 'group-2',
  name: 'UserManagement',
  title: 'User Management',      // ✅ 英文
  i18nKey: 'nav.users',          // ✅ 新增
  path: null,                    // ✅ 目录没有 path
  redirect: '/users',
  icon: 'users',
  badge: undefined,
  sortOrder: 1,
  menuType: MenuType.DIRECTORY,  // ✅ 'directory'
  visible: true,
  isActive: true,
  keepAlive: false,
  isExternal: false,
  hiddenInBreadcrumb: false,     // ✅ 新增
  alwaysShow: false,             // ✅ 新增
  remark: undefined,
  permissions: [],
  children: [/* ... */],
  meta: {
    title: 'User Management',    // ✅ 英文
    icon: 'users',
  },
}
```

---

## 🎯 MenuType 枚举值对比

### ❌ 当前 Mock 使用

```typescript
menuType: 'Menu' as any        // 强制类型转换
menuType: 'Directory' as any   // 强制类型转换
```

### ✅ 新枚举定义

```typescript
export enum MenuType {
  DIRECTORY = 'directory',  // 小写
  MENU = 'menu',            // 小写
  BUTTON = 'button'         // 小写
}

// 使用方式
menuType: MenuType.MENU       // 'menu'
menuType: MenuType.DIRECTORY  // 'directory'
menuType: MenuType.BUTTON     // 'button'
```

---

## 📋 完整的修复示例

### MenuGroup 完整示例

```typescript
export const mockMenuGroups: MenuGroup[] = [
  {
    id: 'group-1',
    name: 'General',                    // ✅ 英文
    code: 'general',
    i18nKey: 'nav.general',             // ✅ 翻译键
    icon: 'layers',                     // ✅ 图标
    description: 'General features',    // ✅ 描述
    sortOrder: 1,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'group-2',
    name: 'System Management',          // ✅ 英文
    code: 'system',
    i18nKey: 'nav.system',              // ✅ 翻译键
    icon: 'settings',                   // ✅ 图标
    description: 'System configuration and management',
    sortOrder: 2,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
]
```

### Menu 完整示例

```typescript
{
  id: 'menu-1',
  parentId: null,
  menuGroupId: 'group-1',
  name: 'Dashboard',
  title: 'Dashboard',                   // ✅ 英文
  i18nKey: 'nav.dashboard',             // ✅ 翻译键
  path: '/dashboard',
  component: '@/features/dashboard/pages/DashboardPage',
  redirect: undefined,
  icon: 'layout-dashboard',
  badge: undefined,                     // ✅ 可选徽章
  sortOrder: 1,
  menuType: MenuType.MENU,              // ✅ 使用枚举
  visible: true,
  isActive: true,
  keepAlive: true,
  isExternal: false,
  hiddenInBreadcrumb: false,            // ✅ 新增
  alwaysShow: false,                    // ✅ 新增
  remark: undefined,
  permissions: [],
  children: undefined,
  meta: {
    title: 'Dashboard',                 // ✅ 英文
    icon: 'layout-dashboard',
    keepAlive: true,
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}
```

### 带徽章的菜单示例

```typescript
{
  id: 'menu-notifications',
  name: 'Notifications',
  title: 'Notifications',
  i18nKey: 'nav.notifications',
  path: '/notifications',
  icon: 'bell',
  badge: '5',                          // ✅ 显示未读数量
  menuType: MenuType.MENU,
  // ...
}
```

### 目录菜单示例

```typescript
{
  id: 'menu-user-management',
  name: 'UserManagement',
  title: 'User Management',
  i18nKey: 'nav.users',
  path: null,                          // ✅ 目录无 path
  redirect: '/users/list',             // ✅ 重定向到第一个子菜单
  icon: 'users',
  menuType: MenuType.DIRECTORY,        // ✅ 目录类型
  alwaysShow: true,                    // ✅ 总是显示，即使只有一个子菜单
  children: [/* ... */],
  // ...
}
```

---

## 🔧 修复步骤

### 步骤 1: 更新 MenuGroup

```typescript
// 查找替换
- title: '通用功能'
+ name: 'General'
+ i18nKey: 'nav.general'
+ icon: 'layers'
+ description: 'General features'
```

### 步骤 2: 更新 Menu

```typescript
// 查找替换
- title: '仪表盘'
+ title: 'Dashboard'
+ i18nKey: 'nav.dashboard'

- menuType: 'Menu' as any
+ menuType: MenuType.MENU

- menuType: 'Directory' as any
+ menuType: MenuType.DIRECTORY
```

### 步骤 3: 添加新字段

```typescript
+ badge: undefined
+ hiddenInBreadcrumb: false
+ alwaysShow: false
```

### 步骤 4: 更新 meta

```typescript
meta: {
-  title: '仪表盘',
+  title: 'Dashboard',
  icon: 'layout-dashboard',
  keepAlive: true,
}
```

---

## ✅ 验证清单

修复后，确保：

- [ ] 所有 `MenuGroup` 使用 `name` 字段（不是 `title`）
- [ ] 所有 `name` 和 `title` 存储英文（不是中文）
- [ ] 所有菜单都有 `i18nKey` 字段
- [ ] `menuType` 使用 `MenuType` 枚举（不是字符串）
- [ ] 新增字段都已添加
- [ ] `meta.title` 也使用英文
- [ ] 移除 `as any` 类型断言
- [ ] TypeScript 类型检查通过
- [ ] Mock 数据可以正常使用

---

**文档版本**: 1.0
**最后更新**: 2025-10-23
