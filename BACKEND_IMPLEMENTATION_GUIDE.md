# Backend Implementation Guide

**Version**: 1.0
**Created**: 2025-10-23
**Purpose**: Complete guide for backend agent to implement RBAC menu system

---

## 📋 Overview

This guide contains all the documentation needed for the backend agent to implement the complete Menu-Permission Driven RBAC system that matches the frontend implementation.

**保留要求**: 用户登录验证逻辑已保留 (User login verification logic is preserved)

---

## 📚 Documentation Files

### 1. Database Schema Guide

**File**: `BACKEND_DATABASE_SCHEMA_GUIDE.md`

**Contents**:
- Complete table schemas for all 8 core tables
- Detailed field descriptions and constraints
- Database migration script for adding new fields
- Application-layer relationship documentation
- RBAC architecture explanation
- Internationalization strategy
- Query examples
- Data integrity rules

**Key Tables**:
- `users` - User accounts
- `roles` - Role definitions
- `permissions` - Permission definitions (PAGE/API/BUTTON types)
- `menu_groups` - Menu grouping
- `menus` - Menu items (tree structure with i18n support)
- `menu_permissions` - Menu-permission associations
- `user_roles` - User-role associations
- `role_permissions` - Role-permission associations

**New Fields Added**:
- `menu_groups.i18n_key` - Translation key for frontend
- `menu_groups.icon` - Icon identifier
- `menu_groups.description` - Group description
- `menus.i18n_key` - Translation key for frontend
- `menus.badge` - Badge text
- `menus.redirect` - Redirect path
- `menus.hidden_in_breadcrumb` - Hide from breadcrumb
- `menus.always_show` - Always show even with single child
- `menus.meta` - JSONB metadata field

---

### 2. Seed Data File

**File**: `backend_seed_data.sql`

**Contents**:
- Complete INSERT statements for all tables
- 2 default users (admin, user)
- 4 default roles (ADMIN, USER_MANAGER, USER, GUEST)
- 45+ permissions covering all features
- 3 menu groups (General, System Management, Framework Demo)
- 20+ menu items with complete tree structure
- All necessary associations (menu-permissions, role-permissions, user-roles)
- Verification queries

**Data Structure**:
```
Menu Groups:
├── General (general)
│   └── Dashboard
├── System Management (system)
│   ├── User Management (directory)
│   │   ├── User List
│   │   ├── Role Management
│   │   └── Permission Management
│   ├── Menu Management (directory)
│   │   ├── Menu Groups
│   │   └── Menu Items
│   └── Settings
└── Framework Demo (demo)
    └── Examples (directory)
        ├── Auth Pages (directory)
        │   ├── Sign In
        │   ├── Sign Up
        │   └── Forgot Password
        └── Error Pages (directory)
            ├── Unauthorized (401)
            ├── Forbidden (403)
            ├── Not Found (404)
            └── Internal Error (500)
```

**Permission Types Distribution**:
- **PAGE** permissions: Route/page access (e.g., `dashboard:view`, `user:view`)
- **API** permissions: API endpoint access (e.g., `user:api`, `menu:api`)
- **BUTTON** permissions: UI actions (e.g., `user:create`, `role:assign-permissions`)

**Role Permissions Summary**:
- **ADMIN**: All 45+ permissions
- **USER_MANAGER**: Dashboard + User/Role/Permission management (15 permissions)
- **USER**: Dashboard only (1 permission)
- **GUEST**: Dashboard + Examples (2 permissions)

---

### 3. API Specification

**File**: `BACKEND_API_SPECIFICATION.md`

**Contents**:
- Complete API endpoint specifications
- Authentication requirements (JWT)
- Request/response formats with examples
- Error handling and status codes
- Permission checking middleware implementation
- Implementation logic with code examples

**Critical Endpoints**:

#### Authentication
- `POST /api/auth/login` - User login (returns JWT + user + roles + permissions)

#### Menu Endpoints (Most Important)
- `GET /api/menus/sidebar` ⭐ **CRITICAL** - User sidebar menu with permission filtering
- `GET /api/menus/top` - Top navigation menu
- `GET /api/menus` - List all menus (admin)
- `GET /api/menus/:id` - Get single menu
- `POST /api/menus` - Create menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu
- `POST /api/menus/:id/permissions` - Assign permissions to menu

