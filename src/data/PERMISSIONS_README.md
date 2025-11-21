# Permissions Seed Data / 权限种子数据

## Overview / 概述

This directory contains seed data for initializing system permissions that match the current UI operations.

本目录包含用于初始化系统权限的种子数据，这些权限与当前UI的操作完全匹配。

## Files / 文件

- `permissions-seed.json` - English version / 英文版本
- `permissions-seed-zh-CN.json` - Chinese version / 中文版本

## Permission Structure / 权限结构

Each permission includes / 每个权限包含:

```json
{
  "name": "Permission Name",
  "code": "module:action",
  "module": "module-name",
  "description": "Description of what this permission allows"
}
```

## Modules and Operations / 模块和操作

### 1. Users Module / 用户模块
- `users:view` - View user list and details / 查看用户列表和详情
- `users:create` - Create new users / 创建新用户
- `users:update` - Update user information / 更新用户信息
- `users:delete` - Delete users / 删除用户
- `users:batch-delete` - Batch delete users / 批量删除用户
- `users:change-password` - Change user passwords / 修改用户密码
- `users:change-status` - Change user status / 修改用户状态

### 2. Roles Module / 角色模块
- `roles:view` - View role list and details / 查看角色列表和详情
- `roles:create` - Create new roles / 创建新角色
- `roles:update` - Update role information / 更新角色信息
- `roles:delete` - Delete roles / 删除角色
- `roles:batch-delete` - Batch delete roles / 批量删除角色
- `roles:manage-permissions` - Manage role permissions / 管理角色权限

### 3. Permissions Module / 权限模块
- `permissions:view` - View permission list and details / 查看权限列表和详情
- `permissions:create` - Create new permissions / 创建新权限
- `permissions:update` - Update permission information / 更新权限信息
- `permissions:delete` - Delete permissions / 删除权限

### 4. Menu Groups Module / 菜单组模块
- `menu-groups:view` - View menu group list and details / 查看菜单组列表和详情
- `menu-groups:create` - Create new menu groups / 创建新菜单组
- `menu-groups:update` - Update menu group information / 更新菜单组信息
- `menu-groups:delete` - Delete menu groups / 删除菜单组
- `menu-groups:batch-delete` - Batch delete menu groups / 批量删除菜单组

### 5. Menu Items Module / 菜单项模块
- `menu-items:view` - View menu item list and details / 查看菜单项列表和详情
- `menu-items:create` - Create new menu items / 创建新菜单项
- `menu-items:update` - Update menu item information / 更新菜单项信息
- `menu-items:delete` - Delete menu items / 删除菜单项
- `menu-items:batch-delete` - Batch delete menu items / 批量删除菜单项
- `menu-items:sort` - Sort menu items / 排序菜单项

### 6. Settings Module / 设置模块
- `settings:view` - View system settings / 查看系统设置
- `settings:update` - Update system settings / 更新系统设置

## How to Use / 使用方法

### Option 1: Manual Creation via UI / 通过UI手动创建

1. Log in to the system as an administrator / 以管理员身份登录系统
2. Navigate to **Users > Permissions** / 导航到 **用户管理 > 权限管理**
3. Click **Add Permission** / 点击 **添加权限**
4. Enter the permission details from the seed file / 输入种子文件中的权限详情
5. Repeat for all permissions / 对所有权限重复此操作

### Option 2: Import via API / 通过API导入

You can create a script to batch import permissions: / 你可以创建脚本批量导入权限:

```typescript
import permissionsSeed from './permissions-seed.json'
import { permissionService } from '@/features/users/services'

async function seedPermissions() {
  for (const permission of permissionsSeed.permissions) {
    try {
      await permissionService.createPermission({
        name: permission.name,
        code: permission.code,
        module: permission.module,
        action: permission.code.split(':')[1],
        description: permission.description
      })
      console.log(`✓ Created permission: ${permission.code}`)
    } catch (error) {
      console.error(`✗ Failed to create permission: ${permission.code}`, error)
    }
  }
}
```

### Option 3: Backend Seeder / 后端种子数据

Copy the permission data to your backend and create a database seeder to initialize permissions when setting up a new environment.

将权限数据复制到后端，创建数据库种子文件，在设置新环境时初始化权限。

## Mapping to UI Operations / UI操作映射

Each permission code maps directly to operations in the UI:

每个权限代码直接映射到UI中的操作：

| UI Operation | Permission Code | Location |
|-------------|-----------------|----------|
| View user list | `users:view` | /users |
| Create user button | `users:create` | /users |
| Edit user button | `users:update` | /users |
| Delete user button | `users:delete` | /users |
| Batch delete users | `users:batch-delete` | /users |
| Change password | `users:change-password` | /users (dropdown) |
| Change user status | `users:change-status` | /users (dropdown) |
| View role list | `roles:view` | /users/roles |
| Create role button | `roles:create` | /users/roles |
| Edit role button | `roles:update` | /users/roles |
| Delete role button | `roles:delete` | /users/roles |
| Batch delete roles | `roles:batch-delete` | /users/roles |
| Manage permissions | `roles:manage-permissions` | /users/roles |
| View permission list | `permissions:view` | /users/permissions |
| Create permission | `permissions:create` | /users/permissions |
| Edit permission | `permissions:update` | /users/permissions |
| Delete permission | `permissions:delete` | /users/permissions |
| View menu groups | `menu-groups:view` | /menu/groups |
| Create menu group | `menu-groups:create` | /menu/groups |
| Edit menu group | `menu-groups:update` | /menu/groups |
| Delete menu group | `menu-groups:delete` | /menu/groups |
| View menu items | `menu-items:view` | /menu/items |
| Create menu item | `menu-items:create` | /menu/items |
| Edit menu item | `menu-items:update` | /menu/items |
| Delete menu item | `menu-items:delete` | /menu/items |
| Sort menu items | `menu-items:sort` | /menu/items |
| View settings | `settings:view` | /settings |
| Update settings | `settings:update` | /settings |

## Notes / 注意事项

1. **Total Permissions**: 30 permissions across 6 modules / 共30个权限，分布在6个模块
2. **Naming Convention**: `module:action` format / 命名约定：`模块:操作` 格式
3. **Module Names**: Use kebab-case (e.g., `menu-items`, not `menuItems`) / 模块名使用短横线命名法
4. **Action Names**: Use kebab-case (e.g., `batch-delete`, not `batchDelete`) / 操作名使用短横线命名法
5. **Consistency**: Permission codes must match exactly with the UI operations / 权限代码必须与UI操作完全匹配

## Maintenance / 维护

When adding new features to the UI, remember to: / 向UI添加新功能时，请记住：

1. Add corresponding permissions to these seed files / 将相应的权限添加到这些种子文件
2. Update this README with the new permissions / 使用新权限更新此README
3. Create the permissions in the database / 在数据库中创建权限
4. Assign permissions to appropriate roles / 将权限分配给适当的角色

## Version History / 版本历史

- **v1.0.0** (2025-01-19): Initial permission set matching current UI operations / 初始权限集，匹配当前UI操作
