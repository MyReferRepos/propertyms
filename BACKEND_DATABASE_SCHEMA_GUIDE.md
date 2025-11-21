# Backend Database Schema Guide

**Version**: 2.0
**Last Updated**: 2025-10-23
**Purpose**: Complete database structure guidance for Menu-Permission Driven RBAC system

---

## 📋 Overview

This document provides comprehensive guidance for the backend database schema supporting a complete RBAC (Role-Based Access Control) system with dynamic menu management and internationalization support.

### Key Principles

1. **No Database Foreign Keys**: All relationships are managed at the application layer
2. **No Additional Indexes**: Performance indexes already exist in the database
3. **Internationalization**: Original fields remain in English, new `i18n_key` fields added for frontend i18n
4. **Soft Deletion**: All tables support soft deletion via `deleted_at` timestamp
5. **Audit Trails**: All tables include `created_at`, `updated_at`, `created_by`, `updated_by`

---

## 🗄️ Core Tables

### 1. users

**Purpose**: System user accounts

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT UQ_users_username UNIQUE (username),
    CONSTRAINT UQ_users_email UNIQUE (email)
);
```

**Fields**:
- `id`: Primary key (UUID)
- `username`: Unique username (50 chars max)
- `email`: Unique email address
- `password_hash`: Hashed password (bcrypt/argon2)
- `display_name`: User's display name
- `avatar`: URL to user avatar image
- `is_active`: Account activation status
- `last_login_at`: Last successful login timestamp
- `created_at`, `updated_at`: Audit timestamps
- `deleted_at`: Soft deletion timestamp

**Unique Constraints**:
- `username` must be unique
- `email` must be unique

---

### 2. roles

**Purpose**: User role definitions

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT UQ_roles_code UNIQUE (code)
);
```

**Fields**:
- `id`: Primary key (UUID)
- `name`: Role display name (e.g., "System Administrator")
- `code`: Role code for programmatic use (e.g., "ADMIN", "USER")
- `description`: Role description
- `is_active`: Whether role is currently active
- `is_system`: System role (cannot be deleted)
- `created_by`, `updated_by`: User IDs who created/updated
- `deleted_at`: Soft deletion timestamp

**Unique Constraints**:
- `code` must be unique

**Application-Layer Relationships**:
- `created_by` → `users.id`
- `updated_by` → `users.id`

---

### 3. permissions

**Purpose**: System permission definitions

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT UQ_permissions_code UNIQUE (code),
    CONSTRAINT CHK_permissions_type CHECK (type IN ('page', 'api', 'button'))
);
```

**Fields**:
- `id`: Primary key (UUID)
- `name`: Permission display name (e.g., "View Users")
- `code`: Permission code (e.g., "user:view")
- `type`: Permission type - **MUST BE** one of:
  - `'page'`: Route/page access permission
  - `'api'`: API endpoint permission
  - `'button'`: UI button/action permission
- `resource`: Resource name (e.g., "user", "role", "menu")
- `action`: Action name (e.g., "view", "create", "update", "delete")
- `description`: Permission description
- `is_active`: Whether permission is active
- `created_by`, `updated_by`: User IDs
- `deleted_at`: Soft deletion timestamp

**Unique Constraints**:
- `code` must be unique

**Check Constraints**:
- `type` must be one of: `'page'`, `'api'`, `'button'`

**Permission Code Format**:
```
{resource}:{action}
```
Examples:
- `user:view` - View user list
- `user:create` - Create new user
- `role:assign-permissions` - Assign permissions to role
- `menu:manage` - Manage menu items

**Application-Layer Relationships**:
- `created_by` → `users.id`
- `updated_by` → `users.id`

---

### 4. menu_groups

**Purpose**: Menu grouping/categorization

```sql
CREATE TABLE menu_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    i18n_key VARCHAR(100),
    icon VARCHAR(100),
    description VARCHAR(500),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT UQ_menu_groups_code UNIQUE (code)
);
```

**Fields**:
- `id`: Primary key (UUID)
- `name`: Group name in English (e.g., "General", "System Management")
- `code`: Group code (e.g., "general", "system")
- `i18n_key`: **NEW** - Translation key for frontend (e.g., "nav.general")
- `icon`: **NEW** - Icon identifier (e.g., "layers", "settings")
- `description`: **NEW** - Group description
- `sort_order`: Display order (ascending)
- `is_active`: Whether group is active
- `created_by`, `updated_by`: User IDs
- `deleted_at`: Soft deletion timestamp

**Unique Constraints**:
- `code` must be unique

**Internationalization**:
- `name`: Always in English, used as fallback
- `i18n_key`: Optional translation key (e.g., "nav.general" → "通用功能")

**Application-Layer Relationships**:
- `created_by` → `users.id`
- `updated_by` → `users.id`

---

### 5. menus

**Purpose**: Menu item definitions (supports tree structure)

```sql
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID,
    menu_group_id UUID,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    i18n_key VARCHAR(100),
    path VARCHAR(255),
    component VARCHAR(255),
    redirect VARCHAR(255),
    icon VARCHAR(100),
    badge VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0,
    menu_type VARCHAR(20) NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    keep_alive BOOLEAN NOT NULL DEFAULT false,
    is_external BOOLEAN NOT NULL DEFAULT false,
    hidden_in_breadcrumb BOOLEAN NOT NULL DEFAULT false,
    always_show BOOLEAN NOT NULL DEFAULT false,
    remark VARCHAR(500),
    meta JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP,
    CONSTRAINT CHK_menus_type CHECK (menu_type IN ('directory', 'menu', 'button'))
);

