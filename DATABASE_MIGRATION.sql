-- =====================================================
-- 数据库迁移脚本 - 权限系统重构
-- 版本: 1.0.0
-- 创建日期: 2025-01-19
-- 说明: 添加权限类型字段，支持PAGE和ACTION两层权限模型
-- =====================================================

-- =====================================================
-- 步骤 1: 备份现有数据
-- =====================================================
PRINT '步骤 1: 备份现有数据...'

-- 创建备份表
SELECT * INTO Permissions_Backup_20250119
FROM Permissions;

SELECT * INTO MenuItems_Backup_20250119
FROM MenuItems;

PRINT '备份完成！'
GO

-- =====================================================
-- 步骤 2: 添加新字段到 Permissions 表
-- =====================================================
PRINT '步骤 2: 添加新字段到 Permissions 表...'

-- 添加 Type 字段 (权限类型: 'page' 或 'action')
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Permissions]')
    AND name = 'Type'
)
BEGIN
    ALTER TABLE Permissions
    ADD Type NVARCHAR(10) NOT NULL DEFAULT 'action';
    PRINT '添加 Type 字段成功'
END
ELSE
BEGIN
    PRINT 'Type 字段已存在，跳过'
END
GO

-- 添加 Action 字段 (操作类型: 仅ACTION类型有值)
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Permissions]')
    AND name = 'Action'
)
BEGIN
    ALTER TABLE Permissions
    ADD Action NVARCHAR(50) NULL;
    PRINT '添加 Action 字段成功'
END
ELSE
BEGIN
    PRINT 'Action 字段已存在，跳过'
END
GO

-- 添加 ParentCode 字段 (父权限代码: ACTION权限关联到PAGE权限)
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Permissions]')
    AND name = 'ParentCode'
)
BEGIN
    ALTER TABLE Permissions
    ADD ParentCode NVARCHAR(100) NULL;
    PRINT '添加 ParentCode 字段成功'
END
ELSE
BEGIN
    PRINT 'ParentCode 字段已存在，跳过'
END
GO

PRINT '步骤 2 完成！'
GO

-- =====================================================
-- 步骤 3: 创建索引
-- =====================================================
PRINT '步骤 3: 创建索引...'

-- Type 字段索引
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Permissions_Type' AND object_id = OBJECT_ID('Permissions'))
BEGIN
    CREATE INDEX IX_Permissions_Type ON Permissions(Type);
    PRINT '创建 Type 索引成功'
END
ELSE
BEGIN
    PRINT 'Type 索引已存在，跳过'
END
GO

-- Module 字段索引
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Permissions_Module' AND object_id = OBJECT_ID('Permissions'))
BEGIN
    CREATE INDEX IX_Permissions_Module ON Permissions(Module);
    PRINT '创建 Module 索引成功'
END
ELSE
BEGIN
    PRINT 'Module 索引已存在，跳过'
END
GO

-- ParentCode 字段索引
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Permissions_ParentCode' AND object_id = OBJECT_ID('Permissions'))
BEGIN
    CREATE INDEX IX_Permissions_ParentCode ON Permissions(ParentCode);
    PRINT '创建 ParentCode 索引成功'
END
ELSE
BEGIN
    PRINT 'ParentCode 索引已存在，跳过'
END
GO

PRINT '步骤 3 完成！'
GO

-- =====================================================
-- 步骤 4: 迁移现有权限数据
-- =====================================================
PRINT '步骤 4: 迁移现有权限数据...'

-- 更新现有权限的 Action 字段
-- 从 Code 中提取操作类型 (例如: "users:create" -> "create")
UPDATE Permissions
SET Action = CASE
    WHEN CHARINDEX(':', Code) > 0
    THEN SUBSTRING(Code, CHARINDEX(':', Code) + 1, LEN(Code))
    ELSE NULL
END
WHERE Type = 'action' AND Action IS NULL;

PRINT '现有权限数据迁移完成'
GO

-- =====================================================
-- 步骤 5: 确保 MenuItems 表有 PermissionCode 字段
-- =====================================================
PRINT '步骤 5: 确保 MenuItems 表有 PermissionCode 字段...'

IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[MenuItems]')
    AND name = 'PermissionCode'
)
BEGIN
    ALTER TABLE MenuItems
    ADD PermissionCode NVARCHAR(100) NULL;
    PRINT '添加 PermissionCode 字段成功'
END
ELSE
BEGIN
    PRINT 'PermissionCode 字段已存在，跳过'
END
GO

-- 创建 PermissionCode 索引
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_MenuItems_PermissionCode' AND object_id = OBJECT_ID('MenuItems'))
BEGIN
    CREATE INDEX IX_MenuItems_PermissionCode ON MenuItems(PermissionCode);
    PRINT '创建 PermissionCode 索引成功'
END
ELSE
BEGIN
    PRINT 'PermissionCode 索引已存在，跳过'
END
GO

PRINT '步骤 5 完成！'
GO

-- =====================================================
-- 步骤 6: 插入新的页面权限 (可选)
-- =====================================================
PRINT '步骤 6: 插入新的页面权限...'

-- 注意：这里只是示例，完整的权限数据请参考 permissions-complete.json

-- 用户模块页面权限
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:users')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'Users Page', 'page:users', 'page', 'users', 'Access to users list page', GETDATE(), GETDATE());
    PRINT '插入 page:users'
END

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:users-roles')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'Roles Page', 'page:users-roles', 'page', 'users', 'Access to roles management page', GETDATE(), GETDATE());
    PRINT '插入 page:users-roles'
