# API 接口规范文档

## 基础信息

- Base URL: `/api`
- 数据格式: JSON
- 认证方式: Bearer Token (JWT)
- 响应格式统一:
  ```typescript
  {
    success: boolean
    data: T | null
    message?: string
    code?: string
  }
  ```

## 1. 认证接口 (Authentication)

### 1.1 用户登录
**POST** `/api/auth/login`

Request:
```json
{
  "email": "admin@example.com",
  "password": "NewPass@123",
  "remember": false
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "admin@example.com",
      "username": "admin",
      "avatar": "/avatars/admin.png",
      "role": "admin",
      "permissions": ["user:create", "user:read", "user:update", "user:delete", ...]
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 1.2 用户注册
**POST** `/api/auth/register`

Request:
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

### 1.3 刷新Token
**POST** `/api/auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 1.4 获取当前用户信息
**GET** `/api/auth/profile`

Headers: `Authorization: Bearer {accessToken}`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "admin@example.com",
    "username": "admin",
    "avatar": "/avatars/admin.png",
    "role": "admin",
    "permissions": ["user:create", ...]
  }
}
```

### 1.5 用户登出
**POST** `/api/auth/logout`

Headers: `Authorization: Bearer {accessToken}`

### 1.6 忘记密码
**POST** `/api/auth/forgot-password`

Request:
```json
{
  "email": "user@example.com"
}
```

### 1.7 重置密码
**POST** `/api/auth/reset-password`

Request:
```json
{
  "token": "reset_token_from_email",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

## 2. 用户管理接口 (Users)

### 2.1 获取用户列表（分页）
**GET** `/api/users?page=1&pageSize=10&keyword=john&status=active&roleId=role-1&department=Engineering&sortBy=createdAt&sortOrder=desc`

Response (200):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "user-1",
        "username": "john.doe",
        "email": "john.doe@example.com",
        "phone": "+1 (555) 1234",
        "avatar": "/avatars/01.png",
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John Doe",
        "status": "active",
        "roles": [
          {
            "id": "role-1",
            "name": "Admin",
            "code": "admin"
          }
        ],
        "department": "Engineering",
        "position": "Manager",
        "lastLoginAt": "2024-01-15T10:30:00.000Z",
        "lastLoginIp": "192.168.1.1",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### 2.2 获取单个用户
**GET** `/api/users/{id}`

### 2.3 创建用户
**POST** `/api/users`

Request:
```json
{
  "username": "new.user",
  "email": "new.user@example.com",
  "password": "Password123!",
  "phone": "+1 (555) 5678",
  "firstName": "New",
  "lastName": "User",
  "roles": ["role-2"],
  "department": "Sales",
  "position": "Developer",
  "status": "active"
}
```

### 2.4 更新用户
**PUT** `/api/users/{id}`

Request:
```json
{
  "username": "updated.user",
  "email": "updated@example.com",
  "phone": "+1 (555) 9999",
  "firstName": "Updated",
  "lastName": "User",
  "avatar": "/avatars/updated.png",
  "roles": ["role-1", "role-2"],
  "department": "Marketing",
  "position": "Manager",
  "status": "active"
}
```

### 2.5 删除用户
**DELETE** `/api/users/{id}`

### 2.6 批量删除用户
**POST** `/api/users/batch-delete`

Request:
```json
{
  "ids": ["user-1", "user-2", "user-3"]
}
```

### 2.7 修改密码
**POST** `/api/users/{id}/password`

Request:
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### 2.8 修改用户状态
**PATCH** `/api/users/{id}/status`

Request:
```json
{
  "status": "suspended"
}
```

## 3. 角色管理接口 (Roles)

### 3.1 获取角色列表
**GET** `/api/roles`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "role-1",
      "name": "Super Admin",
      "code": "super_admin",
      "description": "Full system access",
      "permissions": ["user:create", "user:read", ...],
      "isSystem": true,
      "userCount": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3.2 获取单个角色
**GET** `/api/roles/{id}`

### 3.3 创建角色
**POST** `/api/roles`

Request:
```json
{
  "name": "Content Manager",
  "code": "content_manager",
  "description": "Manage content and posts",
  "permissions": ["post:create", "post:read", "post:update", "post:delete"]
}
```

### 3.4 更新角色
**PUT** `/api/roles/{id}`

Request:
```json
{
  "name": "Updated Role Name",
  "description": "Updated description",
  "permissions": ["permission-1", "permission-2"]
}
```

### 3.5 删除角色
**DELETE** `/api/roles/{id}`

### 3.6 获取角色的权限列表
**GET** `/api/roles/{id}/permissions`

### 3.7 分配权限给角色
**POST** `/api/roles/{id}/permissions`

Request:
```json
{
  "permissions": ["permission-1", "permission-2", "permission-3"]
}
```

## 4. 权限管理接口 (Permissions)

### 4.1 获取权限列表
**GET** `/api/permissions`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "perm-1",
      "name": "创建用户",
      "code": "user:create",
      "description": "允许创建新用户",
      "module": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4.2 获取权限树结构
**GET** `/api/permissions/tree`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "module-user",
      "name": "用户管理",
      "code": "user",
      "module": "user",
      "children": [
        {
          "id": "perm-1",
          "name": "创建用户",
          "code": "user:create",
          "module": "user"
        },
        {
          "id": "perm-2",
          "name": "查看用户",
          "code": "user:read",
          "module": "user"
        }
      ]
    }
  ]
}
```

### 4.3 获取单个权限
**GET** `/api/permissions/{id}`

## 错误响应格式

```json
{
  "success": false,
  "data": null,
  "message": "错误信息描述",
  "code": "ERROR_CODE"
}
```

### 常见错误码

- `UNAUTHORIZED` (401): 未认证或Token过期
- `FORBIDDEN` (403): 无权限访问
- `NOT_FOUND` (404): 资源不存在
- `VALIDATION_ERROR` (422): 数据验证失败
- `INTERNAL_SERVER_ERROR` (500): 服务器错误

## 测试账号

### 管理员账号
- Email: `admin@example.com`
- Password: `NewPass@123`
- 角色: Super Admin
- 权限: 全部权限

### 普通用户账号
- Email: `user@example.com`
- Password: `User123!`
- 角色: User
- 权限: 基础权限

### 经理账号
- Email: `manager@example.com`
- Password: `Manager123!`
- 角色: Manager
- 权限: 用户管理、内容管理