CREATE UNIQUE INDEX UQ_menus_name_active ON menus (name) WHERE deleted_at IS NULL;
```

**Fields**:

**Core Identifiers**:
- `id`: Primary key (UUID)
- `parent_id`: Parent menu ID for tree structure (NULL for root items)
- `menu_group_id`: Associated menu group ID (NULL allowed)
- `name`: Unique menu name (e.g., "Dashboard", "UserList")
- `title`: Display title in English (e.g., "Dashboard", "User List")

**Internationalization**:
- `i18n_key`: **NEW** - Translation key (e.g., "nav.dashboard", "nav.users.list")

**Routing**:
- `path`: Route path (e.g., "/dashboard", "/users/list")
- `component`: Component path (e.g., "views/dashboard/index")
- `redirect`: **NEW** - Redirect path for directory-type menus

**UI Configuration**:
- `icon`: Icon identifier (e.g., "layout-dashboard", "users")
- `badge`: **NEW** - Badge text (e.g., "New", "3")
- `sort_order`: Display order within parent (ascending)

**Menu Type**:
- `menu_type`: **MUST BE** one of:
  - `'directory'`: Container/folder (has children, no route)
  - `'menu'`: Page/route (actual page)
  - `'button'`: Action button (UI element, no route)

**Visibility & Behavior**:
- `visible`: Show/hide in navigation
- `is_active`: Whether menu is active
- `keep_alive`: Cache component state
- `is_external`: Opens external URL
- `hidden_in_breadcrumb`: **NEW** - Hide from breadcrumb trail
- `always_show`: **NEW** - Always show even with single child

**Metadata**:
- `remark`: Internal notes
- `meta`: **NEW** - JSONB field for flexible metadata
  ```json
  {
    "cache": true,
    "affix": false,
    "badge": { "type": "dot", "color": "red" },
    "activeMenu": "/dashboard"
  }
  ```

**Audit**:
- `created_at`, `updated_at`: Timestamps
- `created_by`, `updated_by`: User IDs
- `deleted_at`: Soft deletion timestamp

**Check Constraints**:
- `menu_type` must be one of: `'directory'`, `'menu'`, `'button'`

**Unique Constraints**:
- `name` must be unique among non-deleted records

**Application-Layer Relationships**:
- `parent_id` → `menus.id` (self-reference)
- `menu_group_id` → `menu_groups.id`
- `created_by` → `users.id`
- `updated_by` → `users.id`

**Tree Structure Rules**:
1. `parent_id = NULL`: Root level menu
2. `parent_id = <menu_id>`: Child of specified menu
3. `menu_type = 'directory'`: Can have children
4. `menu_type = 'menu'`: Can have children (tabs/sub-pages)
5. `menu_type = 'button'`: Should not have children

---

### 6. menu_permissions

**Purpose**: Association between menus and required permissions

```sql
CREATE TABLE menu_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    CONSTRAINT UQ_menu_permissions_menu_permission UNIQUE (menu_id, permission_id)
);
```

**Fields**:
- `id`: Primary key (UUID)
- `menu_id`: Menu ID
- `permission_id`: Permission ID
- `created_at`: Creation timestamp
- `created_by`: User ID who created association

**Unique Constraints**:
- Combination of `(menu_id, permission_id)` must be unique

**Application-Layer Relationships**:
- `menu_id` → `menus.id`
- `permission_id` → `permissions.id`
- `created_by` → `users.id`

**Business Logic**:
- One menu can have multiple permissions (AND logic)
- User must have ALL associated permissions to see/access the menu
- Empty permissions = visible to all authenticated users

---

### 7. user_roles

**Purpose**: Association between users and roles

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID,
    CONSTRAINT UQ_user_roles_user_role UNIQUE (user_id, role_id)
);
```