END

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:users-permissions')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'Permissions Page', 'page:users-permissions', 'page', 'users', 'Access to permissions management page', GETDATE(), GETDATE());
    PRINT '插入 page:users-permissions'
END

-- 菜单模块页面权限
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:menu')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'Menu Management Page', 'page:menu', 'page', 'menu', 'Access to menu management page', GETDATE(), GETDATE());
    PRINT '插入 page:menu'
END

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:menu-groups')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'Menu Groups Page', 'page:menu-groups', 'page', 'menu', 'Access to menu groups management page', GETDATE(), GETDATE());
    PRINT '插入 page:menu-groups'
END

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:menu-items')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'Menu Items Page', 'page:menu-items', 'page', 'menu', 'Access to menu items management page', GETDATE(), GETDATE());
    PRINT '插入 page:menu-items'
END

-- 设置模块页面权限
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE Code = 'page:settings-general')
BEGIN
    INSERT INTO Permissions (Id, Name, Code, Type, Module, Description, CreatedAt, UpdatedAt)
    VALUES (NEWID(), 'General Settings Page', 'page:settings-general', 'page', 'settings', 'Access to general settings page', GETDATE(), GETDATE());
    PRINT '插入 page:settings-general'
END

PRINT '步骤 6 完成！'
GO

-- =====================================================
-- 步骤 7: 更新现有操作权限的 ParentCode
-- =====================================================
PRINT '步骤 7: 更新现有操作权限的 ParentCode...'

-- 用户模块操作权限
UPDATE Permissions SET ParentCode = 'page:users'
WHERE Code LIKE 'action:users:%' AND ParentCode IS NULL;

-- 角色模块操作权限
UPDATE Permissions SET ParentCode = 'page:users-roles'
WHERE Code LIKE 'action:roles:%' AND ParentCode IS NULL;

-- 权限模块操作权限
UPDATE Permissions SET ParentCode = 'page:users-permissions'
WHERE Code LIKE 'action:permissions:%' AND ParentCode IS NULL;

-- 菜单组操作权限
UPDATE Permissions SET ParentCode = 'page:menu-groups'
WHERE Code LIKE 'action:menu-groups:%' AND ParentCode IS NULL;

-- 菜单项操作权限
UPDATE Permissions SET ParentCode = 'page:menu-items'
WHERE Code LIKE 'action:menu-items:%' AND ParentCode IS NULL;

-- 设置模块操作权限
UPDATE Permissions SET ParentCode = 'page:settings-general'
WHERE Code LIKE 'action:settings:%' AND ParentCode IS NULL;

PRINT '步骤 7 完成！'
GO

-- =====================================================
-- 步骤 8: 验证数据完整性
-- =====================================================
PRINT '步骤 8: 验证数据完整性...'

-- 检查所有 ACTION 类型权限都有 Action 字段
DECLARE @ActionCount INT
SELECT @ActionCount = COUNT(*)
FROM Permissions
WHERE Type = 'action' AND (Action IS NULL OR Action = '')

IF @ActionCount > 0
BEGIN
    PRINT '警告: 存在 ' + CAST(@ActionCount AS VARCHAR) + ' 个 ACTION 类型权限缺少 Action 字段值'

    SELECT Id, Name, Code, Type, Action
    FROM Permissions
    WHERE Type = 'action' AND (Action IS NULL OR Action = '')
END
ELSE
BEGIN
    PRINT '✓ 所有 ACTION 类型权限都有 Action 字段值'
END

-- 检查所有 PAGE 类型权限没有 Action 字段
DECLARE @PageCount INT
SELECT @PageCount = COUNT(*)
FROM Permissions
WHERE Type = 'page' AND Action IS NOT NULL

IF @PageCount > 0
BEGIN
    PRINT '警告: 存在 ' + CAST(@PageCount AS VARCHAR) + ' 个 PAGE 类型权限有 Action 字段值（应该为NULL）'

    SELECT Id, Name, Code, Type, Action
    FROM Permissions
    WHERE Type = 'page' AND Action IS NOT NULL
END
ELSE
BEGIN
    PRINT '✓ 所有 PAGE 类型权限都没有 Action 字段值'
END

-- 统计权限数量
DECLARE @TotalPermissions INT, @PagePermissions INT, @ActionPermissions INT
SELECT @TotalPermissions = COUNT(*) FROM Permissions
SELECT @PagePermissions = COUNT(*) FROM Permissions WHERE Type = 'page'
SELECT @ActionPermissions = COUNT(*) FROM Permissions WHERE Type = 'action'

PRINT '权限统计:'
PRINT '  总权限数: ' + CAST(@TotalPermissions AS VARCHAR)
PRINT '  页面权限: ' + CAST(@PagePermissions AS VARCHAR)
PRINT '  操作权限: ' + CAST(@ActionPermissions AS VARCHAR)

PRINT '步骤 8 完成！'
GO

-- =====================================================
-- 步骤 9: 清理（可选）
-- =====================================================
-- 如果迁移成功且经过充分测试，可以删除备份表
-- DROP TABLE Permissions_Backup_20250119;
-- DROP TABLE MenuItems_Backup_20250119;

-- =====================================================
-- 迁移完成
-- =====================================================
PRINT ''
PRINT '========================================='
PRINT '数据库迁移完成！'
PRINT '========================================='
PRINT ''
PRINT '后续步骤:'
PRINT '1. 验证权限数据是否正确'
PRINT '2. 运行应用程序测试'
PRINT '3. 确认前端权限功能正常'
PRINT '4. 如果一切正常，可以删除备份表'
PRINT ''
GO
