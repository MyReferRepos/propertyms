# Backend API Specification

**Version**: 2.0
**Last Updated**: 2025-10-23
**Purpose**: Complete API specification for Menu-Permission Driven RBAC system

---

## 📋 Overview

This document provides comprehensive API specifications for the backend implementation of the ZoranMS RBAC system. All endpoints require authentication unless explicitly stated otherwise.

### Base URL

```
Development: http://localhost:3000/api
Production: https://api.zoranms.com/api
```

### Authentication

All API endpoints (except `/auth/login`) require JWT authentication:

```http
Authorization: Bearer <JWT_TOKEN>
```

**JWT Token Structure**:
```json
{
  "userId": "uuid",
  "username": "string",
  "email": "string",
  "roles": ["ADMIN", "USER"],
  "permissions": ["user:view", "role:create"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Common Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional details */ }
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

### Common HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but lacks permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

---

## 🔐 Authentication Endpoints

### POST /auth/login

Authenticate user and receive JWT token.

**Request**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "00000000-0000-0000-0000-000000000001",
      "username": "admin",
      "email": "admin@zoranms.com",
      "displayName": "System Administrator",
      "avatar": "/avatars/admin.png"
    },
    "roles": [
      {
        "id": "10000000-0000-0000-0000-000000000001",
        "code": "ADMIN",
        "name": "System Administrator"
      }
    ],
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page"
      }
      // ... all user permissions
    ]
  },
  "message": "Login successful",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Responses**:

**Invalid Credentials** (401):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password"
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Account Inactive** (403):
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_INACTIVE",
    "message": "Your account has been deactivated"
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

## 🍔 Menu Endpoints

### GET /menus/sidebar

**Critical Endpoint**: Get current user's sidebar navigation menu with permission filtering.

**Authentication**: Required

**Permissions**: No specific permission required (returns menus based on user's permissions)

**Request**:
```http
GET /api/menus/sidebar
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "menuGroups": [
      {
        "id": "20000000-0000-0000-0000-000000000001",
        "name": "General",
        "code": "general",
        "i18nKey": "nav.general",
        "icon": "layers",
        "description": "General features and common functions",
        "sortOrder": 1,
        "menus": [
          {
            "id": "40000000-0000-0000-0000-000000000001",
            "parentId": null,
            "menuGroupId": "20000000-0000-0000-0000-000000000001",
            "name": "Dashboard",
            "title": "Dashboard",
            "i18nKey": "nav.dashboard",
            "path": "/dashboard",
            "component": "views/dashboard/index",
            "icon": "layout-dashboard",
            "badge": null,
            "sortOrder": 1,
            "menuType": "menu",
            "visible": true,
            "keepAlive": true,
            "isExternal": false,
            "hiddenInBreadcrumb": false,
            "alwaysShow": false,
            "meta": null,
            "permissions": [
              {
                "id": "30000000-0000-0000-0000-000000000001",
                "code": "dashboard:view",
                "name": "View Dashboard",
                "type": "page"
              }
            ],
            "children": []
          }
        ]
      },
      {
        "id": "20000000-0000-0000-0000-000000000002",
        "name": "System Management",
        "code": "system",
        "i18nKey": "nav.system",
        "icon": "settings",
        "description": "System administration and configuration",
        "sortOrder": 2,
        "menus": [
          {
            "id": "40000000-0000-0000-0000-000000000010",
            "parentId": null,
            "name": "UserManagement",
            "title": "User Management",
            "i18nKey": "nav.userManagement",
            "path": "/users",
            "icon": "users",
            "sortOrder": 1,
            "menuType": "directory",
            "visible": true,
            "alwaysShow": true,
            "permissions": [],
            "children": [
              {
                "id": "40000000-0000-0000-0000-000000000011",
                "parentId": "40000000-0000-0000-0000-000000000010",
                "name": "UserList",
                "title": "User List",
                "i18nKey": "nav.users.list",
                "path": "/users/list",
                "component": "views/users/list",
                "icon": "users",
                "sortOrder": 1,
                "menuType": "menu",
                "visible": true,
                "keepAlive": true,
                "permissions": [
                  {
                    "id": "30000000-0000-0000-0000-000000000010",
                    "code": "user:view",
                    "name": "View Users",
                    "type": "page"
                  }
                ],
                "children": []
              },
              {
                "id": "40000000-0000-0000-0000-000000000012",
                "parentId": "40000000-0000-0000-0000-000000000010",
                "name": "RoleManagement",
                "title": "Role Management",
                "i18nKey": "nav.users.roles",
                "path": "/users/roles",
                "component": "views/users/roles",
                "icon": "shield",
                "sortOrder": 2,
                "menuType": "menu",
                "visible": true,
                "keepAlive": true,
                "permissions": [
                  {
                    "id": "30000000-0000-0000-0000-000000000020",
                    "code": "role:view",
                    "name": "View Roles",
                    "type": "page"
                  }
                ],
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  "message": "Sidebar menu retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Implementation Logic**:

```typescript
async function getSidebarMenu(userId: string): Promise<SidebarMenuResponse> {
  // 1. Get all user permissions
  const userPermissions = await getUserPermissions(userId)

  // 2. Get all menu groups (active only)
  const menuGroups = await db.menuGroups
    .findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' }
    })

  // 3. For each group, get filtered menus
  const result = await Promise.all(
    menuGroups.map(async (group) => {
      // Get all menus for this group
      const allMenus = await db.menus.findMany({
        where: {
          menuGroupId: group.id,
          isActive: true,
          visible: true,
          deletedAt: null
        },
        include: {
          permissions: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      // Filter menus by permissions
      const accessibleMenus = filterMenusByPermissions(
        allMenus,
        userPermissions
      )

      // Build menu tree
      const menuTree = buildMenuTree(accessibleMenus)

      return {
        ...group,
        menus: menuTree
      }
    })
  )

  // Remove empty groups
  return {
    menuGroups: result.filter(group => group.menus.length > 0)
  }
}

function filterMenusByPermissions(
  menus: Menu[],
  userPermissions: Permission[]
): Menu[] {
  return menus.filter(menu => {
    // If menu has no permissions, it's accessible to all authenticated users
    if (!menu.permissions || menu.permissions.length === 0) {
      return true
    }

    // User must have ALL required permissions (AND logic)
    return menu.permissions.every(requiredPerm =>
      userPermissions.some(userPerm => userPerm.id === requiredPerm.id)
    )
  })
}

function buildMenuTree(flatMenus: Menu[]): Menu[] {
  const menuMap = new Map<string, Menu>()
  const rootMenus: Menu[] = []

  // First pass: create map
  flatMenus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] })
  })

  // Second pass: build tree
  flatMenus.forEach(menu => {
    const menuWithChildren = menuMap.get(menu.id)!

    if (menu.parentId === null) {
      rootMenus.push(menuWithChildren)
    } else {
      const parent = menuMap.get(menu.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(menuWithChildren)
      }
    }
  })

  return rootMenus
}
```

**Error Responses**:

**Unauthorized** (401):
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid authentication token"
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### GET /menus/top

Get current user's top navigation menu.

**Authentication**: Required

**Request**:
```http
GET /api/menus/top
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "menuGroups": [
      // Same structure as sidebar, but may include different menus
      // based on menu configuration (e.g., menus with meta.showInTop = true)
    ]
  },
  "message": "Top menu retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Implementation Note**: This endpoint can either:
1. Return the same structure as `/menus/sidebar` if top menu = sidebar
2. Filter menus based on `meta.showInTop` flag
3. Query a separate set of menus configured for top navigation

---

### GET /menus

Get all menus (admin only, for menu management).

**Authentication**: Required

**Permissions**: `menu:view`

**Query Parameters**:
- `groupId` (optional): Filter by menu group
- `type` (optional): Filter by menu type (`directory`, `menu`, `button`)
- `visible` (optional): Filter by visibility (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search in name/title

**Request**:
```http
GET /api/menus?groupId=20000000-0000-0000-0000-000000000001&page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "40000000-0000-0000-0000-000000000001",
        "parentId": null,
        "menuGroupId": "20000000-0000-0000-0000-000000000001",
        "name": "Dashboard",
        "title": "Dashboard",
        "i18nKey": "nav.dashboard",
        "path": "/dashboard",
        "component": "views/dashboard/index",
        "redirect": null,
        "icon": "layout-dashboard",
        "badge": null,
        "sortOrder": 1,
        "menuType": "menu",
        "visible": true,
        "isActive": true,
        "keepAlive": true,
        "isExternal": false,
        "hiddenInBreadcrumb": false,
        "alwaysShow": false,
        "remark": null,
        "meta": null,
        "createdAt": "2025-10-23T10:00:00Z",
        "updatedAt": "2025-10-23T10:00:00Z",
        "group": {
          "id": "20000000-0000-0000-0000-000000000001",
          "name": "General",
          "code": "general",
          "i18nKey": "nav.general"
        },
        "permissions": [
          {
            "id": "30000000-0000-0000-0000-000000000001",
            "code": "dashboard:view",
            "name": "View Dashboard",
            "type": "page"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3
    }
  },
  "message": "Menus retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Response** (403 Forbidden):
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to view menus",
    "details": {
      "required": "menu:view",
      "userPermissions": ["dashboard:view", "user:view"]
    }
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### GET /menus/:id

Get single menu by ID.

**Authentication**: Required

**Permissions**: `menu:view`

**Request**:
```http
GET /api/menus/40000000-0000-0000-0000-000000000001
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "40000000-0000-0000-0000-000000000001",
    "parentId": null,
    "menuGroupId": "20000000-0000-0000-0000-000000000001",
    "name": "Dashboard",
    "title": "Dashboard",
    "i18nKey": "nav.dashboard",
    "path": "/dashboard",
    "component": "views/dashboard/index",
    "icon": "layout-dashboard",
    "sortOrder": 1,
    "menuType": "menu",
    "visible": true,
    "isActive": true,
    "keepAlive": true,
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page"
      }
    ],
    "group": {
      "id": "20000000-0000-0000-0000-000000000001",
      "name": "General",
      "code": "general"
    },
    "parent": null,
    "children": []
  },
  "message": "Menu retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "MENU_NOT_FOUND",
    "message": "Menu with ID '40000000-0000-0000-0000-000000000001' not found"
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### POST /menus

Create new menu.

**Authentication**: Required

**Permissions**: `menu:manage`

**Request**:
```http
POST /api/menus
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "parentId": null,
  "menuGroupId": "20000000-0000-0000-0000-000000000001",
  "name": "NewPage",
  "title": "New Page",
  "i18nKey": "nav.newPage",
  "path": "/new-page",
  "component": "views/new-page/index",
  "icon": "file",
  "badge": "New",
  "sortOrder": 10,
  "menuType": "menu",
  "visible": true,
  "isActive": true,
  "keepAlive": true,
  "isExternal": false,
  "hiddenInBreadcrumb": false,
  "alwaysShow": false,
  "remark": "New feature page",
  "meta": {
    "cache": true,
    "affix": false
  },
  "permissionIds": [
    "30000000-0000-0000-0000-000000000001"
  ]
}
```

**Request Body Validation**:
- `name`: Required, unique, 1-100 characters
- `title`: Required, 1-100 characters
- `i18nKey`: Optional, follows pattern: `^[a-z]+(\.[a-z]+)*$`
- `menuType`: Required, one of: `directory`, `menu`, `button`
- `path`: Required for `menu` type
- `component`: Required for `menu` type
- `sortOrder`: Optional, default: 0

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "40000000-0000-0000-0000-000000000099",
    "parentId": null,
    "menuGroupId": "20000000-0000-0000-0000-000000000001",
    "name": "NewPage",
    "title": "New Page",
    "i18nKey": "nav.newPage",
    "path": "/new-page",
    "component": "views/new-page/index",
    "icon": "file",
    "badge": "New",
    "sortOrder": 10,
    "menuType": "menu",
    "visible": true,
    "isActive": true,
    "keepAlive": true,
    "isExternal": false,
    "hiddenInBreadcrumb": false,
    "alwaysShow": false,
    "remark": "New feature page",
    "meta": {
      "cache": true,
      "affix": false
    },
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page"
      }
    ],
    "createdAt": "2025-10-23T10:30:00Z",
    "updatedAt": "2025-10-23T10:30:00Z"
  },
  "message": "Menu created successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Response** (409 Conflict):
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_MENU_NAME",
    "message": "Menu with name 'NewPage' already exists",
    "details": {
      "field": "name",
      "value": "NewPage"
    }
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Response** (422 Validation Error):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "path",
          "message": "Path is required for menu type 'menu'"
        },
        {
          "field": "i18nKey",
          "message": "i18nKey must follow pattern: category.subcategory.item"
        }
      ]
    }
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### PUT /menus/:id

Update existing menu.

**Authentication**: Required

**Permissions**: `menu:manage`

**Request**:
```http
PUT /api/menus/40000000-0000-0000-0000-000000000001
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated Dashboard",
  "i18nKey": "nav.dashboardUpdated",
  "icon": "home",
  "sortOrder": 5,
  "visible": true,
  "badge": "Updated"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "40000000-0000-0000-0000-000000000001",
    "title": "Updated Dashboard",
    "i18nKey": "nav.dashboardUpdated",
    "icon": "home",
    "sortOrder": 5,
    "visible": true,
    "badge": "Updated",
    "updatedAt": "2025-10-23T10:35:00Z"
    // ... other fields
  },
  "message": "Menu updated successfully",
  "timestamp": "2025-10-23T10:35:00Z"
}
```

---

### DELETE /menus/:id

Delete menu (soft delete).

**Authentication**: Required

**Permissions**: `menu:manage`

**Request**:
```http
DELETE /api/menus/40000000-0000-0000-0000-000000000001
Authorization: Bearer <JWT_TOKEN>
```

**Response** (204 No Content)

**Error Response** (409 Conflict):
```json
{
  "success": false,
  "error": {
    "code": "MENU_HAS_CHILDREN",
    "message": "Cannot delete menu with children. Delete children first.",
    "details": {
      "menuId": "40000000-0000-0000-0000-000000000010",
      "childrenCount": 3
    }
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### POST /menus/:id/permissions

Assign permissions to menu.

**Authentication**: Required

**Permissions**: `menu:manage`

**Request**:
```http
POST /api/menus/40000000-0000-0000-0000-000000000001/permissions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "permissionIds": [
    "30000000-0000-0000-0000-000000000001",
    "30000000-0000-0000-0000-000000000002"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "menuId": "40000000-0000-0000-0000-000000000001",
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page"
      },
      {
        "id": "30000000-0000-0000-0000-000000000002",
        "code": "dashboard:api",
        "name": "Dashboard API",
        "type": "api"
      }
    ]
  },
  "message": "Permissions assigned to menu successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

## 🎭 Role Endpoints

### GET /roles

Get all roles.

**Authentication**: Required

**Permissions**: `role:view`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search in name/code

**Request**:
```http
GET /api/roles?page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "10000000-0000-0000-0000-000000000001",
        "name": "System Administrator",
        "code": "ADMIN",
        "description": "Full system access with all permissions",
        "isActive": true,
        "isSystem": true,
        "createdAt": "2025-10-23T10:00:00Z",
        "updatedAt": "2025-10-23T10:00:00Z",
        "permissionCount": 45,
        "userCount": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 4,
      "totalPages": 1
    }
  },
  "message": "Roles retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### GET /roles/:id

Get single role by ID with permissions.

**Authentication**: Required

**Permissions**: `role:view`

**Request**:
```http
GET /api/roles/10000000-0000-0000-0000-000000000001
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "10000000-0000-0000-0000-000000000001",
    "name": "System Administrator",
    "code": "ADMIN",
    "description": "Full system access with all permissions",
    "isActive": true,
    "isSystem": true,
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page",
        "resource": "dashboard",
        "action": "view"
      }
      // ... all permissions
    ],
    "createdAt": "2025-10-23T10:00:00Z",
    "updatedAt": "2025-10-23T10:00:00Z"
  },
  "message": "Role retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### POST /roles

Create new role.

**Authentication**: Required

**Permissions**: `role:create`

**Request**:
```http
POST /api/roles
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Content Manager",
  "code": "CONTENT_MANAGER",
  "description": "Manage content and posts",
  "isActive": true,
  "permissionIds": [
    "30000000-0000-0000-0000-000000000001"
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "10000000-0000-0000-0000-000000000099",
    "name": "Content Manager",
    "code": "CONTENT_MANAGER",
    "description": "Manage content and posts",
    "isActive": true,
    "isSystem": false,
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page"
      }
    ],
    "createdAt": "2025-10-23T10:30:00Z",
    "updatedAt": "2025-10-23T10:30:00Z"
  },
  "message": "Role created successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### PUT /roles/:id

Update role.

**Authentication**: Required

**Permissions**: `role:update`

**Request**:
```http
PUT /api/roles/10000000-0000-0000-0000-000000000099
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Senior Content Manager",
  "description": "Manage all content operations",
  "isActive": true
}
```

**Response** (200 OK)

---

### DELETE /roles/:id

Delete role (soft delete).

**Authentication**: Required

**Permissions**: `role:delete`

**Request**:
```http
DELETE /api/roles/10000000-0000-0000-0000-000000000099
Authorization: Bearer <JWT_TOKEN>
```

**Response** (204 No Content)

**Error Response** (409 Conflict):
```json
{
  "success": false,
  "error": {
    "code": "ROLE_IN_USE",
    "message": "Cannot delete role assigned to users",
    "details": {
      "roleId": "10000000-0000-0000-0000-000000000099",
      "userCount": 5
    }
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

**Error Response** (403 Forbidden):
```json
{
  "success": false,
  "error": {
    "code": "SYSTEM_ROLE_PROTECTED",
    "message": "Cannot delete system role"
  },
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### POST /roles/:id/permissions

Assign permissions to role.

**Authentication**: Required

**Permissions**: `role:assign-permissions`

**Request**:
```http
POST /api/roles/10000000-0000-0000-0000-000000000099/permissions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "permissionIds": [
    "30000000-0000-0000-0000-000000000001",
    "30000000-0000-0000-0000-000000000010",
    "30000000-0000-0000-0000-000000000011"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "roleId": "10000000-0000-0000-0000-000000000099",
    "permissions": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "code": "dashboard:view",
        "name": "View Dashboard",
        "type": "page"
      },
      {
        "id": "30000000-0000-0000-0000-000000000010",
        "code": "user:view",
        "name": "View Users",
        "type": "page"
      },
      {
        "id": "30000000-0000-0000-0000-000000000011",
        "code": "user:create",
        "name": "Create User",
        "type": "button"
      }
    ]
  },
  "message": "Permissions assigned to role successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

## 🔒 Permission Endpoints

### GET /permissions

Get all permissions.

**Authentication**: Required

**Permissions**: `permission:view`

**Query Parameters**:
- `type` (optional): Filter by type (`page`, `api`, `button`)
- `resource` (optional): Filter by resource
- `page` (optional): Page number
- `limit` (optional): Items per page

**Request**:
```http
GET /api/permissions?type=page&page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "30000000-0000-0000-0000-000000000001",
        "name": "View Dashboard",
        "code": "dashboard:view",
        "type": "page",
        "resource": "dashboard",
        "action": "view",
        "description": "Access dashboard page",
        "isActive": true,
        "createdAt": "2025-10-23T10:00:00Z",
        "updatedAt": "2025-10-23T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  },
  "message": "Permissions retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### POST /permissions

Create new permission.

**Authentication**: Required

**Permissions**: `permission:create`

**Request**:
```http
POST /api/permissions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Export Reports",
  "code": "report:export",
  "type": "button",
  "resource": "report",
  "action": "export",
  "description": "Export reports to various formats",
  "isActive": true
}
```

**Request Body Validation**:
- `code`: Must match pattern `{resource}:{action}`
- `type`: Must be one of: `page`, `api`, `button`
- `resource`: Lowercase alphanumeric with hyphens
- `action`: Lowercase alphanumeric with hyphens

**Response** (201 Created)

---

## 👤 User Endpoints

### GET /users

Get all users.

**Authentication**: Required

**Permissions**: `user:view`

**Query Parameters**:
- `page`, `limit`, `search`
- `roleId` (optional): Filter by role

**Request**:
```http
GET /api/users?page=1&limit=20&search=admin
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "00000000-0000-0000-0000-000000000001",
        "username": "admin",
        "email": "admin@zoranms.com",
        "displayName": "System Administrator",
        "avatar": "/avatars/admin.png",
        "isActive": true,
        "lastLoginAt": "2025-10-23T09:00:00Z",
        "roles": [
          {
            "id": "10000000-0000-0000-0000-000000000001",
            "code": "ADMIN",
            "name": "System Administrator"
          }
        ],
        "createdAt": "2025-10-01T10:00:00Z",
        "updatedAt": "2025-10-23T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "message": "Users retrieved successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

### POST /users/:id/roles

Assign roles to user.

**Authentication**: Required

**Permissions**: `user:update`

**Request**:
```http
POST /api/users/00000000-0000-0000-0000-000000000002/roles
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "roleIds": [
    "10000000-0000-0000-0000-000000000002",
    "10000000-0000-0000-0000-000000000003"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "00000000-0000-0000-0000-000000000002",
    "roles": [
      {
        "id": "10000000-0000-0000-0000-000000000002",
        "code": "USER_MANAGER",
        "name": "User Manager"
      },
      {
        "id": "10000000-0000-0000-0000-000000000003",
        "code": "USER",
        "name": "Regular User"
      }
    ]
  },
  "message": "Roles assigned to user successfully",
  "timestamp": "2025-10-23T10:30:00Z"
}
```

---

## 🔐 Permission Checking Middleware

**Implementation Guide**:

```typescript
// Permission checking middleware
function requirePermission(permissionCode: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user // From JWT token

    // Get user's permissions from database
    const userPermissions = await getUserPermissions(user.id)

    // Check if user has required permission
    const hasPermission = userPermissions.some(
      p => p.code === permissionCode
    )

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Permission '${permissionCode}' required`,
          details: {
            required: permissionCode,
            userPermissions: userPermissions.map(p => p.code)
          }
        },
        timestamp: new Date().toISOString()
      })
    }

    next()
  }
}

// Usage in routes
router.get('/menus',
  authenticate,
  requirePermission('menu:view'),
  getMenus
)

router.post('/menus',
  authenticate,
  requirePermission('menu:manage'),
  createMenu
)
```

---

## 📚 Related Documentation

- **Database Schema**: `BACKEND_DATABASE_SCHEMA_GUIDE.md`
- **Seed Data**: `backend_seed_data.sql`
- **Frontend Implementation**: `FINAL_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Backend Implementation Checklist

### Core APIs
- [ ] `POST /auth/login` - User authentication
- [ ] `GET /menus/sidebar` - User sidebar menu (with permission filtering)
- [ ] `GET /menus/top` - Top navigation menu
- [ ] `GET /menus` - List all menus (admin)
- [ ] `POST /menus` - Create menu
- [ ] `PUT /menus/:id` - Update menu
- [ ] `DELETE /menus/:id` - Delete menu
- [ ] `POST /menus/:id/permissions` - Assign permissions to menu

### Role Management
- [ ] `GET /roles` - List roles
- [ ] `GET /roles/:id` - Get role details
- [ ] `POST /roles` - Create role
- [ ] `PUT /roles/:id` - Update role
- [ ] `DELETE /roles/:id` - Delete role
- [ ] `POST /roles/:id/permissions` - Assign permissions to role

### Permission Management
- [ ] `GET /permissions` - List permissions
- [ ] `POST /permissions` - Create permission

### User Management
- [ ] `GET /users` - List users
- [ ] `POST /users/:id/roles` - Assign roles to user

### Middleware
- [ ] JWT authentication middleware
- [ ] Permission checking middleware
- [ ] Error handling middleware
- [ ] Request validation middleware

### Business Logic
- [ ] Permission checking algorithm
- [ ] Menu tree building
- [ ] Menu permission filtering
- [ ] Soft deletion handling
- [ ] Prevent circular references in menu tree
- [ ] Prevent deletion of system roles

### Security
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Password hashing (bcrypt/argon2)
- [ ] JWT token expiration
- [ ] Refresh token mechanism

---

**Document Version**: 2.0
**Last Updated**: 2025-10-23
**Maintained By**: Backend Development Team
