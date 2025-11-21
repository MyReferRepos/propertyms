# 后端API更新文档 - 权限系统重构

## 📋 概述

本文档描述了权限系统重构所需的后端API更新，包括数据库schema变更、API接口调整和新增接口。

---

## 1. 数据库Schema变更

### 1.1 Permission表更新

**表名**: `Permissions`

**变更说明**: 添加新字段以支持双层权限模型（页面权限+操作权限）

```sql
-- 添加新字段
ALTER TABLE Permissions
ADD Type NVARCHAR(10) NOT NULL DEFAULT 'action',  -- 权限类型: 'page' 或 'action'
ADD Action NVARCHAR(50) NULL,                     -- 操作类型: 仅ACTION类型有值
ADD ParentCode NVARCHAR(100) NULL;                -- 父权限代码: ACTION权限关联到PAGE权限

-- 添加索引
CREATE INDEX IX_Permissions_Type ON Permissions(Type);
CREATE INDEX IX_Permissions_Module ON Permissions(Module);
CREATE INDEX IX_Permissions_ParentCode ON Permissions(ParentCode);

-- 添加外键约束（可选）
ALTER TABLE Permissions
ADD CONSTRAINT FK_Permissions_ParentCode
FOREIGN KEY (ParentCode) REFERENCES Permissions(Code)
ON DELETE NO ACTION;
```

**完整表结构**:

```sql
CREATE TABLE Permissions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,                  -- 显示名称
    Code NVARCHAR(100) NOT NULL UNIQUE,           -- 权限代码
    Type NVARCHAR(10) NOT NULL DEFAULT 'action',  -- 权限类型: 'page' | 'action'
    Module NVARCHAR(50) NOT NULL,                 -- 所属模块
    Action NVARCHAR(50) NULL,                     -- 操作类型 (仅action类型)
    ParentCode NVARCHAR(100) NULL,                -- 父权限代码
    Description NVARCHAR(500) NULL,               -- 权限描述
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

### 1.2 MenuItem表更新

**表名**: `MenuItems`

**变更说明**: 确保 `PermissionCode` 字段存在并正确配置

```sql
-- 如果字段不存在，添加
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MenuItems]') AND name = 'PermissionCode')
BEGIN
    ALTER TABLE MenuItems
    ADD PermissionCode NVARCHAR(100) NULL;
END

-- 添加索引
CREATE INDEX IX_MenuItems_PermissionCode ON MenuItems(PermissionCode);

-- 添加外键约束（可选）
ALTER TABLE MenuItems
ADD CONSTRAINT FK_MenuItems_PermissionCode
FOREIGN KEY (PermissionCode) REFERENCES Permissions(Code)
ON DELETE SET NULL;
```

---

## 2. Permission API 接口更新

### 2.1 获取权限列表

**接口**: `GET /api/permissions`

**变更**: 响应体增加新字段

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "guid-1",
      "name": "用户列表页面",
      "code": "page:users",
      "type": "page",          // 新增
      "module": "users",
      "action": null,          // 新增
      "parentCode": null,      // 新增
      "description": "访问用户列表页面",
      "createdAt": "2025-01-19T10:00:00Z",
      "updatedAt": "2025-01-19T10:00:00Z"
    },
    {
      "id": "guid-2",
      "name": "创建用户",
      "code": "action:users:create",
      "type": "action",        // 新增
      "module": "users",
      "action": "create",      // 新增
      "parentCode": "page:users", // 新增
      "description": "创建新用户",
      "createdAt": "2025-01-19T10:00:00Z",
      "updatedAt": "2025-01-19T10:00:00Z"
    }
  ],
  "message": null
}
```

### 2.2 创建权限

**接口**: `POST /api/permissions`

**变更**: 请求体增加新字段

**请求体**:

```json
{
  "name": "创建用户",
  "code": "action:users:create",
  "type": "action",           // 新增 (必填): "page" | "action"
  "module": "users",
  "action": "create",         // 新增 (可选): 仅action类型需要
  "parentCode": "page:users", // 新增 (可选): 关联父权限
  "description": "创建新用户"
}
```

