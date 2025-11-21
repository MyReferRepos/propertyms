# 新权限模型设计文档

## 📋 权限模型重构说明

**最后更新**: 2025-10-26
**状态**: 🚧 设计阶段 - 等待后端 API 调整完成

---

## 🎯 核心变化

### 旧模型 vs 新模型

| 方面 | 旧模型 | 新模型 |
|------|--------|--------|
| **Permission.type** | `PAGE \| API \| BUTTON` | `MODULE \| ACTION` |
| **是否页面/按钮** | 通过 Permission.type 区分 | 通过 Menu 区分 |
| **API 权限验证** | 通过 Permission.allowedApis | 通过 Permission.path |
| **Menu 关联** | `permissionIds: string[]` (多个) | `permissionId: string` (单个) |
| **权限唯一性** | code 唯一 | code 和 name 都唯一 |

---

## 🏗️ 新的数据结构

### 1. Permission (权限)

```typescript
export enum PermissionType {
  MODULE = 'module',  // 模块类型权限
  ACTION = 'action'   // 行为类型权限
}

export interface Permission {
  id: string
  name: string        // 名称 - 必须唯一
  code: string        // 代码 - 必须唯一
  type: PermissionType // 类型：module 或 action
  module?: string     // 所属模块（action 类型时使用）
  path: string        // 🆕 API 路径，用于权限验证
  description?: string
  createdAt?: string
  updatedAt?: string
}
```

### 2. Menu (菜单)

```typescript
export interface Menu {
  id: string
  parentId: string | null
  menuGroupId: string | null
  name: string
  title: string
  path?: string
  component?: string
  icon?: string
  sortOrder: number
  menuType: 'directory' | 'menu' | 'button'  // 决定是页面还是按钮
  visible: boolean
  isActive: boolean
  alwaysShow: boolean    // 🆕 是否始终显示（不受权限约束）

  // 🔑 关键变化：从多个权限改为单个权限
  permissionId?: string  // 关联的权限 ID（单个）
  permission?: Permission // 关联的权限对象

  createdAt?: string
  updatedAt?: string
}
```

---

## 📊 权限设计模式

### 模式 1: 模块权限 (MODULE)

**用途**: 代表一个功能模块

```typescript
{
  name: "用户管理模块",
  code: "user_module",
  type: "MODULE",
  path: "/api/users/*",  // 模块级别的路径模式
  description: "用户管理相关功能"
}
```

### 模式 2: 行为权限 (ACTION)

**系统预定义的常见行为**:

| 行为 | Code | Name | Path 示例 |
|------|------|------|-----------|
| 列表 | `list` | "列表" | `/api/users` (GET) |
| 详情 | `view` | "详情" | `/api/users/:id` (GET) |
| 创建 | `create` | "创建" | `/api/users` (POST) |
| 编辑 | `edit` | "编辑" | `/api/users/:id` (PUT) |
| 删除 | `delete` | "删除" | `/api/users/:id` (DELETE) |
| 导出 | `export` | "导出" | `/api/users/export` (POST) |
| 导入 | `import` | "导入" | `/api/users/import` (POST) |

**示例**:

```typescript
// 用户列表权限
{
  name: "用户列表",
  code: "user_list",
  type: "ACTION",
  module: "user_module",
  path: "/api/users",  // GET 请求
  description: "查看用户列表"
}

// 用户创建权限
{
  name: "创建用户",
  code: "user_create",
  type: "ACTION",
  module: "user_module",
  path: "/api/users",  // POST 请求
  description: "创建新用户"
}

// 用户删除权限
{
  name: "删除用户",
  code: "user_delete",
  type: "ACTION",
  module: "user_module",
  path: "/api/users/:id",  // DELETE 请求
  description: "删除用户"
}
```

---

## 🔄 完整工作流程

### 场景: 新增"订单管理"模块

#### 步骤 1: 创建模块权限

在 `权限管理` 页面:

