-- ========================================
-- ZoranMS 菜单表结构优化 SQL
-- 版本: 3.0
-- 日期: 2025-10-23
-- 更新说明:
--   - 移除索引创建（数据库已有相关索引）
--   - 移除外键约束（在应用层控制关联关系）
--   - 保留原字段存储英文，新增i18n字段用于前端国际化
--   - 移除 menu_type 数据库约束，由后端枚举约定
--   - 添加所有可选功能字段
-- ========================================

-- ========================================
-- 1. 国际化字段新增
-- ========================================

-- menu_groups 表：新增 i18n_key 字段
ALTER TABLE menu_groups
  ADD COLUMN IF NOT EXISTS i18n_key VARCHAR(100);

COMMENT ON COLUMN menu_groups.name IS '菜单组名称（英文，用于后台管理）';
COMMENT ON COLUMN menu_groups.i18n_key IS '国际化翻译键（如: nav.system, nav.business）';

-- menus 表：新增 i18n_key 字段
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS i18n_key VARCHAR(100);

COMMENT ON COLUMN menus.title IS '菜单标题（英文，用于后台管理）';
COMMENT ON COLUMN menus.i18n_key IS '国际化翻译键（如: nav.dashboard, nav.users）';

-- ========================================
-- 2. 添加唯一性约束
-- ========================================

-- menu_groups: code必须唯一
ALTER TABLE menu_groups
  ADD CONSTRAINT UQ_menu_groups_code UNIQUE (code);

-- menus: name必须唯一（仅在有效数据中）
CREATE UNIQUE INDEX IF NOT EXISTS UQ_menus_name_active
  ON menus (name)
  WHERE deleted_at IS NULL;

-- menu_permissions: 防止重复关联
ALTER TABLE menu_permissions
  ADD CONSTRAINT UQ_menu_permissions_menu_permission
  UNIQUE (menu_id, permission_id);

-- ========================================
-- 3. 添加功能字段
-- ========================================

-- 路由重定向字段（用于目录默认跳转）
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS redirect VARCHAR(255);

COMMENT ON COLUMN menus.redirect IS '路由重定向路径（用于目录默认跳转到第一个子菜单）';

-- 面包屑控制
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS hidden_in_breadcrumb BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN menus.hidden_in_breadcrumb IS '是否在面包屑中隐藏';

-- 菜单显示控制
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS always_show BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN menus.always_show IS '是否总是显示（即使只有一个子菜单）';

-- 元数据字段（存储额外配置）
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS meta JSONB;

COMMENT ON COLUMN menus.meta IS '元数据（JSON格式），如: {"requiresAuth": true, "transition": "fade", "noCache": false}';

-- ========================================
-- 4. 完善字段注释
-- ========================================

-- menu_groups 表
COMMENT ON TABLE menu_groups IS '菜单组表';
COMMENT ON COLUMN menu_groups.id IS '主键UUID';
COMMENT ON COLUMN menu_groups.code IS '菜单组代码（唯一标识）';
COMMENT ON COLUMN menu_groups.sort_order IS '排序号（越小越靠前）';
COMMENT ON COLUMN menu_groups.is_active IS '是否激活';
COMMENT ON COLUMN menu_groups.description IS '描述';
COMMENT ON COLUMN menu_groups.icon IS '图标名称';
COMMENT ON COLUMN menu_groups.deleted_at IS '软删除时间';
COMMENT ON COLUMN menu_groups.created_at IS '创建时间';
COMMENT ON COLUMN menu_groups.updated_at IS '更新时间';

-- menus 表
COMMENT ON TABLE menus IS '菜单表';
COMMENT ON COLUMN menus.id IS '主键UUID';
COMMENT ON COLUMN menus.parent_id IS '父菜单ID（构建树形结构）';
COMMENT ON COLUMN menus.menu_group_id IS '所属菜单组ID';
COMMENT ON COLUMN menus.name IS '菜单名称（路由名称，唯一，英文）';
COMMENT ON COLUMN menus.path IS '路由路径';
COMMENT ON COLUMN menus.icon IS '图标名称';
COMMENT ON COLUMN menus.badge IS '徽章文本（可用于显示未读数等）';
COMMENT ON COLUMN menus.sort_order IS '排序号（越小越靠前）';
COMMENT ON COLUMN menus.is_active IS '是否激活';
COMMENT ON COLUMN menus.component IS '组件路径';
COMMENT ON COLUMN menus.deleted_at IS '软删除时间';
COMMENT ON COLUMN menus.is_external IS '是否外部链接';
COMMENT ON COLUMN menus.keep_alive IS '是否缓存组件（keep-alive）';
COMMENT ON COLUMN menus.menu_type IS '菜单类型（由后端枚举约定: directory-目录, menu-菜单, button-按钮权限等）';
COMMENT ON COLUMN menus.remark IS '备注';
COMMENT ON COLUMN menus.visible IS '是否在菜单中显示';
COMMENT ON COLUMN menus.created_at IS '创建时间';
COMMENT ON COLUMN menus.updated_at IS '更新时间';