**Fields**:
- `id`: Primary key (UUID)
- `user_id`: User ID
- `role_id`: Role ID
- `assigned_at`: Assignment timestamp
- `assigned_by`: User ID who assigned the role

**Unique Constraints**:
- Combination of `(user_id, role_id)` must be unique

**Application-Layer Relationships**:
- `user_id` → `users.id`
- `role_id` → `roles.id`
- `assigned_by` → `users.id`

**Business Logic**:
- One user can have multiple roles
- User's effective permissions = UNION of all role permissions

---

### 8. role_permissions

**Purpose**: Association between roles and permissions

```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID,
    CONSTRAINT UQ_role_permissions_role_permission UNIQUE (role_id, permission_id)
);
```

**Fields**:
- `id`: Primary key (UUID)
- `role_id`: Role ID
- `permission_id`: Permission ID
- `assigned_at`: Assignment timestamp
- `assigned_by`: User ID who assigned the permission

**Unique Constraints**:
- Combination of `(role_id, permission_id)` must be unique

**Application-Layer Relationships**:
- `role_id` → `roles.id`
- `permission_id` → `permissions.id`
- `assigned_by` → `users.id`

**Business Logic**:
- One role can have multiple permissions
- Permissions define what actions users with this role can perform

---

## 🔄 Database Migration Script

Apply the following migration to add new fields to existing tables:

```sql
-- ========================================
-- Menu Groups Enhancements
-- ========================================

ALTER TABLE menu_groups ADD COLUMN IF NOT EXISTS i18n_key VARCHAR(100);
ALTER TABLE menu_groups ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE menu_groups ADD COLUMN IF NOT EXISTS description VARCHAR(500);

COMMENT ON COLUMN menu_groups.i18n_key IS 'Translation key for frontend i18n (e.g., nav.general)';
COMMENT ON COLUMN menu_groups.icon IS 'Icon identifier (e.g., layers, settings)';
COMMENT ON COLUMN menu_groups.description IS 'Group description';

-- Add unique constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_menu_groups_code'
    ) THEN
        ALTER TABLE menu_groups ADD CONSTRAINT UQ_menu_groups_code UNIQUE (code);
    END IF;
END $$;

-- ========================================
-- Menus Enhancements
-- ========================================

ALTER TABLE menus ADD COLUMN IF NOT EXISTS i18n_key VARCHAR(100);
ALTER TABLE menus ADD COLUMN IF NOT EXISTS badge VARCHAR(50);
ALTER TABLE menus ADD COLUMN IF NOT EXISTS redirect VARCHAR(255);
ALTER TABLE menus ADD COLUMN IF NOT EXISTS hidden_in_breadcrumb BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS always_show BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS meta JSONB;

COMMENT ON COLUMN menus.i18n_key IS 'Translation key for frontend i18n (e.g., nav.dashboard)';
COMMENT ON COLUMN menus.badge IS 'Badge text to display (e.g., New, 3)';
COMMENT ON COLUMN menus.redirect IS 'Redirect path for directory-type menus';
COMMENT ON COLUMN menus.hidden_in_breadcrumb IS 'Hide this menu from breadcrumb trail';
COMMENT ON COLUMN menus.always_show IS 'Always show even with single child';
COMMENT ON COLUMN menus.meta IS 'Flexible metadata as JSON (cache, affix, badge config, etc.)';

-- Update menu_type constraint if needed
ALTER TABLE menus DROP CONSTRAINT IF EXISTS chk_menus_type;
ALTER TABLE menus ADD CONSTRAINT CHK_menus_type CHECK (menu_type IN ('directory', 'menu', 'button'));

-- Add unique index for active menus
DROP INDEX IF EXISTS UQ_menus_name_active;
CREATE UNIQUE INDEX UQ_menus_name_active ON menus (name) WHERE deleted_at IS NULL;

-- ========================================
-- Menu Permissions Enhancements
-- ========================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_menu_permissions_menu_permission'
    ) THEN
        ALTER TABLE menu_permissions ADD CONSTRAINT UQ_menu_permissions_menu_permission
        UNIQUE (menu_id, permission_id);
    END IF;
END $$;

-- ========================================
-- Permissions Type Constraint
-- ========================================

ALTER TABLE permissions DROP CONSTRAINT IF EXISTS chk_permissions_type;
ALTER TABLE permissions ADD CONSTRAINT CHK_permissions_type CHECK (type IN ('page', 'api', 'button'));

COMMENT ON COLUMN permissions.type IS 'Permission type: page (route access), api (endpoint access), button (UI action)';
```