**C# DTO 示例**:

```csharp
public class CreatePermissionRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    [StringLength(100)]
    [RegularExpression(@"^(page|action):[a-z][a-z0-9-]+(:[a-z][a-z0-9-]+)?$")]
    public string Code { get; set; }

    [Required]
    [RegularExpression(@"^(page|action)$")]
    public string Type { get; set; }  // "page" | "action"

    [Required]
    [StringLength(50)]
    public string Module { get; set; }

    [StringLength(50)]
    public string Action { get; set; }  // 仅action类型需要

    [StringLength(100)]
    public string ParentCode { get; set; }  // 关联父权限

    [StringLength(500)]
    public string Description { get; set; }
}
```

### 2.3 更新权限

**接口**: `PUT /api/permissions/{id}`

**请求体**:

```json
{
  "name": "创建用户（更新）",
  "description": "创建新用户的权限"
}
```

**注意**:
- `code`, `type`, `module`, `action`, `parentCode` 不允许修改
- 仅允许修改 `name` 和 `description`

---

## 3. MenuItem API 接口更新

### 3.1 获取菜单项列表

**接口**: `GET /api/menu-items` 或 `GET /api/menu-items/tree`

**变更**: 响应体确保包含 `permissionCode` 字段

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "guid-1",
      "parentId": null,
      "groupId": "group-1",
      "title": "用户管理",
      "url": null,
      "icon": "Users",
      "permissionCode": null,  // 分组节点无权限
      "isActive": true,
      "sortOrder": 1,
      "children": [
        {
          "id": "guid-2",
          "parentId": "guid-1",
          "groupId": "group-1",
          "title": "用户列表",
          "url": "/users",
          "icon": null,
          "permissionCode": "page:users",  // 页面节点关联权限
          "isActive": true,
          "sortOrder": 1,
          "children": []
        }
      ]
    }
  ]
}
```

### 3.2 创建/更新菜单项

**接口**: `POST /api/menu-items` 和 `PUT /api/menu-items/{id}`

**请求体**:

```json
{
  "parentId": "guid-1",
  "groupId": "group-1",
  "title": "用户列表",
  "url": "/users",
  "icon": "Users",
  "permissionCode": "page:users",  // 关联页面权限
  "isActive": true,
  "sortOrder": 1
}
```

**验证规则**:
- 如果 `url` 不为空，`permissionCode` 应该以 `page:` 开头
- 如果 `url` 为空（分组节点），`permissionCode` 应该为 `null`

---

## 4. 用户登录API更新

### 4.1 登录响应

**接口**: `POST /api/auth/login`

**变更**: JWT Token中包含用户权限列表

**JWT Payload**:

```json
{
  "userId": "guid-1",
  "username": "admin",
  "email": "admin@example.com",
  "roles": ["admin", "user"],
  "permissions": [
    "page:users",
    "page:users-roles",
    "action:users:view",
    "action:users:create",
    "action:users:update",
    "action:users:delete"
  ],
  "exp": 1705670400,
  "iat": 1705584000
}
```

**C# 生成示例**:

```csharp
public async Task<string> GenerateJwtToken(User user)
{
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email)
    };

    // 添加角色
    foreach (var role in user.Roles)
    {
        claims.Add(new Claim(ClaimTypes.Role, role.Code));
    }

    // 添加权限
    var permissions = await _permissionRepository.GetUserPermissions(user.Id);
    foreach (var permission in permissions)
    {
        claims.Add(new Claim("permission", permission.Code));
    }

    // ... 生成Token
}
```

---

## 5. 权限验证中间件

### 5.1 权限验证特性（Attribute）

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequirePermissionAttribute : Attribute, IAuthorizationFilter
{
    private readonly string[] _permissionCodes;

    public RequirePermissionAttribute(params string[] permissionCodes)
    {
        _permissionCodes = permissionCodes;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (!user.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var userPermissions = user.Claims
            .Where(c => c.Type == "permission")
            .Select(c => c.Value)
            .ToList();

        // 检查是否有任一权限
        var hasPermission = _permissionCodes.Any(p => userPermissions.Contains(p));

        if (!hasPermission)
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}
```

