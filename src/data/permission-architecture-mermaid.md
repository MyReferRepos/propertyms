# 权限管理架构 - Mermaid 流程图

## 1. RBAC 整体架构

```mermaid
graph TB
    subgraph "RBAC 权限管理系统"
        User[👤 用户 User]
        Role[👥 角色 Role]
        Permission[🔐 权限 Permission]

        User -->|N:M| UserRole[用户角色关联]
        UserRole -->|N:M| Role
        Role -->|N:M| RolePermission[角色权限关联]
        RolePermission -->|N:M| Permission

        User -.->|间接获取| Permission
    end

    style User fill:#e1f5ff
    style Role fill:#fff4e1
    style Permission fill:#ffe1e1
```

## 2. 权限分类体系

```mermaid
graph TB
    Permission[🔐 Permission 权限]

    Permission --> MenuPerm[📋 菜单权限<br/>MENU Type]
    Permission --> ApiPerm[🔌 API权限<br/>API Type]
    Permission --> ButtonPerm[🔘 按钮权限<br/>BUTTON Type]

    MenuPerm --> Menu1[users:menu<br/>控制导航可见]
    MenuPerm --> Menu2[roles:menu]
    MenuPerm --> Menu3[settings:menu]

    ApiPerm --> Api1[users:view<br/>查看列表]
    ApiPerm --> Api2[users:create<br/>创建记录]
    ApiPerm --> Api3[users:update<br/>更新记录]
    ApiPerm --> Api4[users:delete<br/>删除记录]

    ButtonPerm --> Btn1[users:btn:export<br/>导出功能]
    ButtonPerm --> Btn2[users:btn:import<br/>导入功能]

    style Permission fill:#ff6b6b
    style MenuPerm fill:#4ecdc4
    style ApiPerm fill:#45b7d1
    style ButtonPerm fill:#96ceb4
```

## 3. 用户管理模块权限树

```mermaid
graph TB
    Module[📦 用户管理模块<br/>Users Module]

    subgraph "菜单权限层"
        MenuPerm[🔷 users:menu<br/>用户管理菜单<br/>控制菜单可见性]
    end

    subgraph "API权限层"
        ViewPerm[🔹 users:view<br/>查看用户列表<br/>访问页面]
        CreatePerm[🔹 users:create<br/>创建新用户<br/>POST /api/users]
        UpdatePerm[🔹 users:update<br/>更新用户信息<br/>PUT /api/users/:id]
        DeletePerm[🔹 users:delete<br/>删除用户<br/>DELETE /api/users/:id]
    end

    subgraph "按钮权限层"
        ExportBtn[🔸 users:btn:export<br/>导出用户数据]
        ImportBtn[🔸 users:btn:import<br/>导入用户数据]
        BatchDelBtn[🔸 users:btn:batch-delete<br/>批量删除]
    end

    Module --> MenuPerm
    Module --> ViewPerm
    Module --> CreatePerm
    Module --> UpdatePerm
    Module --> DeletePerm
    Module --> ExportBtn
    Module --> ImportBtn
    Module --> BatchDelBtn

    MenuPerm -.可选关联.-> ViewPerm
    MenuPerm -.可选关联.-> CreatePerm
    MenuPerm -.可选关联.-> UpdatePerm
    MenuPerm -.可选关联.-> DeletePerm

    style Module fill:#667eea
    style MenuPerm fill:#f093fb
    style ViewPerm fill:#4facfe
    style CreatePerm fill:#43e97b
    style UpdatePerm fill:#fa709a
    style DeletePerm fill:#ff6b6b
    style ExportBtn fill:#feca57
    style ImportBtn fill:#48dbfb
    style BatchDelBtn fill:#ff9ff3
```

## 4. 权限分配流程