-- menu_permissions 表
COMMENT ON TABLE menu_permissions IS '菜单权限关联表';
COMMENT ON COLUMN menu_permissions.id IS '主键UUID';
COMMENT ON COLUMN menu_permissions.menu_id IS '菜单ID';
COMMENT ON COLUMN menu_permissions.permission_id IS '权限ID';
COMMENT ON COLUMN menu_permissions.created_at IS '创建时间';

-- ========================================
-- 5. 数据迁移示例（可选）
-- ========================================

-- 如果需要将现有 name/title 数据迁移为 i18n_key 格式
-- 示例：将 "System Management" 转换为 "nav.system"

-- menu_groups 迁移示例
-- UPDATE menu_groups
-- SET i18n_key = 'nav.' || LOWER(REPLACE(code, '_', '.'))
-- WHERE i18n_key IS NULL;

-- menus 迁移示例
-- UPDATE menus
-- SET i18n_key = 'nav.' || LOWER(REPLACE(name, '_', '.'))
-- WHERE i18n_key IS NULL;

-- ========================================
-- 6. 验证查询（执行后检查）
-- ========================================

-- 检查唯一约束
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_name IN ('menu_groups', 'menus', 'menu_permissions')
ORDER BY tc.table_name, tc.constraint_name;

-- 检查字段是否添加成功
SELECT
  table_name,
  column_name,
  data_type,
  character_maximum_length,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('menu_groups', 'menus')
  AND column_name IN ('i18n_key', 'redirect', 'hidden_in_breadcrumb', 'always_show', 'meta')
ORDER BY table_name, ordinal_position;

-- 检查约束
SELECT
  tc.constraint_name,
  tc.constraint_type,
  tc.table_name,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name IN ('menu_groups', 'menus', 'menu_permissions')
ORDER BY tc.table_name, tc.constraint_type;

-- ========================================
-- 7. 示例数据（符合新结构）
-- ========================================

-- menu_groups 示例
/*
INSERT INTO menu_groups (code, name, i18n_key, icon, sort_order, is_active) VALUES
  ('system', 'System Management', 'nav.system', 'settings', 0, true),
  ('business', 'Business Operations', 'nav.business', 'briefcase', 1, true);
*/

-- menus 示例
/*
INSERT INTO menus (
  name, title, i18n_key, path, icon,
  menu_type, menu_group_id, sort_order, is_active, visible,
  redirect, hidden_in_breadcrumb, always_show
) VALUES
  -- 目录（directory）
  ('user-management', 'User Management', 'nav.users', '/users', 'users',
   'directory', NULL, 1, true, true, '/users/list', false, false),

  -- 菜单（menu）
  ('dashboard', 'Dashboard', 'nav.dashboard', '/dashboard', 'home',
   'menu', NULL, 0, true, true, NULL, false, false),
  ('user-list', 'User List', 'nav.users.list', '/users/list', 'list',
   'menu', '...', 0, true, true, NULL, false, false),

  -- 按钮权限（button）
  ('user-create', 'Create User', 'nav.users.create', '', 'plus',
   'button', '...', 0, true, false, NULL, false, false),
  ('user-delete', 'Delete User', 'nav.users.delete', '', 'trash',
   'button', '...', 1, true, false, NULL, false, false);
*/

-- ========================================
-- 8. 前端使用说明
-- ========================================

/*
后端API应返回完整的菜单数据，包括 i18n_key 字段：

{
  "id": "uuid",
  "name": "dashboard",
  "title": "Dashboard",
  "i18n_key": "nav.dashboard",
  "path": "/dashboard",
  "icon": "home",
  "menu_type": "menu",
  "redirect": null,
  "hidden_in_breadcrumb": false,
  "always_show": false,
  "meta": null
}

前端使用方式：

import { useI18n } from '@/lib/i18n'
import { getMenuTitle, getMenuTypeLabel } from '@/lib/menu-utils'

function MenuItem({ menu }) {
  const { t } = useI18n()

  // 优先使用 i18n_key，如果没有则降级使用 title
  const displayTitle = getMenuTitle(menu, t)
  const typeLabel = getMenuTypeLabel(menu.menu_type, t)

  return (
    <div>
      <span>{displayTitle}</span>
      <span>{typeLabel}</span>
    </div>
  )
}
*/

-- ========================================
-- 说明
-- ========================================
-- 1. 执行前请备份数据库
-- 2. menu_type 的取值由后端枚举约定（如: directory, menu, button）
-- 3. 前端需要在 i18n 配置中为 menu_type 的各个值准备翻译
-- 4. 第5部分的数据迁移示例需要根据实际数据调整
-- 5. 执行后使用第6部分的验证查询检查结果
-- 6. 第7部分的示例数据仅供参考，实际使用时需要替换 menu_group_id 为真实UUID