```
1. 点击"创建权限"
2. 填写:
   - 名称: "订单管理模块"
   - 代码: "order_module"
   - 类型: MODULE
   - 路径: "/api/orders/*"
   - 描述: "订单管理相关功能"
3. 保存
```

#### 步骤 2: 批量创建行为权限

继续创建行为权限，可以选择系统预定义的行为:

```
✅ 列表 (list)   → order_list    → /api/orders          (GET)
✅ 详情 (view)   → order_view    → /api/orders/:id      (GET)
✅ 创建 (create) → order_create  → /api/orders          (POST)
✅ 编辑 (edit)   → order_edit    → /api/orders/:id      (PUT)
✅ 删除 (delete) → order_delete  → /api/orders/:id      (DELETE)
✅ 导出 (export) → order_export  → /api/orders/export   (POST)

系统会自动生成:
- name: "订单" + 行为名称 (如"订单列表")
- code: "order_" + 行为代码 (如"order_list")
- module: "order_module"
- path: 根据模块和行为自动生成
```

#### 步骤 3: 创建菜单

在 `菜单管理` 页面:

**3.1 创建目录节点**

```
名称: OrderManagement
标题: 订单管理
类型: DIRECTORY
图标: shopping-cart
始终显示: true         // alwaysShow = true，不受权限约束
关联权限: (无)          // 目录不关联权限
```

**3.2 创建列表页面菜单**

```
名称: OrderList
标题: 订单列表
类型: MENU (页面)
路径: /orders
组件: @/features/orders/pages/OrderListPage
父菜单: OrderManagement
关联权限: order_list    // 🔑 关联单个权限
始终显示: false         // 需要权限才能看到
```

**3.3 创建按钮菜单（可选）**

```
名称: OrderCreate
标题: 创建订单
类型: BUTTON
父菜单: OrderList
关联权限: order_create  // 🔑 关联单个权限
始终显示: false
```

#### 步骤 4: 分配权限给角色

在 `角色管理` 页面，编辑角色权限:

```
角色: 订单管理员
分配权限:
  ✅ order_module (模块权限)
  ✅ order_list
  ✅ order_view
  ✅ order_create
  ✅ order_edit
  ✅ order_delete
```

#### 步骤 5: 用户获得权限和菜单

用户登录后:

1. 后端返回用户权限列表（包含 `id` 和 `path`）
2. 后端返回过滤后的菜单列表
3. 前端根据权限控制按钮显示

---

## 🔐 后端权限验证逻辑

### API 权限验证（伪代码）

```typescript
// 后端中间件
async function apiPermissionMiddleware(req, res, next) {
  const user = req.user
  const requestPath = req.path        // 如 "/api/orders/123"
  const requestMethod = req.method    // 如 "DELETE"

  // 获取用户所有权限（通过角色）
  const userPermissions = await getUserPermissions(user.id)

  // 检查是否有任何权限的 path 匹配当前请求
  const hasAccess = userPermissions.some(permission => {
    // 精确匹配或模式匹配
    return matchPath(permission.path, requestPath, requestMethod)
  })

  if (!hasAccess) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  next()
}

// 路径匹配函数
function matchPath(permissionPath: string, requestPath: string, method: string): boolean {
  // 1. 通配符匹配: /api/orders/* 匹配 /api/orders/123
  if (permissionPath.endsWith('/*')) {
    const base = permissionPath.slice(0, -2)
    return requestPath.startsWith(base)
  }

  // 2. 参数匹配: /api/orders/:id 匹配 /api/orders/123
  if (permissionPath.includes(':')) {
    const pattern = permissionPath.replace(/:(\w+)/g, '[^/]+')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(requestPath)
  }

  // 3. 精确匹配
  return permissionPath === requestPath
}
```

---

## 🎨 前端实现调整

### 1. 类型定义 (`src/features/users/types.ts`)