```mermaid
flowchart TD
    Start([开始]) --> CreateRole[创建角色]
    CreateRole --> SelectModule[选择模块权限]

    SelectModule --> MenuCheck{是否需要<br/>菜单访问?}
    MenuCheck -->|是| AssignMenu[✅ 分配菜单权限<br/>users:menu]
    MenuCheck -->|否| SkipMenu[❌ 跳过菜单权限]

    AssignMenu --> ApiSelect[选择API权限]
    SkipMenu --> ApiSelect

    ApiSelect --> ViewCheck{需要查看?}
    ViewCheck -->|是| AssignView[✅ users:view]
    ViewCheck -->|否| CreateCheck

    AssignView --> CreateCheck{需要创建?}
    CreateCheck -->|是| AssignCreate[✅ users:create]
    CreateCheck -->|否| UpdateCheck

    AssignCreate --> UpdateCheck{需要编辑?}
    UpdateCheck -->|是| AssignUpdate[✅ users:update]
    UpdateCheck -->|否| DeleteCheck

    AssignUpdate --> DeleteCheck{需要删除?}
    DeleteCheck -->|是| AssignDelete[✅ users:delete]
    DeleteCheck -->|否| ButtonSelect

    AssignDelete --> ButtonSelect[选择按钮权限]

    ButtonSelect --> SaveRole[保存角色]
    SaveRole --> AssignUser[分配给用户]
    AssignUser --> UserLogin[用户登录]
    UserLogin --> PermissionCheck[权限校验]
    PermissionCheck --> End([完成])

    style Start fill:#a8e6cf
    style CreateRole fill:#dcedc1
    style AssignMenu fill:#ffd3b6
    style AssignView fill:#ffaaa5
    style AssignCreate fill:#ff8b94
    style AssignUpdate fill:#a8e6cf
    style AssignDelete fill:#ff6b6b
    style SaveRole fill:#c7ceea
    style End fill:#a8e6cf
```

## 5. 前端权限校验流程

```mermaid
flowchart TB
    Start([用户访问应用]) --> Login[用户登录]
    Login --> GetToken[获取JWT Token<br/>包含权限列表]
    GetToken --> StorePerms[存储到Permission Store<br/>Zustand/Redux]

    StorePerms --> Navigation[导航渲染]
    StorePerms --> Routing[路由访问]
    StorePerms --> Component[组件渲染]

    subgraph "菜单渲染守卫"
        Navigation --> MenuCheck{hasPermission<br/>'users:menu'?}
        MenuCheck -->|✅ 有权限| ShowMenu[显示菜单项]
        MenuCheck -->|❌ 无权限| HideMenu[隐藏菜单项]
    end

    subgraph "路由访问守卫"
        Routing --> RouteCheck{hasPermission<br/>'users:view'?}
        RouteCheck -->|✅ 有权限| AllowAccess[允许访问页面]
        RouteCheck -->|❌ 无权限| Redirect403[跳转403页面]
    end

    subgraph "组件/按钮守卫"
        Component --> BtnCheck{hasPermission<br/>'users:create'?}
        BtnCheck -->|✅ 有权限| EnableBtn[启用按钮]
        BtnCheck -->|❌ 无权限| DisableBtn[禁用/隐藏按钮]
    end

    ShowMenu --> RenderUI[渲染UI]
    AllowAccess --> RenderUI
    EnableBtn --> RenderUI

    HideMenu --> RenderUI
    Redirect403 --> ErrorPage[显示错误页]
    DisableBtn --> RenderUI

    style Login fill:#a8e6cf
    style GetToken fill:#dcedc1
    style StorePerms fill:#ffd3b6
    style ShowMenu fill:#b4ec51
    style AllowAccess fill:#b4ec51
    style EnableBtn fill:#b4ec51
    style HideMenu fill:#ff6b6b
    style Redirect403 fill:#ff6b6b
    style DisableBtn fill:#ffaaa5
```

## 6. 后端API权限校验流程

```mermaid
flowchart TB
    Request([HTTP Request]) --> Headers{携带Token?}
    Headers -->|❌ 否| Return401[返回 401<br/>Unauthorized]
    Headers -->|✅ 是| VerifyToken[验证JWT Token]

    VerifyToken --> TokenValid{Token有效?}
    TokenValid -->|❌ 否| Return401
    TokenValid -->|✅ 是| ParseToken[解析Token<br/>获取用户权限]

    ParseToken --> CheckEndpoint[检查API端点<br/>所需权限]

    subgraph "权限验证"
        CheckEndpoint --> GetRequired[获取@RequirePermission<br/>装饰器配置]
        GetRequired --> Example1[POST /users<br/>需要: users:create]
        GetRequired --> Example2[PUT /users/:id<br/>需要: users:update]
        GetRequired --> Example3[DELETE /users/:id<br/>需要: users:delete]
    end

    Example1 --> HasPerm{用户有该权限?}
    Example2 --> HasPerm
    Example3 --> HasPerm

    HasPerm -->|❌ 否| Return403[返回 403<br/>Forbidden]
    HasPerm -->|✅ 是| ExecuteAPI[执行API逻辑]

    ExecuteAPI --> DBOperation[数据库操作]
    DBOperation --> Success{操作成功?}
    Success -->|✅ 是| Return200[返回 200<br/>成功响应]
    Success -->|❌ 否| Return500[返回 500<br/>服务器错误]

    style Request fill:#a8e6cf
    style VerifyToken fill:#dcedc1
    style ParseToken fill:#ffd3b6
    style ExecuteAPI fill:#b4ec51
    style Return200 fill:#b4ec51
    style Return401 fill:#ff6b6b
    style Return403 fill:#ff6b6b
    style Return500 fill:#ff9ff3
```

