# API差异分析报告

**生成时间**: 2025-10-27T05:39:05.594Z

---

## 📋 摘要

- **总端点数**: 47
- **发现差异数**: 1
- **高优先级**: 1
- **中优先级**: 0
- **低优先级**: 0

## 🔗 API端点列表

### Auth

- `POST /api/Auth/login`
- `POST /api/Auth/refresh`
- `POST /api/Auth/forgot-password`
- `POST /api/Auth/reset-password`
- `POST /api/Auth/register`
- `POST /api/Auth/logout`
- `PUT /api/Auth/change-password`
- `GET /api/Auth/profile`
- `PUT /api/Auth/profile`
- `GET /api/Auth/sidebar`

### Dashboard

- `GET /api/Dashboard/stats`
- `GET /api/Dashboard/recent-activities`

### MenuGroups

- `GET /api/menu-groups`
- `POST /api/menu-groups`
- `GET /api/menu-groups/{id}`
- `PUT /api/menu-groups/{id}`
- `DELETE /api/menu-groups/{id}`

### Menus

- `GET /api/menus`
- `POST /api/menus`
- `GET /api/menus/tree`
- `GET /api/menus/{id}`
- `PUT /api/menus/{id}`
- `DELETE /api/menus/{id}`
- `POST /api/menus/batch-delete`
- `PUT /api/menus/sort`
- `GET /api/menus/sidebar`

### Permissions

- `GET /api/Permissions`
- `POST /api/Permissions`
- `GET /api/Permissions/tree`
- `GET /api/Permissions/{id}`
- `PUT /api/Permissions/{id}`
- `DELETE /api/Permissions/{id}`

### Roles

- `GET /api/Roles`
- `POST /api/Roles`
- `GET /api/Roles/{id}`
- `PUT /api/Roles/{id}`
- `DELETE /api/Roles/{id}`
- `GET /api/Roles/{id}/permissions`
- `PUT /api/Roles/{id}/permissions`

### Users

- `GET /api/Users`
- `POST /api/Users`
- `GET /api/Users/{id}`
- `PUT /api/Users/{id}`
- `DELETE /api/Users/{id}`
- `POST /api/Users/batch-delete`
- `PUT /api/Users/{id}/password`
- `PUT /api/Users/{id}/status`

## ⚠️ 发现的差异

### Menus

#### Menu Type 🔴 **HIGH**

**问题**: 前端使用permissionIds（数组），后端使用permissionId（单个）

**前端使用**:
```
permissionIds: string[]
```

**后端定义**:
```
permissionId: string | null
```

**建议**: 前端需要将permissionIds改为permissionId以匹配后端

---

## 🛠️ 调整方案

### 🔴 高优先级 (必须立即处理)

1. **[Menus] Menu Type**
   - 前端需要将permissionIds改为permissionId以匹配后端

## 📊 关键数据模型

### MenuGroupDto

**字段**:
- `id`: string (optional)
- `name`: string (optional)
- `i18nKey`: string (optional)
- `description`: string (optional)
- `icon`: string (optional)
- `sortOrder`: integer (optional)
- `isActive`: boolean (optional)
- `createdAt`: string (optional)
- `updatedAt`: string (optional)

### MenuDto

**字段**:
- `id`: string (optional)
- `parentId`: string (optional)
- `menuGroupId`: string (optional)
- `name`: string (optional)
- `title`: string (optional)
- `i18nKey`: string (optional)
- `path`: string (optional)
- `redirect`: string (optional)
- `component`: string (optional)
- `icon`: string (optional)
- `sortOrder`: integer (optional)
- `menuType`: MenuType (optional)
- `visible`: boolean (optional)
- `isActive`: boolean (optional)
- `keepAlive`: boolean (optional)
- `isExternal`: boolean (optional)
- `hiddenInBreadcrumb`: boolean (optional)
- `alwaysShow`: boolean (optional)
- `badge`: string (optional)
- `meta`: string (optional)
- `remark`: string (optional)
- `createdAt`: string (optional)
- `updatedAt`: string (optional)
- `deletedAt`: string (optional)
- `permissionId`: string (optional)

### PermissionDto

**字段**:
- `id`: string (optional)
- `code`: string (optional)
- `name`: string (optional)
- `type`: PermissionType (optional)

### RoleDto

**字段**:
- `id`: string (optional)
- `code`: string (optional)
- `name`: string (optional)

### UserDto

**字段**:
- `id`: string (optional)
- `email`: string (optional)
- `username`: string (optional)
- `avatar`: string (optional)
- `role`: string (optional)
- `permissions`: array (optional)

### PermissionType

**枚举值**: Module, Action

### MenuType

**枚举值**: Directory, Menu, Action