#### Role Management
- `GET /api/roles` - List roles
- `GET /api/roles/:id` - Get role with permissions
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role
- `POST /api/roles/:id/permissions` - Assign permissions to role

#### Permission Management
- `GET /api/permissions` - List permissions
- `POST /api/permissions` - Create permission

#### User Management
- `GET /api/users` - List users
- `POST /api/users/:id/roles` - Assign roles to user

---

## 🎯 Implementation Priority

### Phase 1: Core Infrastructure (Day 1)
1. Apply database migration (`BACKEND_DATABASE_SCHEMA_GUIDE.md`)
2. Insert seed data (`backend_seed_data.sql`)
3. Implement JWT authentication middleware
4. Implement permission checking middleware

### Phase 2: Critical APIs (Day 2)
1. `POST /api/auth/login` - Must return user + roles + permissions
2. `GET /api/menus/sidebar` ⭐ **MOST CRITICAL** - Frontend depends on this
3. Implement permission filtering logic
4. Implement menu tree building logic

### Phase 3: Management APIs (Day 3-4)
1. Role management endpoints
2. Permission management endpoints
3. User management endpoints
4. Menu CRUD endpoints

### Phase 4: Testing & Validation (Day 5)
1. Test all endpoints with different user roles
2. Verify permission filtering works correctly
3. Test menu tree structure
4. Verify i18n keys are included in responses

---

## 🔑 Key Implementation Details

### 1. Permission Filtering Algorithm

**Critical for `/api/menus/sidebar` endpoint**:

```typescript
function filterMenusByPermissions(
  menus: Menu[],
  userPermissions: Permission[]
): Menu[] {
  return menus.filter(menu => {
    // No permissions required = accessible to all authenticated users
    if (!menu.permissions || menu.permissions.length === 0) {
      return true
    }

    // User must have ALL required permissions (AND logic)
    return menu.permissions.every(requiredPerm =>
      userPermissions.some(userPerm => userPerm.id === requiredPerm.id)
    )
  })
}
```

### 2. Menu Tree Building

**Converts flat menu list to hierarchical tree**:

```typescript
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

### 3. Response Format for `/api/menus/sidebar`

**Must match this exact structure**:

```typescript
interface SidebarMenuResponse {
  menuGroups: Array<{
    id: string
    name: string              // English name
    code: string
    i18nKey?: string | null   // Translation key (e.g., "nav.general")
    icon?: string
    description?: string
    sortOrder: number
    menus: Menu[]             // Tree structure with children
  }>
}