```typescript
// 🆕 新的权限类型枚举
export enum PermissionType {
  MODULE = 'module',  // 模块权限
  ACTION = 'action'   // 行为权限
}

// 🆕 系统预定义的行为
export const SYSTEM_ACTIONS = [
  { code: 'list', name: '列表', pathSuffix: '' },
  { code: 'view', name: '详情', pathSuffix: '/:id' },
  { code: 'create', name: '创建', pathSuffix: '' },
  { code: 'edit', name: '编辑', pathSuffix: '/:id' },
  { code: 'delete', name: '删除', pathSuffix: '/:id' },
  { code: 'export', name: '导出', pathSuffix: '/export' },
  { code: 'import', name: '导入', pathSuffix: '/import' },
] as const

// 🔄 更新 Permission 接口
export interface Permission {
  id: string
  name: string        // 🔑 必须唯一
  code: string        // 🔑 必须唯一
  type: PermissionType
  module?: string     // 所属模块（ACTION 类型时使用）
  path: string        // 🆕 API 路径
  description?: string
  createdAt?: string
  updatedAt?: string
}

// 🔄 创建权限请求
export interface CreatePermissionRequest {
  name: string
  code: string
  type: PermissionType
  module?: string
  path: string        // 🆕 必填
  description?: string
}
```

### 2. 菜单类型定义 (`src/features/menu/types.ts`)

```typescript
// 🔄 更新 Menu 接口
export interface Menu {
  id: string
  parentId: string | null
  menuGroupId: string | null
  name: string
  title: string
  i18nKey?: string | null
  path?: string
  component?: string
  icon?: string
  sortOrder: number
  menuType: MenuType
  visible: boolean
  isActive: boolean

  // 🆕 是否始终显示（不受权限约束）
  alwaysShow: boolean

  // 🔑 从 permissionIds 改为 permissionId（单个）
  permissionId?: string | null
  permission?: Permission

  children?: Menu[]
  createdAt?: string
  updatedAt?: string
}

// 🔄 更新表单数据
export interface MenuFormData {
  parentId: string | null
  menuGroupId: string | null
  name: string
  title: string
  i18nKey?: string | null
  path?: string
  component?: string
  icon?: string
  sortOrder: number
  menuType: MenuType
  visible: boolean
  isActive: boolean

  // 🆕 新增字段
  alwaysShow: boolean
  permissionId?: string | null  // 单个权限 ID
}
```

### 3. 权限创建表单

```typescript
// 新增：批量创建行为权限
function PermissionBatchCreateDialog({ modulePermission }) {
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const handleSubmit = async () => {
    const requests = selectedActions.map(actionCode => {
      const action = SYSTEM_ACTIONS.find(a => a.code === actionCode)
      const modulePath = modulePermission.path.replace('/*', '')

      return {
        name: `${modulePermission.name}${action.name}`,
        code: `${modulePermission.code}_${actionCode}`,
        type: 'ACTION',
        module: modulePermission.code,
        path: `${modulePath}${action.pathSuffix}`,
        description: `${modulePermission.name}${action.name}权限`
      }
    })

    await permissionService.batchCreate(requests)
  }

  return (
    <Dialog>
      <DialogHeader>
        <DialogTitle>批量创建行为权限</DialogTitle>
        <DialogDescription>
          为"{modulePermission.name}"选择需要的行为权限
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        {SYSTEM_ACTIONS.map(action => (
          <div key={action.code} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedActions.includes(action.code)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedActions([...selectedActions, action.code])
                } else {
                  setSelectedActions(selectedActions.filter(c => c !== action.code))
                }
              }}
            />
            <Label>{action.name}</Label>
            <span className="text-sm text-muted-foreground">
              ({action.code})
            </span>
          </div>
        ))}
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit}>
          创建 {selectedActions.length} 个权限
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
```

### 4. 菜单表单调整