## 7. 权限数据模型 (ER图)

```mermaid
erDiagram
    USER ||--o{ USER_ROLE : "has"
    ROLE ||--o{ USER_ROLE : "assigned to"
    ROLE ||--o{ ROLE_PERMISSION : "has"
    PERMISSION ||--o{ ROLE_PERMISSION : "granted to"
    PERMISSION ||--o| PERMISSION : "parent of"

    USER {
        string id PK
        string username
        string email
        string password
        datetime created_at
    }

    ROLE {
        string id PK
        string name
        string code
        string description
        boolean is_system
        datetime created_at
    }

    PERMISSION {
        string id PK
        string name
        string code
        string type "NEW: menu/api/button"
        string module
        string parent_code "NEW: 父权限代码"
        string description
        datetime created_at
    }

    USER_ROLE {
        string user_id FK
        string role_id FK
    }

    ROLE_PERMISSION {
        string role_id FK
        string permission_id FK
    }
```

## 8. 权限类型状态图

```mermaid
stateDiagram-v2
    [*] --> Permission

    Permission --> MenuPermission: type = 'menu'
    Permission --> ApiPermission: type = 'api'
    Permission --> ButtonPermission: type = 'button'

    state MenuPermission {
        [*] --> MenuCheck
        MenuCheck --> Visible: hasPermission = true
        MenuCheck --> Hidden: hasPermission = false
        Visible --> [*]
        Hidden --> [*]
    }

    state ApiPermission {
        [*] --> ApiCheck
        ApiCheck --> Allow: hasPermission = true
        ApiCheck --> Deny403: hasPermission = false
        Allow --> ExecuteAPI
        ExecuteAPI --> [*]
        Deny403 --> [*]
    }

    state ButtonPermission {
        [*] --> ButtonCheck
        ButtonCheck --> Enabled: hasPermission = true
        ButtonCheck --> Disabled: hasPermission = false
        Enabled --> [*]
        Disabled --> [*]
    }
```

## 9. 权限校验时序图

```mermaid
sequenceDiagram
    actor User as 👤 用户
    participant FE as 前端应用
    participant Store as Permission Store
    participant Router as 路由守卫
    participant API as 后端API
    participant DB as 数据库

    User->>FE: 1. 登录
    FE->>API: 2. POST /auth/login
    API->>DB: 3. 验证用户凭证
    DB-->>API: 4. 返回用户+角色+权限
    API-->>FE: 5. 返回JWT Token<br/>{permissions: [...]}

    FE->>Store: 6. 存储权限列表

    rect rgb(200, 230, 255)
        Note over User,Store: 菜单渲染阶段
        FE->>Store: 7. hasPermission('users:menu')?
        Store-->>FE: 8. true
        FE-->>User: 9. 显示"用户管理"菜单
    end

    User->>FE: 10. 点击"用户管理"菜单

    rect rgb(255, 230, 200)
        Note over FE,Router: 路由守卫阶段
        FE->>Router: 11. 导航到 /users
        Router->>Store: 12. hasPermission('users:view')?
        Store-->>Router: 13. true
        Router-->>FE: 14. 允许访问
    end

    FE->>API: 15. GET /api/users<br/>Authorization: Bearer <token>

    rect rgb(200, 255, 200)
        Note over API,DB: 后端权限验证
        API->>API: 16. 验证JWT
        API->>API: 17. 检查 @RequirePermission('users:view')
        API->>API: 18. 权限校验通过
        API->>DB: 19. 查询用户列表
        DB-->>API: 20. 返回数据
    end

    API-->>FE: 21. 200 OK + 用户数据
    FE-->>User: 22. 渲染用户列表

    User->>FE: 23. 点击"新建用户"按钮

    rect rgb(255, 200, 200)
        Note over FE,API: 按钮权限控制
        FE->>Store: 24. hasPermission('users:create')?
        Store-->>FE: 25. false
        FE-->>User: 26. 按钮禁用/隐藏
    end
```