interface Menu {
  id: string
  parentId: string | null
  menuGroupId: string | null
  name: string
  title: string
  i18nKey?: string | null     // IMPORTANT: Must be included!
  path?: string
  component?: string
  redirect?: string
  icon?: string
  badge?: string              // NEW field
  sortOrder: number
  menuType: 'directory' | 'menu' | 'button'
  visible: boolean
  isActive: boolean
  keepAlive: boolean
  isExternal: boolean
  hiddenInBreadcrumb?: boolean  // NEW field
  alwaysShow?: boolean          // NEW field
  remark?: string
  meta?: any                    // NEW field (JSONB)
  permissions: Array<{
    id: string
    code: string
    name: string
    type: 'page' | 'api' | 'button'
  }>
  children?: Menu[]           // Nested children
}
```

### 4. JWT Token Payload

**Must include**:

```typescript
interface JWTPayload {
  userId: string
  username: string
  email: string
  roles: string[]             // Role codes: ["ADMIN", "USER"]
  permissions: string[]       // Permission codes: ["user:view", "role:create"]
  exp: number
  iat: number
}
```

---

## ✅ Validation Checklist

### Database
- [ ] Migration script applied successfully
- [ ] All new fields added (i18n_key, badge, redirect, etc.)
- [ ] Check constraints added (menu_type, permission.type)
- [ ] Unique constraints added
- [ ] Seed data inserted successfully
- [ ] Verification queries pass

### Authentication
- [ ] Login endpoint returns JWT token
- [ ] JWT includes user, roles, and permissions
- [ ] Token expiration configured (default: 1 hour)
- [ ] Refresh token mechanism implemented
- [ ] Password hashing uses bcrypt/argon2

### Menu API
- [ ] `/api/menus/sidebar` returns correct structure
- [ ] i18nKey field included in all menu groups and menus
- [ ] Menu tree structure correct (parent-child relationships)
- [ ] Permission filtering works (users only see allowed menus)
- [ ] Empty permission list = visible to all authenticated users
- [ ] Menus with multiple permissions require ALL (AND logic)
- [ ] Soft-deleted menus excluded
- [ ] Inactive menus excluded
- [ ] Hidden menus (visible=false) excluded

### Permission Checking
- [ ] All protected endpoints check permissions
- [ ] 403 Forbidden returned when permission missing
- [ ] Error response includes required permission
- [ ] User's effective permissions = UNION of all role permissions

### Response Format
- [ ] All responses follow standard format (success, data, message, timestamp)
- [ ] Error responses include code, message, details
- [ ] HTTP status codes used correctly
- [ ] Pagination included where applicable

---

## 🐛 Common Issues & Solutions

### Issue 1: Menus not appearing for user

**Symptoms**: User sees empty sidebar or fewer menus than expected

**Debug Steps**:
1. Check user's roles: `SELECT * FROM user_roles WHERE user_id = ?`
2. Check role's permissions: `SELECT * FROM role_permissions WHERE role_id = ?`
3. Check menu's required permissions: `SELECT * FROM menu_permissions WHERE menu_id = ?`
4. Verify permission filtering logic uses AND (not OR)

**Solution**: Ensure user has ALL permissions required by the menu

### Issue 2: Menu tree structure incorrect

**Symptoms**: Flat list instead of tree, or missing children

**Debug Steps**:
1. Check `parent_id` values in database
2. Verify no circular references
3. Check if parent menu is active and visible

**Solution**: Use the provided `buildMenuTree` function correctly

### Issue 3: i18nKey not in response

**Symptoms**: Frontend shows English text, translations not working

**Debug Steps**:
1. Check if database fields have i18nKey values
2. Verify SELECT query includes i18nKey column
3. Check response serialization

**Solution**: Explicitly include i18nKey in SELECT and response DTO

### Issue 4: 403 Forbidden on all menu endpoints

**Symptoms**: User cannot access menu management

**Debug Steps**:
1. Check if user has `menu:view` or `menu:manage` permission
2. Verify permission checking middleware is correct
3. Check JWT token includes permissions

**Solution**: Assign appropriate permissions to user's role

---

## 📊 Testing Scenarios

### Scenario 1: Admin User

**Expected**: Sees all menus (3 groups, 20+ items)

**Test**:
```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  http://localhost:3000/api/menus/sidebar
```

**Expected Groups**:
- General (Dashboard)
- System Management (Users, Roles, Permissions, Menus, Settings)
- Framework Demo (Examples)

### Scenario 2: Regular User

**Expected**: Sees only Dashboard

**Test**:
```bash
curl -H "Authorization: Bearer <USER_TOKEN>" \
  http://localhost:3000/api/menus/sidebar
```

**Expected Groups**:
- General (Dashboard only)

### Scenario 3: User Manager

**Expected**: Dashboard + User/Role/Permission management

**Expected Groups**:
- General (Dashboard)
- System Management (Users, Roles, Permissions only)

### Scenario 4: Guest User

**Expected**: Dashboard + Examples

**Expected Groups**:
- General (Dashboard)
- Framework Demo (Examples)

---

## 🔗 Frontend Integration

The frontend is **already implemented** and waiting for these backend endpoints:

### Frontend Dependencies

**File**: `src/components/layout/app-sidebar.tsx:42-48`
```typescript
const { data: menuData, isLoading } = useQuery({
  queryKey: ['sidebar-menu', user?.id],
  queryFn: menuService.getSidebarMenu,  // Calls GET /api/menus/sidebar
  enabled: !!user,
  staleTime: 5 * 60 * 1000,
})
```

**File**: `src/services/menu-service.ts`
```typescript
export const menuService = {
  async getSidebarMenu(): Promise<SidebarMenuResponse> {
    const response = await apiClient.get<ApiResponse<SidebarMenuResponse>>(
      '/menus/sidebar'
    )
    return response.data.data
  }
}
```

### What Frontend Expects

1. **Endpoint**: `GET /api/menus/sidebar`
2. **Authentication**: JWT token in Authorization header
3. **Response Structure**: Exactly as specified in `BACKEND_API_SPECIFICATION.md`
4. **Required Fields**: All fields including i18nKey, badge, hiddenInBreadcrumb, alwaysShow, meta
5. **Permission Filtering**: Backend must filter menus based on user permissions
6. **Tree Structure**: Menus must include children array

### Frontend Features Ready

- ✅ Internationalization (zh-CN, en-US)
- ✅ Translation utilities (`getMenuTitle`, `getMenuGroupName`)
- ✅ Permission filtering UI
- ✅ Menu tree rendering
- ✅ Loading states
- ✅ Error handling
- ✅ Graceful fallback to static data

---

## 🚀 Quick Start for Backend Agent

### Step 1: Database Setup
```bash
# Apply migration
psql -U postgres -d zoranms < BACKEND_DATABASE_SCHEMA_GUIDE.md # (extract SQL from migration section)