```typescript
// 菜单创建/编辑表单
function MenuItemForm({ initialData, onSubmit }) {
  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getPermissions()
  })

  return (
    <Form>
      {/* 基本字段 */}
      <FormField name="name" />
      <FormField name="title" />
      <FormField name="menuType" />

      {/* 🆕 始终显示开关 */}
      <FormField name="alwaysShow">
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>始终显示</FormLabel>
            <FormDescription>
              启用后，此菜单将不受权限约束，始终显示给所有用户
            </FormDescription>
          </div>
          <FormControl>
            <Switch />
          </FormControl>
        </FormItem>
      </FormField>

      {/* 🔄 单个权限选择（如果 alwaysShow 为 false） */}
      {!form.watch('alwaysShow') && (
        <FormField name="permissionId">
          <FormItem>
            <FormLabel>关联权限</FormLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择权限..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>无权限</SelectItem>
                {permissions?.map(perm => (
                  <SelectItem key={perm.id} value={perm.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{perm.type}</Badge>
                      <span>{perm.name}</span>
                      <code className="text-xs text-muted-foreground">
                        {perm.code}
                      </code>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              选择此菜单需要的权限
            </FormDescription>
          </FormItem>
        </FormField>
      )}
    </Form>
  )
}
```

### 5. Sidebar 过滤逻辑

```typescript
// 获取并过滤菜单
async function getFilteredMenus(userId: string): Promise<Menu[]> {
  // 1. 获取所有有效菜单
  const allMenus = await menuService.getActiveMenus()

  // 2. 获取用户权限列表（只需要 ID）
  const userPermissions = await getUserPermissions(userId)
  const permissionIds = new Set(userPermissions.map(p => p.id))

  // 3. 过滤菜单
  const filteredMenus = filterMenusByPermission(allMenus, permissionIds)

  return filteredMenus
}

// 递归过滤菜单
function filterMenusByPermission(
  menus: Menu[],
  permissionIds: Set<string>
): Menu[] {
  return menus
    .filter(menu => {
      // alwaysShow 为 true，始终显示
      if (menu.alwaysShow) {
        return true
      }

      // 没有关联权限，显示（如目录节点）
      if (!menu.permissionId) {
        return true
      }

      // 检查用户是否有该权限
      return permissionIds.has(menu.permissionId)
    })
    .map(menu => ({
      ...menu,
      children: menu.children
        ? filterMenusByPermission(menu.children, permissionIds)
        : undefined
    }))
}
```

---

## 🎯 优势总结

### 1. 简化权限类型

- 从 3 种类型 (PAGE/API/BUTTON) 减少到 2 种 (MODULE/ACTION)
- 页面/按钮通过 Menu 区分，更符合语义

### 2. 统一 API 验证

- 所有 API 权限通过 `path` 字段统一验证
- 后端只需检查 `permission.path` 与请求路径是否匹配

### 3. 批量创建

- 创建模块时，可以一次性创建多个常见行为权限
- 减少重复操作

### 4. 灵活的菜单控制

- `alwaysShow` 字段提供更灵活的显示控制
- 某些菜单可以不受权限约束（如首页、帮助中心）

### 5. 单一职责

- Permission: 定义"能做什么"和"API 路径"
- Menu: 定义"在哪里显示"和"显示什么"

---

## 📋 待办事项

- [ ] 等待后端 API 调整完成
- [ ] 更新前端类型定义
- [ ] 修改权限管理 UI（支持批量创建）
- [ ] 修改菜单管理 UI（单个权限、alwaysShow）
- [ ] 更新 Sidebar 过滤逻辑
- [ ] 更新权限检查工具函数
- [ ] 数据迁移方案

---

## 🔗 相关文件

- `src/features/users/types.ts` - 权限类型定义
- `src/features/menu/types.ts` - 菜单类型定义
- `src/features/users/components/permission-dialog.tsx` - 权限表单
- `src/features/menu/menu-items/components/menu-item-form.tsx` - 菜单表单
- `src/components/layout/sidebar/` - Sidebar 组件

---

**文档版本**: 1.0
**最后更新**: 2025-10-26
**状态**: 🚧 等待后端 API 调整