### 5.2 使用示例

```csharp
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpGet]
    [RequirePermission("action:users:view")]
    public async Task<IActionResult> GetUsers()
    {
        // 业务逻辑
    }

    [HttpPost]
    [RequirePermission("action:users:create")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        // 业务逻辑
    }

    [HttpPut("{id}")]
    [RequirePermission("action:users:update")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        // 业务逻辑
    }

    [HttpDelete("{id}")]
    [RequirePermission("action:users:delete")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        // 业务逻辑
    }

    [HttpPut("{id}/password")]
    [RequirePermission("action:users:change-password")]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordRequest request)
    {
        // 业务逻辑
    }
}
```

---

## 6. 数据库种子数据

### 6.1 权限种子数据

```csharp
public class PermissionSeeder
{
    public static async Task SeedPermissions(ApplicationDbContext context)
    {
        if (await context.Permissions.AnyAsync())
        {
            return; // 已有数据，跳过
        }

        var permissions = new List<Permission>
        {
            // 用户模块 - 页面权限
            new Permission
            {
                Id = Guid.NewGuid(),
                Name = "用户列表页面",
                Code = "page:users",
                Type = "page",
                Module = "users",
                Description = "访问用户列表页面"
            },

            // 用户模块 - 操作权限
            new Permission
            {
                Id = Guid.NewGuid(),
                Name = "查看用户",
                Code = "action:users:view",
                Type = "action",
                Module = "users",
                Action = "view",
                ParentCode = "page:users",
                Description = "查看用户列表数据"
            },
            new Permission
            {
                Id = Guid.NewGuid(),
                Name = "创建用户",
                Code = "action:users:create",
                Type = "action",
                Module = "users",
                Action = "create",
                ParentCode = "page:users",
                Description = "创建新用户"
            },
            // ... 其他权限
        };

        await context.Permissions.AddRangeAsync(permissions);
        await context.SaveChangesAsync();
    }
}
```

### 6.2 菜单项种子数据

```csharp
public class MenuItemSeeder
{
    public static async Task SeedMenuItems(ApplicationDbContext context)
    {
        if (await context.MenuItems.AnyAsync())
        {
            return;
        }

        var systemGroup = new MenuGroup
        {
            Id = Guid.NewGuid(),
            Title = "系统管理",
            Type = "sidebar",
            SortOrder = 1,
            IsActive = true
        };

        await context.MenuGroups.AddAsync(systemGroup);

        var userManagementParent = new MenuItem
        {
            Id = Guid.NewGuid(),
            GroupId = systemGroup.Id,
            ParentId = null,
            Title = "用户管理",
            Url = null,              // 分组节点
            Icon = "Users",
            PermissionCode = null,   // 分组节点无权限
            SortOrder = 1,
            IsActive = true
        };

        await context.MenuItems.AddAsync(userManagementParent);
        await context.SaveChangesAsync();

        var menuItems = new List<MenuItem>
        {
            new MenuItem
            {
                Id = Guid.NewGuid(),
                GroupId = systemGroup.Id,
                ParentId = userManagementParent.Id,
                Title = "用户列表",
                Url = "/users",
                PermissionCode = "page:users",  // 关联页面权限
                SortOrder = 1,
                IsActive = true
            },
            new MenuItem
            {
                Id = Guid.NewGuid(),
                GroupId = systemGroup.Id,
                ParentId = userManagementParent.Id,
                Title = "角色管理",
                Url = "/users/roles",
                PermissionCode = "page:users-roles",
                SortOrder = 2,
                IsActive = true
            }
        };

        await context.MenuItems.AddRangeAsync(menuItems);
        await context.SaveChangesAsync();
    }
}
```

---

## 7. API接口清单

### 7.1 Permission接口（已有，需更新）