# Insert seed data
psql -U postgres -d zoranms < backend_seed_data.sql
```

### Step 2: Implement Core Endpoints

**Priority Order**:
1. `POST /api/auth/login` - Authentication
2. `GET /api/menus/sidebar` - Sidebar menu (CRITICAL!)
3. Other endpoints as needed

### Step 3: Test with Frontend

```bash
# Start backend
npm run dev  # or your backend start command

# Start frontend (in another terminal)
cd frontend
npm run dev

# Login and verify menus appear correctly
```

### Step 4: Verify

- [ ] Login works
- [ ] Menus appear in sidebar
- [ ] Menus are in correct groups
- [ ] Tree structure correct
- [ ] Internationalization works (switch language)
- [ ] Different users see different menus

---

## 📖 Additional Resources

### Database Design Principles

1. **No Foreign Keys**: All relationships managed in application layer
2. **Soft Deletion**: Use `deleted_at` timestamp, never hard delete
3. **Audit Trail**: Include created_at, updated_at, created_by, updated_by
4. **i18n Strategy**: Keep original English, add i18n_key for translations

### Permission Architecture

1. **Three Types**: PAGE (routes), API (endpoints), BUTTON (actions)
2. **Code Format**: `{resource}:{action}` (e.g., `user:view`)
3. **AND Logic**: Menu requires ALL associated permissions
4. **OR Logic**: User permissions = UNION of all role permissions

### Menu Structure

1. **Three Types**: directory (container), menu (page), button (action)
2. **Tree Structure**: Use parent_id for hierarchy
3. **Flexible Metadata**: Use JSONB meta field for custom properties
4. **i18n Support**: Include i18nKey for all user-facing text

---

## 📝 Notes for Backend Agent

### Important Requirements

1. **用户登录验证逻辑保留** (User login verification logic is preserved)
   - Keep existing authentication flow
   - Add JWT token generation
   - Include roles and permissions in token

2. **Permission Filtering is Critical**
   - Must filter menus on backend (not frontend)
   - Security requirement: never expose unauthorized menus
   - Use the provided filtering algorithm

3. **i18nKey Must Be Included**
   - Frontend depends on i18nKey for translations
   - Include in all menu and menu group responses
   - NULL values are acceptable (will fallback to English)

4. **Response Format Must Match Exactly**
   - Frontend expects specific structure
   - Missing fields will cause TypeScript errors
   - Extra fields are acceptable

5. **Tree Structure is Required**
   - Menus must include children array
   - Empty children array for leaf nodes
   - Use the provided buildMenuTree function

---

## 🎯 Success Criteria

### Backend is Complete When:

- [x] All documentation reviewed
- [ ] Database migration applied
- [ ] Seed data inserted
- [ ] All critical endpoints implemented
- [ ] Authentication returns JWT with roles and permissions
- [ ] `/api/menus/sidebar` returns correct tree structure
- [ ] Permission filtering works correctly
- [ ] Different users see different menus based on permissions
- [ ] Frontend can login and see menus
- [ ] Internationalization works (menus show in selected language)
- [ ] All tests pass

---

**Document Version**: 1.0
**Created**: 2025-10-23
**For**: Backend Agent Implementation
**Status**: Ready for Implementation

**Related Files**:
- `BACKEND_DATABASE_SCHEMA_GUIDE.md` - Database structure
- `backend_seed_data.sql` - Seed data
- `BACKEND_API_SPECIFICATION.md` - API specification
- `FINAL_IMPLEMENTATION_SUMMARY.md` - Frontend implementation reference