---

## 🔐 RBAC Architecture

### Permission Flow

```
User → UserRoles → Roles → RolePermissions → Permissions
                                               ↓
                                    MenuPermissions → Menus
```

### Permission Check Algorithm

```typescript
function hasAccess(user: User, menu: Menu): boolean {
  // 1. Get all user's roles
  const userRoles = getUserRoles(user.id)

  // 2. Get all permissions from all roles
  const userPermissions = userRoles.flatMap(role =>
    getRolePermissions(role.id)
  )

  // 3. Get required permissions for menu
  const menuPermissions = getMenuPermissions(menu.id)

  // 4. If no permissions required, allow access
  if (menuPermissions.length === 0) return true

  // 5. User must have ALL required permissions (AND logic)
  return menuPermissions.every(required =>
    userPermissions.some(user => user.id === required.id)
  )
}
```

### Permission Types

| Type | Purpose | Example | Frontend Check |
|------|---------|---------|----------------|
| `page` | Route/page access | `user:view` | Route guard |
| `api` | API endpoint | `user:create` | API middleware |
| `button` | UI action | `user:delete` | Component visibility |

---

## 🌍 Internationalization Strategy

### Field Usage

| Field | Language | Purpose | Example |
|-------|----------|---------|---------|
| `name` | English | Unique identifier & fallback | "Dashboard" |
| `title` | English | Default display text | "User Management" |
| `i18n_key` | N/A | Translation lookup key | "nav.users" |

### Frontend Translation Flow

```typescript
function getMenuTitle(menu: Menu, t: TranslateFn): string {
  if (menu.i18n_key) {
    // Try to translate using i18n key
    const translated = t(menu.i18n_key)
    if (translated !== menu.i18n_key) {
      return translated  // Translation found
    }
  }

  // Fallback to English title
  return menu.title
}
```

### Translation Key Naming Convention

```
nav.{group}               → Menu group
nav.{menu}                → Top-level menu
nav.{menu}.{submenu}      → Sub-menu
```

Examples:
- `nav.general` → "General" / "通用功能"
- `nav.dashboard` → "Dashboard" / "仪表盘"
- `nav.users` → "User Management" / "用户管理"
- `nav.users.list` → "User List" / "用户列表"
- `nav.users.roles` → "Role Management" / "角色管理"

---

## 📊 Entity Relationships

### Core Relationships (Application Layer)

```
users ←→ user_roles ←→ roles ←→ role_permissions ←→ permissions
                                                          ↑
menu_groups ←→ menus ←→ menu_permissions ─────────────────┘
                ↓
              menus (self-reference for tree structure)
```

### Relationship Rules

1. **Users ↔ Roles**: Many-to-Many via `user_roles`
   - One user can have multiple roles
   - One role can be assigned to multiple users

2. **Roles ↔ Permissions**: Many-to-Many via `role_permissions`
   - One role can have multiple permissions
   - One permission can belong to multiple roles

3. **Menus ↔ Permissions**: Many-to-Many via `menu_permissions`
   - One menu can require multiple permissions (AND logic)
   - One permission can be used by multiple menus

4. **Menus ↔ MenuGroups**: Many-to-One (application layer)
   - One menu belongs to zero or one group
   - One group contains multiple menus

5. **Menus ↔ Menus**: Self-referencing tree via `parent_id`
   - `parent_id = NULL`: Root level
   - `parent_id = <id>`: Child of specified menu

---

## 🔍 Query Examples

### Get User's Accessible Menus