## 10. 完整权限管理流程

```mermaid
graph TB
    subgraph "1️⃣ 系统初始化"
        InitPerm[定义权限]
        InitPerm --> MenuPerm[菜单权限<br/>users:menu]
        InitPerm --> ApiPerm[API权限<br/>users:create<br/>users:update<br/>users:delete]
        InitPerm --> BtnPerm[按钮权限<br/>users:btn:export]
    end

    subgraph "2️⃣ 角色配置"
        CreateRole[创建角色]
        CreateRole --> AdminRole[管理员角色]
        CreateRole --> EditorRole[编辑员角色]
        CreateRole --> ViewerRole[查看员角色]

        AdminRole --> AllPerms[所有权限]
        EditorRole --> LimitedPerms[部分权限<br/>无删除]
        ViewerRole --> ReadPerms[只读权限]
    end

    subgraph "3️⃣ 用户分配"
        AssignUser[分配用户]
        AssignUser --> User1[用户A → 管理员]
        AssignUser --> User2[用户B → 编辑员]
        AssignUser --> User3[用户C → 查看员]
    end

    subgraph "4️⃣ 运行时校验"
        Login[用户登录]
        Login --> LoadPerms[加载权限]
        LoadPerms --> FrontendCheck[前端校验]
        LoadPerms --> BackendCheck[后端校验]

        FrontendCheck --> MenuControl[菜单控制]
        FrontendCheck --> RouteControl[路由控制]
        FrontendCheck --> UIControl[UI控制]

        BackendCheck --> APIGuard[API守卫]
        APIGuard --> DataAccess[数据访问]
    end

    subgraph "5️⃣ 审计日志"
        DataAccess --> AuditLog[记录操作日志]
        AuditLog --> WhoLog[谁]
        AuditLog --> WhenLog[何时]
        AuditLog --> WhatLog[做了什么]
        AuditLog --> ResultLog[结果]
    end

    MenuPerm --> CreateRole
    ApiPerm --> CreateRole
    BtnPerm --> CreateRole

    AllPerms --> AssignUser
    LimitedPerms --> AssignUser
    ReadPerms --> AssignUser

    User1 --> Login
    User2 --> Login
    User3 --> Login

    style InitPerm fill:#a8e6cf
    style CreateRole fill:#dcedc1
    style AssignUser fill:#ffd3b6
    style Login fill:#ffaaa5
    style AuditLog fill:#c7ceea
```

## 11. 权限继承关系图

```mermaid
graph TD
    subgraph "超级管理员 Super Admin"
        SA[全部权限]
        SA --> SA_System[系统管理]
        SA --> SA_User[用户管理]
        SA --> SA_Role[角色管理]
        SA --> SA_Perm[权限管理]
    end

    subgraph "管理员 Admin"
        Admin[管理员权限]
        Admin --> A_User[用户管理<br/>✅ 全部]
        Admin --> A_Role[角色管理<br/>✅ 全部]
        Admin --> A_Perm[权限管理<br/>❌ 查看]
    end

    subgraph "编辑员 Editor"
        Editor[编辑员权限]
        Editor --> E_User[用户管理<br/>✅ 增改查<br/>❌ 删除]
        Editor --> E_Role[角色管理<br/>❌ 禁止]
    end

    subgraph "查看员 Viewer"
        Viewer[查看员权限]
        Viewer --> V_User[用户管理<br/>✅ 查看<br/>❌ 其他]
    end

    SA -.继承.-> Admin
    Admin -.继承.-> Editor
    Editor -.继承.-> Viewer

    style SA fill:#ff6b6b
    style Admin fill:#feca57
    style Editor fill:#48dbfb
    style Viewer fill:#b4ec51
```

## 使用说明

### 如何在Markdown中使用:

1. **直接嵌入**: 复制上述代码块到任意支持Mermaid的Markdown编辑器
2. **GitHub/GitLab**: 直接渲染
3. **VS Code**: 安装 `Markdown Preview Mermaid Support` 插件
4. **在线预览**: https://mermaid.live/

### 图表说明:

- **图表 1-3**: 架构设计和数据模型
- **图表 4-6**: 业务流程和校验逻辑
- **图表 7-9**: 数据关系和状态转换
- **图表 10-11**: 完整流程和权限继承

### 颜色约定:

- 🟢 绿色: 成功/允许/启用
- 🔴 红色: 失败/拒绝/禁用
- 🔵 蓝色: 处理中/校验中
- 🟡 黄色: 警告/部分权限
