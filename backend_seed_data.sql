-- ========================================
-- Backend Seed Data for ZoranMS RBAC System
-- ========================================
-- Version: 2.0
-- Last Updated: 2025-10-23
-- Purpose: Complete seed data matching frontend mock structure
--
-- IMPORTANT:
-- - All UUIDs are example values - regenerate if needed
-- - Passwords are hashed with bcrypt (example: 'password123')
-- - Data matches frontend mock structure in src/mocks/data/menus.ts
-- - All timestamps use CURRENT_TIMESTAMP
-- ========================================

-- Clean up existing data (optional - comment out if appending)
-- TRUNCATE TABLE menu_permissions, user_roles, role_permissions, menus, menu_groups, permissions, roles, users CASCADE;

BEGIN;

-- ========================================
-- 1. USERS
-- ========================================

INSERT INTO users (id, username, email, password_hash, display_name, avatar, is_active, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'admin@zoranms.com', '$2b$10$YourHashedPasswordHere', 'System Administrator', '/avatars/admin.png', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('00000000-0000-0000-0000-000000000002', 'user', 'user@zoranms.com', '$2b$10$YourHashedPasswordHere', 'Regular User', '/avatars/user.png', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ========================================
-- 2. ROLES
-- ========================================

INSERT INTO roles (id, name, code, description, is_active, is_system, created_at, updated_at, created_by) VALUES
('10000000-0000-0000-0000-000000000001', 'System Administrator', 'ADMIN', 'Full system access with all permissions', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000002', 'User Manager', 'USER_MANAGER', 'Manage users, roles, and permissions', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000003', 'Regular User', 'USER', 'Basic user access', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('10000000-0000-0000-0000-000000000004', 'Guest', 'GUEST', 'Read-only access', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- ========================================
-- 3. MENU GROUPS
-- ========================================

INSERT INTO menu_groups (id, name, code, i18n_key, icon, description, sort_order, is_active, created_at, updated_at, created_by) VALUES
('20000000-0000-0000-0000-000000000001', 'General', 'general', 'nav.general', 'layers', 'General features and common functions', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002', 'System Management', 'system', 'nav.system', 'settings', 'System administration and configuration', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000003', 'Framework Demo', 'demo', 'nav.frameworkDemo', 'code', 'Framework features and examples', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- ========================================
-- 4. PERMISSIONS
-- ========================================

-- Dashboard Permissions
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000001', 'View Dashboard', 'dashboard:view', 'page', 'dashboard', 'view', 'Access dashboard page', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000002', 'Dashboard API', 'dashboard:api', 'api', 'dashboard', 'api', 'Access dashboard API endpoints', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- User Management Permissions
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000010', 'View Users', 'user:view', 'page', 'user', 'view', 'View user list page', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000011', 'Create User', 'user:create', 'button', 'user', 'create', 'Create new user', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000012', 'Update User', 'user:update', 'button', 'user', 'update', 'Update user information', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000013', 'Delete User', 'user:delete', 'button', 'user', 'delete', 'Delete user account', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000014', 'User API', 'user:api', 'api', 'user', 'api', 'Access user API endpoints', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Role Management Permissions
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000020', 'View Roles', 'role:view', 'page', 'role', 'view', 'View role list page', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000021', 'Create Role', 'role:create', 'button', 'role', 'create', 'Create new role', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000022', 'Update Role', 'role:update', 'button', 'role', 'update', 'Update role information', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000023', 'Delete Role', 'role:delete', 'button', 'role', 'delete', 'Delete role', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000024', 'Assign Permissions', 'role:assign-permissions', 'button', 'role', 'assign-permissions', 'Assign permissions to role', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000025', 'Role API', 'role:api', 'api', 'role', 'api', 'Access role API endpoints', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Permission Management Permissions
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000030', 'View Permissions', 'permission:view', 'page', 'permission', 'view', 'View permission list page', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000031', 'Create Permission', 'permission:create', 'button', 'permission', 'create', 'Create new permission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000032', 'Update Permission', 'permission:update', 'button', 'permission', 'update', 'Update permission information', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000033', 'Delete Permission', 'permission:delete', 'button', 'permission', 'delete', 'Delete permission', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000034', 'Permission API', 'permission:api', 'api', 'permission', 'api', 'Access permission API endpoints', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Menu Management Permissions
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000040', 'View Menus', 'menu:view', 'page', 'menu', 'view', 'View menu management page', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000041', 'Manage Menus', 'menu:manage', 'button', 'menu', 'manage', 'Create, update, delete menus', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000042', 'Menu API', 'menu:api', 'api', 'menu', 'api', 'Access menu API endpoints', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- System Settings Permissions
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000050', 'View Settings', 'settings:view', 'page', 'settings', 'view', 'Access system settings', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000051', 'Update Settings', 'settings:update', 'button', 'settings', 'update', 'Modify system settings', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Example Pages Permissions (Framework Demo)
INSERT INTO permissions (id, name, code, type, resource, action, description, is_active, created_at, updated_at, created_by) VALUES
('30000000-0000-0000-0000-000000000060', 'View Examples', 'examples:view', 'page', 'examples', 'view', 'Access example pages', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- ========================================
-- 5. MENUS
-- ========================================

-- General Group Menus
INSERT INTO menus (id, parent_id, menu_group_id, name, title, i18n_key, path, component, icon, sort_order, menu_type, visible, is_active, keep_alive, is_external, hidden_in_breadcrumb, always_show, created_at, updated_at, created_by) VALUES
('40000000-0000-0000-0000-000000000001', NULL, '20000000-0000-0000-0000-000000000001', 'Dashboard', 'Dashboard', 'nav.dashboard', '/dashboard', 'views/dashboard/index', 'layout-dashboard', 1, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- System Management Group Menus
-- User Management (Directory with children)
INSERT INTO menus (id, parent_id, menu_group_id, name, title, i18n_key, path, component, icon, sort_order, menu_type, visible, is_active, keep_alive, is_external, hidden_in_breadcrumb, always_show, created_at, updated_at, created_by) VALUES
('40000000-0000-0000-0000-000000000010', NULL, '20000000-0000-0000-0000-000000000002', 'UserManagement', 'User Management', 'nav.userManagement', '/users', NULL, 'users', 1, 'directory', true, true, false, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000011', '40000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000002', 'UserList', 'User List', 'nav.users.list', '/users/list', 'views/users/list', 'users', 1, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000012', '40000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000002', 'RoleManagement', 'Role Management', 'nav.users.roles', '/users/roles', 'views/users/roles', 'shield', 2, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000013', '40000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000002', 'PermissionManagement', 'Permission Management', 'nav.users.permissions', '/users/permissions', 'views/users/permissions', 'lock', 3, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Menu Management
INSERT INTO menus (id, parent_id, menu_group_id, name, title, i18n_key, path, component, icon, sort_order, menu_type, visible, is_active, keep_alive, is_external, hidden_in_breadcrumb, always_show, created_at, updated_at, created_by) VALUES
('40000000-0000-0000-0000-000000000020', NULL, '20000000-0000-0000-0000-000000000002', 'MenuManagement', 'Menu Management', 'nav.menuManagement', '/menus', NULL, 'menu', 2, 'directory', true, true, false, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000021', '40000000-0000-0000-0000-000000000020', '20000000-0000-0000-0000-000000000002', 'MenuGroups', 'Menu Groups', 'nav.menuGroups', '/menus/groups', 'views/menus/groups', 'folder', 1, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000022', '40000000-0000-0000-0000-000000000020', '20000000-0000-0000-0000-000000000002', 'MenuItems', 'Menu Items', 'nav.menuItems', '/menus/items', 'views/menus/items', 'list', 2, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- System Settings
INSERT INTO menus (id, parent_id, menu_group_id, name, title, i18n_key, path, component, icon, sort_order, menu_type, visible, is_active, keep_alive, is_external, hidden_in_breadcrumb, always_show, created_at, updated_at, created_by) VALUES
('40000000-0000-0000-0000-000000000030', NULL, '20000000-0000-0000-0000-000000000002', 'Settings', 'System Settings', 'nav.settings', '/settings', 'views/settings/index', 'settings', 3, 'menu', true, true, true, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Framework Demo Group Menus
-- Examples (Directory with children)
INSERT INTO menus (id, parent_id, menu_group_id, name, title, i18n_key, path, component, icon, sort_order, menu_type, visible, is_active, keep_alive, is_external, hidden_in_breadcrumb, always_show, created_at, updated_at, created_by) VALUES
('40000000-0000-0000-0000-000000000040', NULL, '20000000-0000-0000-0000-000000000003', 'Examples', 'Examples', 'nav.examples', '/examples', NULL, 'book-open', 1, 'directory', true, true, false, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000041', '40000000-0000-0000-0000-000000000040', '20000000-0000-0000-0000-000000000003', 'AuthPages', 'Authentication Pages', 'nav.authPages', '/examples/auth', NULL, 'shield-check', 1, 'directory', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000042', '40000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000003', 'SignIn', 'Sign In', 'nav.signIn', '/examples/auth/sign-in', 'views/examples/auth/sign-in', 'log-in', 1, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000043', '40000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000003', 'SignUp', 'Sign Up', 'nav.signUp', '/examples/auth/sign-up', 'views/examples/auth/sign-up', 'user-plus', 2, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000044', '40000000-0000-0000-0000-000000000041', '20000000-0000-0000-0000-000000000003', 'ForgotPassword', 'Forgot Password', 'nav.forgotPassword', '/examples/auth/forgot-password', 'views/examples/auth/forgot-password', 'key', 3, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000045', '40000000-0000-0000-0000-000000000040', '20000000-0000-0000-0000-000000000003', 'ErrorPages', 'Error Pages', 'nav.errorPages', '/examples/errors', NULL, 'alert-triangle', 2, 'directory', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000046', '40000000-0000-0000-0000-000000000045', '20000000-0000-0000-0000-000000000003', 'Unauthorized', 'Unauthorized (401)', 'nav.unauthorized', '/examples/errors/401', 'views/examples/errors/401', 'shield-x', 1, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000047', '40000000-0000-0000-0000-000000000045', '20000000-0000-0000-0000-000000000003', 'Forbidden', 'Forbidden (403)', 'nav.forbidden', '/examples/errors/403', 'views/examples/errors/403', 'ban', 2, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000048', '40000000-0000-0000-0000-000000000045', '20000000-0000-0000-0000-000000000003', 'NotFound', 'Not Found (404)', 'nav.notFound', '/examples/errors/404', 'views/examples/errors/404', 'file-question', 3, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000049', '40000000-0000-0000-0000-000000000045', '20000000-0000-0000-0000-000000000003', 'InternalError', 'Internal Server Error (500)', 'nav.internalServerError', '/examples/errors/500', 'views/examples/errors/500', 'server-crash', 4, 'menu', true, true, false, false, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- ========================================
-- 6. MENU PERMISSIONS
-- ========================================

-- Dashboard menu requires dashboard:view permission
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- User List requires user:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000010', '40000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000010', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Role Management requires role:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000020', '40000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000020', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Permission Management requires permission:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000030', '40000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000030', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Menu Groups requires menu:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000040', '40000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000040', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Menu Items requires menu:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000041', '40000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000040', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Settings requires settings:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000050', '40000000-0000-0000-0000-000000000030', '30000000-0000-0000-0000-000000000050', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Examples requires examples:view
INSERT INTO menu_permissions (id, menu_id, permission_id, created_at, created_by) VALUES
('50000000-0000-0000-0000-000000000060', '40000000-0000-0000-0000-000000000040', '30000000-0000-0000-0000-000000000060', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- ========================================
-- 7. ROLE PERMISSIONS
-- ========================================

-- ADMIN role - ALL permissions
INSERT INTO role_permissions (id, role_id, permission_id, assigned_at, assigned_by)
SELECT
    gen_random_uuid(),
    '10000000-0000-0000-0000-000000000001',
    p.id,
    CURRENT_TIMESTAMP,
    '00000000-0000-0000-0000-000000000001'
FROM permissions p
WHERE p.deleted_at IS NULL;

-- USER_MANAGER role - User, Role, Permission management
INSERT INTO role_permissions (id, role_id, permission_id, assigned_at, assigned_by) VALUES
('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- dashboard:view
('60000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000010', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- user:view
('60000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000011', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- user:create
('60000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000012', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- user:update
('60000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000013', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- user:delete
('60000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000020', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- role:view
('60000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000021', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- role:create
('60000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000022', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- role:update
('60000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000023', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- role:delete
('60000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000024', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- role:assign-permissions
('60000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000030', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- permission:view
('60000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000031', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- permission:create
('60000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000032', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- permission:update
('60000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000033', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'); -- permission:delete

-- USER role - Basic access (Dashboard only)
INSERT INTO role_permissions (id, role_id, permission_id, assigned_at, assigned_by) VALUES
('60000000-0000-0000-0000-000000000100', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'); -- dashboard:view

-- GUEST role - Dashboard + Examples (read-only)
INSERT INTO role_permissions (id, role_id, permission_id, assigned_at, assigned_by) VALUES
('60000000-0000-0000-0000-000000000200', '10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'), -- dashboard:view
('60000000-0000-0000-0000-000000000201', '10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000060', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001'); -- examples:view

-- ========================================
-- 8. USER ROLES
-- ========================================

-- Admin user has ADMIN role
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by) VALUES
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

-- Regular user has USER role
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by) VALUES
('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP, '00000000-0000-0000-0000-000000000001');

COMMIT;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify data insertion
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles
UNION ALL
SELECT 'Permissions', COUNT(*) FROM permissions
UNION ALL
SELECT 'Menu Groups', COUNT(*) FROM menu_groups
UNION ALL
SELECT 'Menus', COUNT(*) FROM menus
UNION ALL
SELECT 'Menu Permissions', COUNT(*) FROM menu_permissions
UNION ALL
SELECT 'Role Permissions', COUNT(*) FROM role_permissions
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles;

-- ========================================
-- END OF SEED DATA
-- ========================================