| 方法 | 路径 | 说明 | 变更 |
|-----|------|------|------|
| GET | `/api/permissions` | 获取权限列表 | 响应增加字段 |
| GET | `/api/permissions/{id}` | 获取权限详情 | 响应增加字段 |
| POST | `/api/permissions` | 创建权限 | 请求增加字段 |
| PUT | `/api/permissions/{id}` | 更新权限 | 无变更 |
| DELETE | `/api/permissions/{id}` | 删除权限 | 无变更 |
| GET | `/api/permissions/tree` | 获取权限树 | 响应增加字段 |

### 7.2 MenuItem接口（已有，确保完整）

| 方法 | 路径 | 说明 | 变更 |
|-----|------|------|------|
| GET | `/api/menu-items` | 获取菜单项列表 | 确保返回permissionCode |
| GET | `/api/menu-items/tree` | 获取菜单树 | 确保返回permissionCode |
| POST | `/api/menu-items` | 创建菜单项 | 支持permissionCode |
| PUT | `/api/menu-items/{id}` | 更新菜单项 | 支持permissionCode |
| DELETE | `/api/menu-items/{id}` | 删除菜单项 | 无变更 |

### 7.3 Auth接口（需更新）

| 方法 | 路径 | 说明 | 变更 |
|-----|------|------|------|
| POST | `/api/auth/login` | 用户登录 | JWT包含permissions |
| POST | `/api/auth/refresh` | 刷新Token | JWT包含permissions |

---

## 8. 测试建议

### 8.1 单元测试

```csharp
[Fact]
public async Task CreatePermission_WithValidData_ShouldSucceed()
{
    var request = new CreatePermissionRequest
    {
        Name = "创建用户",
        Code = "action:users:create",
        Type = "action",
        Module = "users",
        Action = "create",
        ParentCode = "page:users",
        Description = "创建新用户"
    };

    var result = await _permissionService.CreateAsync(request);

    Assert.NotNull(result);
    Assert.Equal("action", result.Type);
    Assert.Equal("create", result.Action);
    Assert.Equal("page:users", result.ParentCode);
}
```

### 8.2 集成测试

```csharp
[Fact]
public async Task GetMenuItems_ShouldIncludePermissionCode()
{
    var response = await _client.GetAsync("/api/menu-items/tree");
    response.EnsureSuccessStatusCode();

    var content = await response.Content.ReadAsStringAsync();
    var data = JsonSerializer.Deserialize<ApiResponse<List<MenuItem>>>(content);

    Assert.NotNull(data);
    var pageMenuItem = data.Data.SelectMany(g => g.Children).FirstOrDefault(i => i.Url != null);
    Assert.NotNull(pageMenuItem.PermissionCode);
    Assert.StartsWith("page:", pageMenuItem.PermissionCode);
}
```

---

## 9. 迁移步骤建议

### Step 1: 数据库迁移

```bash
# Entity Framework Core
dotnet ef migrations add AddPermissionTypeAndAction
dotnet ef database update
```

### Step 2: 数据迁移

```csharp
// 将现有权限迁移为新格式
UPDATE Permissions
SET Type = 'action',
    Action = SUBSTRING(Code, CHARINDEX(':', Code) + 1, LEN(Code))
WHERE Code LIKE '%:%';

// 添加页面权限
INSERT INTO Permissions (Id, Name, Code, Type, Module, Description)
VALUES
  (NEWID(), '用户列表页面', 'page:users', 'page', 'users', '访问用户列表页面'),
  (NEWID(), '角色管理页面', 'page:users-roles', 'page', 'users', '访问角色管理页面');

// 更新ParentCode关联
UPDATE Permissions
SET ParentCode = 'page:users'
WHERE Code LIKE 'action:users:%';
```

### Step 3: 更新API代码

1. 更新DTO类
2. 更新Entity模型
3. 更新Service层
4. 添加权限验证中间件
5. 更新Controller添加权限检查

### Step 4: 测试验证

1. 运行单元测试
2. 运行集成测试
3. 手动测试前端集成

---

## 10. 联系方式

如有疑问，请联系前端团队：

- **文档版本**: 1.0.0
- **创建日期**: 2025-01-19
- **前端参考**: 见 `PERMISSION_DESIGN.md`
- **权限数据**: 见 `src/data/permissions-complete.json`