```sql
WITH user_permissions AS (
  -- Get all permissions for a user
  SELECT DISTINCT p.id, p.code
  FROM permissions p
  INNER JOIN role_permissions rp ON p.id = rp.permission_id
  INNER JOIN user_roles ur ON rp.role_id = ur.role_id
  WHERE ur.user_id = :userId
    AND p.deleted_at IS NULL
)
SELECT DISTINCT
  mg.id AS group_id,
  mg.name AS group_name,
  mg.i18n_key AS group_i18n_key,
  mg.icon AS group_icon,
  mg.sort_order AS group_sort_order,
  m.id,
  m.parent_id,
  m.name,
  m.title,
  m.i18n_key,
  m.path,
  m.icon,
  m.badge,
  m.menu_type,
  m.visible,
  m.keep_alive,
  m.is_external,
  m.hidden_in_breadcrumb,
  m.always_show,
  m.sort_order,
  m.meta
FROM menus m
LEFT JOIN menu_groups mg ON m.menu_group_id = mg.id
LEFT JOIN menu_permissions mp ON m.id = mp.menu_id
LEFT JOIN permissions p ON mp.permission_id = p.id
WHERE m.is_active = true
  AND m.visible = true
  AND m.deleted_at IS NULL
  AND (mg.deleted_at IS NULL OR mg.id IS NULL)
  AND (
    -- No permissions required OR user has all required permissions
    NOT EXISTS (SELECT 1 FROM menu_permissions WHERE menu_id = m.id)
    OR NOT EXISTS (
      SELECT 1
      FROM menu_permissions mp2
      WHERE mp2.menu_id = m.id
        AND mp2.permission_id NOT IN (SELECT id FROM user_permissions)
    )
  )
ORDER BY
  mg.sort_order NULLS LAST,
  m.sort_order,
  m.id;
```

### Get Menu Tree with Permissions

```sql
SELECT
  m.id,
  m.parent_id,
  m.name,
  m.title,
  m.i18n_key,
  m.path,
  m.icon,
  m.badge,
  m.menu_type,
  m.sort_order,
  json_agg(
    json_build_object(
      'id', p.id,
      'code', p.code,
      'name', p.name,
      'type', p.type
    )
  ) FILTER (WHERE p.id IS NOT NULL) AS permissions
FROM menus m
LEFT JOIN menu_permissions mp ON m.id = mp.menu_id
LEFT JOIN permissions p ON mp.permission_id = p.id AND p.deleted_at IS NULL
WHERE m.deleted_at IS NULL
  AND m.is_active = true
GROUP BY m.id
ORDER BY m.sort_order;
```

---

## ✅ Data Integrity Rules

### Application-Layer Validation

1. **Menu Tree Integrity**:
   - Prevent circular references (parent_id cannot reference self or descendants)
   - Validate parent menu exists and is not deleted
   - Root menus must have `parent_id = NULL`

2. **Menu Type Rules**:
   - `directory`: Must have `path = NULL` or redirect path
   - `menu`: Must have valid `path` and `component`
   - `button`: Should not have `path`, must have associated permission

3. **Permission Code Format**:
   - Must follow `{resource}:{action}` pattern
   - Resource and action must be lowercase alphanumeric with hyphens
   - Examples: `user:view`, `role:assign-permissions`

4. **Role Assignment**:
   - Cannot delete role if assigned to users
   - System roles (`is_system = true`) cannot be deleted

5. **Soft Deletion Cascade**:
   - Deleting menu group: Archive all associated menus
   - Deleting menu: Archive all child menus
   - Deleting role: Remove all user-role associations
   - Deleting permission: Remove all role-permission and menu-permission associations

6. **i18n_key Validation**:
   - Must follow dot-notation pattern: `category.subcategory.item`
   - Should use lowercase with dots
   - Examples: `nav.general`, `nav.users.list`

---

## 🚀 Backend Implementation Checklist

### Database Setup
- [ ] Run migration script to add new fields
- [ ] Verify check constraints on `menu_type` and `permission.type`
- [ ] Verify unique constraints on `code` fields
- [ ] Insert seed data (see `backend_seed_data.sql`)

### API Endpoints
- [ ] Implement `GET /api/menus/sidebar` (user-specific menu tree)
- [ ] Implement `GET /api/menus/top` (top navigation)
- [ ] Add permission checking middleware
- [ ] Return menus with proper tree structure
- [ ] Include permission filtering logic

### Business Logic
- [ ] Implement permission checking algorithm
- [ ] Implement menu tree building
- [ ] Implement soft deletion handling
- [ ] Add i18n_key to all responses
- [ ] Include nested permissions in menu response

### Security
- [ ] Validate user authentication on all endpoints
- [ ] Filter menus based on user permissions
- [ ] Never expose menus user doesn't have access to
- [ ] Log permission denial attempts

---

## 📚 Related Documentation

- **Frontend Implementation**: `FINAL_IMPLEMENTATION_SUMMARY.md`
- **API Specification**: `BACKEND_API_SPECIFICATION.md`
- **Seed Data**: `backend_seed_data.sql`

---

**Document Version**: 2.0
**Last Updated**: 2025-10-23
**Maintained By**: Backend Development Team
