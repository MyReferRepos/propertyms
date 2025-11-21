/**
 * Menu Synchronization Script
 * 菜单同步脚本 - 将UI路由同步到数据库
 *
 * 使用方法:
 * 1. 确保后端API运行在 http://localhost:5199
 * 2. 运行: npx tsx scripts/sync-menus.ts
 */

const API_BASE_URL = 'http://localhost:5199/api'
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'NewPass@123'

interface LoginResponse {
  success: boolean
  data?: {
    token: string
    user: any
  }
  error?: any
}

interface Permission {
  id?: string
  name: string
  code: string
  type: 'Module' | 'Action'  // 首字母大写以匹配后端
  moduleId: string            // 所属模块ID (必需)
  path?: string
  action?: string
  httpMethod?: string
  description?: string
}

interface Menu {
  id?: string
  parentId?: string | null
  menuGroupId?: string | null
  name: string
  title: string
  i18nKey: string
  path?: string | null
  icon?: string | null
  sortOrder: number
  menuType: 'Directory' | 'Menu' | 'Action'  // 首字母大写以匹配后端
  visible: boolean
  isActive: boolean
  keepAlive: boolean
  isExternal: boolean
  hiddenInBreadcrumb: boolean
  alwaysShow: boolean
  permissionId?: string | null
  meta?: string | null
  remark?: string | null
}

interface MenuGroup {
  id?: string
  name: string
  i18nKey: string
  sortOrder: number
  isActive: boolean
  icon?: string
  description?: string
}

let authToken: string = ''

/**
 * 登录获取Token
 */
async function login(): Promise<string> {
  console.log('🔐 正在登录...')

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  })

  if (!response.ok) {
    throw new Error(`登录失败: ${response.statusText}`)
  }

  const data: LoginResponse = await response.json()

  if (!data.success || !data.data?.token) {
    throw new Error('登录失败: 未获取到token')
  }

  authToken = data.data.token
  console.log('✅ 登录成功')
  return authToken
}

/**
 * 通用API请求
 */
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API请求失败 [${method} ${endpoint}]: ${response.statusText}\n${errorText}`)
  }

  return response.json()
}

/**
 * 获取所有权限
 */
async function getAllPermissions(): Promise<Permission[]> {
  console.log('📋 获取所有权限...')
  const response: any = await apiRequest('/permissions')
  return response.data || []
}

/**
 * 获取所有菜单组
 */
async function getAllMenuGroups(): Promise<MenuGroup[]> {
  console.log('📂 获取所有菜单组...')
  const response: any = await apiRequest('/menu-groups')
  return response.data || []
}

/**
 * 获取菜单树
 */
async function getMenuTree(): Promise<any[]> {
  console.log('🌳 获取菜单树...')
  const response: any = await apiRequest('/menus/tree')
  return response.data || []
}

/**
 * 创建权限
 */
async function createPermission(permission: Permission): Promise<Permission> {
  console.log(`  ➕ 创建权限: ${permission.code}`)
  const response: any = await apiRequest('/permissions', 'POST', permission)
  return response.data
}

/**
 * 创建菜单组
 */
async function createMenuGroup(group: MenuGroup): Promise<MenuGroup> {
  console.log(`  ➕ 创建菜单组: ${group.code}`)
  const response: any = await apiRequest('/menu-groups', 'POST', group)
  return response.data
}

/**
 * 创建菜单
 */
async function createMenu(menu: Menu): Promise<Menu> {
  console.log(`  ➕ 创建菜单: ${menu.name} (${menu.i18nKey})`)
  const response: any = await apiRequest('/menus', 'POST', menu)
  return response.data
}

/**
 * 定义期望的权限列表
 */
function getExpectedPermissions(): Permission[] {
  return [
    // 用户模块权限
    {
      name: '用户管理模块',
      code: 'user_module',
      type: 'Module',
      path: '/api/users/*',
      description: '用户管理功能模块'
    },
    {
      name: '用户列表',
      code: 'user_list',
      type: 'Action',
      module: 'user_module',
      path: '/api/users',
      description: '查看用户列表'
    },
    {
      name: '创建用户',
      code: 'user_create',
      type: 'Action',
      module: 'user_module',
      path: '/api/users',
      description: '创建新用户'
    },
    {
      name: '编辑用户',
      code: 'user_update',
      type: 'Action',
      module: 'user_module',
      path: '/api/users/:id',
      description: '编辑用户信息'
    },
    {
      name: '删除用户',
      code: 'user_delete',
      type: 'Action',
      module: 'user_module',
      path: '/api/users/:id',
      description: '删除用户'
    },

    // 角色模块权限
    {
      name: '角色管理模块',
      code: 'role_module',
      type: 'Module',
      path: '/api/roles/*',
      description: '角色管理功能模块'
    },
    {
      name: '角色列表',
      code: 'role_list',
      type: 'Action',
      module: 'role_module',
      path: '/api/roles',
      description: '查看角色列表'
    },
    {
      name: '创建角色',
      code: 'role_create',
      type: 'Action',
      module: 'role_module',
      path: '/api/roles',
      description: '创建新角色'
    },
    {
      name: '编辑角色',
      code: 'role_update',
      type: 'Action',
      module: 'role_module',
      path: '/api/roles/:id',
      description: '编辑角色信息'
    },
    {
      name: '删除角色',
      code: 'role_delete',
      type: 'Action',
      module: 'role_module',
      path: '/api/roles/:id',
      description: '删除角色'
    },
    {
      name: '分配权限',
      code: 'role_assign_permissions',
      type: 'Action',
      module: 'role_module',
      path: '/api/roles/:id/permissions',
      description: '为角色分配权限'
    },

    // 权限模块权限
    {
      name: '权限管理模块',
      code: 'permission_module',
      type: 'Module',
      path: '/api/permissions/*',
      description: '权限管理功能模块'
    },
    {
      name: '权限列表',
      code: 'permission_list',
      type: 'Action',
      module: 'permission_module',
      path: '/api/permissions',
      description: '查看权限列表'
    },
    {
      name: '创建权限',
      code: 'permission_create',
      type: 'Action',
      module: 'permission_module',
      path: '/api/permissions',
      description: '创建新权限'
    },
    {
      name: '编辑权限',
      code: 'permission_update',
      type: 'Action',
      module: 'permission_module',
      path: '/api/permissions/:id',
      description: '编辑权限信息'
    },
    {
      name: '删除权限',
      code: 'permission_delete',
      type: 'Action',
      module: 'permission_module',
      path: '/api/permissions/:id',
      description: '删除权限'
    },

    // 菜单模块权限
    {
      name: '菜单管理模块',
      code: 'menu_module',
      type: 'Module',
      path: '/api/menus/*',
      description: '菜单管理功能模块'
    },
    {
      name: '菜单列表',
      code: 'menu_list',
      type: 'Action',
      module: 'menu_module',
      path: '/api/menus',
      description: '查看菜单列表'
    },
    {
      name: '创建菜单',
      code: 'menu_create',
      type: 'Action',
      module: 'menu_module',
      path: '/api/menus',
      description: '创建新菜单'
    },
    {
      name: '编辑菜单',
      code: 'menu_update',
      type: 'Action',
      module: 'menu_module',
      path: '/api/menus/:id',
      description: '编辑菜单信息'
    },
    {
      name: '删除菜单',
      code: 'menu_delete',
      type: 'Action',
      module: 'menu_module',
      path: '/api/menus/:id',
      description: '删除菜单'
    },

    // 设置模块权限
    {
      name: '设置管理模块',
      code: 'settings_module',
      type: 'Module',
      path: '/api/settings/*',
      description: '系统设置功能模块'
    },
  ]
}

/**
 * 定义期望的菜单组
 */
function getExpectedMenuGroups(): MenuGroup[] {
  return [
    {
      name: 'General',
      i18nKey: 'nav.general',
      sortOrder: 1,
      isActive: true,
      description: '通用功能菜单组'
    },
    {
      name: 'System Management',
      i18nKey: 'nav.system',
      sortOrder: 2,
      isActive: true,
      description: '系统管理菜单组'
    },
  ]
}

/**
 * 定义期望的菜单结构
 */
async function getExpectedMenus(
  permissions: Record<string, Permission>,
  menuGroups: Record<string, MenuGroup>
): Promise<Menu[]> {
  const generalGroupId = menuGroups['General']?.id
  const systemGroupId = menuGroups['System Management']?.id

  const menus: Menu[] = [
    // === General Group ===
    {
      menuGroupId: generalGroupId || null,
      name: 'Dashboard',
      title: 'Dashboard',
      i18nKey: 'nav.dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      sortOrder: 1,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: false,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: null, // Dashboard无需权限
    },
    {
      menuGroupId: generalGroupId || null,
      name: 'Framework Demo',
      title: 'Framework Demo',
      i18nKey: 'nav.frameworkDemo',
      path: '/demo',
      icon: 'Layers',
      sortOrder: 2,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: false,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: null, // Demo无需权限
    },
  ]

  // === System Management Group ===
  // User Management (Directory)
  const userManagementMenu: Menu = {
    menuGroupId: systemGroupId || null,
    name: 'User Management',
    title: 'User Management',
    i18nKey: 'nav.user',
    path: null,
    icon: 'Users',
    sortOrder: 1,
    menuType: 'Directory',
    visible: true,
    isActive: true,
    keepAlive: false,
    isExternal: false,
    hiddenInBreadcrumb: false,
    alwaysShow: true,
    permissionId: permissions['user_module']?.id || null,
  }
  menus.push(userManagementMenu)

  // 注意：需要先创建父菜单才能获取其ID，这里先用占位符
  const userManagementSubMenus: Omit<Menu, 'parentId'>[] = [
    {
      menuGroupId: null,
      name: 'Users',
      title: 'Users',
      i18nKey: 'nav.users.list',
      path: '/users',
      icon: null,
      sortOrder: 1,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: true,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: permissions['user_module']?.id || null,
    },
    {
      menuGroupId: null,
      name: 'Roles',
      title: 'Roles',
      i18nKey: 'nav.users.roles',
      path: '/users/roles',
      icon: null,
      sortOrder: 2,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: true,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: permissions['role_module']?.id || null,
    },
    {
      menuGroupId: null,
      name: 'Permissions',
      title: 'Permissions',
      i18nKey: 'nav.users.permissions',
      path: '/users/permissions',
      icon: null,
      sortOrder: 3,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: true,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: permissions['permission_module']?.id || null,
    },
  ]

  // Menu Management (Directory)
  const menuManagementMenu: Menu = {
    menuGroupId: systemGroupId || null,
    name: 'Menu Management',
    title: 'Menu Management',
    i18nKey: 'nav.menu',
    path: null,
    icon: 'Menu',
    sortOrder: 2,
    menuType: 'Directory',
    visible: true,
    isActive: true,
    keepAlive: false,
    isExternal: false,
    hiddenInBreadcrumb: false,
    alwaysShow: true,
    permissionId: permissions['menu_module']?.id || null,
  }
  menus.push(menuManagementMenu)

  const menuManagementSubMenus: Omit<Menu, 'parentId'>[] = [
    {
      menuGroupId: null,
      name: 'Menu Groups',
      title: 'Menu Groups',
      i18nKey: 'nav.menuGroups',
      path: '/menu/groups',
      icon: null,
      sortOrder: 1,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: true,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: permissions['menu_module']?.id || null,
    },
    {
      menuGroupId: null,
      name: 'Menu Items',
      title: 'Menu Items',
      i18nKey: 'nav.menuItems',
      path: '/menu/items',
      icon: null,
      sortOrder: 2,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: true,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: permissions['menu_module']?.id || null,
    },
  ]

  // Settings (Directory)
  const settingsMenu: Menu = {
    menuGroupId: systemGroupId || null,
    name: 'Settings',
    title: 'Settings',
    i18nKey: 'nav.settings',
    path: null,
    icon: 'Settings',
    sortOrder: 3,
    menuType: 'Directory',
    visible: true,
    isActive: true,
    keepAlive: false,
    isExternal: false,
    hiddenInBreadcrumb: false,
    alwaysShow: true,
    permissionId: permissions['settings_module']?.id || null,
  }
  menus.push(settingsMenu)

  const settingsSubMenus: Omit<Menu, 'parentId'>[] = [
    {
      menuGroupId: null,
      name: 'General Settings',
      title: 'General',
      i18nKey: 'nav.settings',
      path: '/settings/general',
      icon: null,
      sortOrder: 1,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: false,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: permissions['settings_module']?.id || null,
    },
    {
      menuGroupId: null,
      name: 'Profile',
      title: 'Profile',
      i18nKey: 'nav.profile',
      path: '/settings/profile',
      icon: null,
      sortOrder: 2,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      keepAlive: false,
      isExternal: false,
      hiddenInBreadcrumb: false,
      alwaysShow: false,
      permissionId: null, // Profile无需权限
    },
  ]

  return {
    menus,
    userManagementSubMenus,
    menuManagementSubMenus,
    settingsSubMenus,
  } as any
}

/**
 * 同步权限
 */
async function syncPermissions(): Promise<Record<string, Permission>> {
  console.log('\n📝 同步权限...')

  const existingPermissions = await getAllPermissions()
  const existingPermissionMap = new Map(existingPermissions.map(p => [p.code, p]))

  const expectedPermissions = getExpectedPermissions()
  const permissionMap: Record<string, Permission> = {}

  for (const permission of expectedPermissions) {
    const existing = existingPermissionMap.get(permission.code)

    if (existing) {
      console.log(`  ✓ 权限已存在: ${permission.code}`)
      permissionMap[permission.code] = existing
    } else {
      try {
        const created = await createPermission(permission)
        permissionMap[permission.code] = created
      } catch (error: any) {
        console.error(`  ✗ 创建权限失败: ${permission.code}`, error.message)
      }
    }
  }

  return permissionMap
}

/**
 * 同步菜单组
 */
async function syncMenuGroups(): Promise<Record<string, MenuGroup>> {
  console.log('\n📁 同步菜单组...')

  const existingGroups = await getAllMenuGroups()
  const existingGroupMap = new Map(existingGroups.map(g => [g.name, g]))

  const expectedGroups = getExpectedMenuGroups()
  const groupMap: Record<string, MenuGroup> = {}

  for (const group of expectedGroups) {
    const existing = existingGroupMap.get(group.name)

    if (existing) {
      console.log(`  ✓ 菜单组已存在: ${group.name}`)
      groupMap[group.name] = existing
    } else {
      try {
        const created = await createMenuGroup(group)
        groupMap[group.name] = created
      } catch (error: any) {
        console.error(`  ✗ 创建菜单组失败: ${group.name}`, error.message)
      }
    }
  }

  return groupMap
}

/**
 * 同步菜单
 */
async function syncMenus(
  permissions: Record<string, Permission>,
  menuGroups: Record<string, MenuGroup>
): Promise<void> {
  console.log('\n🌳 同步菜单...')

  const expectedMenuData = await getExpectedMenus(permissions, menuGroups)
  const { menus, userManagementSubMenus, menuManagementSubMenus, settingsSubMenus } = expectedMenuData

  // 创建主菜单
  const createdMenus: Record<string, Menu> = {}

  for (const menu of menus) {
    try {
      const created = await createMenu(menu)
      createdMenus[menu.name] = created
    } catch (error: any) {
      console.error(`  ✗ 创建菜单失败: ${menu.name}`, error.message)
    }
  }

  // 创建子菜单 - User Management
  if (createdMenus['User Management']) {
    for (const subMenu of userManagementSubMenus) {
      try {
        await createMenu({
          ...subMenu,
          parentId: createdMenus['User Management'].id!,
        } as Menu)
      } catch (error: any) {
        console.error(`  ✗ 创建子菜单失败: ${subMenu.name}`, error.message)
      }
    }
  }

  // 创建子菜单 - Menu Management
  if (createdMenus['Menu Management']) {
    for (const subMenu of menuManagementSubMenus) {
      try {
        await createMenu({
          ...subMenu,
          parentId: createdMenus['Menu Management'].id!,
        } as Menu)
      } catch (error: any) {
        console.error(`  ✗ 创建子菜单失败: ${subMenu.name}`, error.message)
      }
    }
  }

  // 创建子菜单 - Settings
  if (createdMenus['Settings']) {
    for (const subMenu of settingsSubMenus) {
      try {
        await createMenu({
          ...subMenu,
          parentId: createdMenus['Settings'].id!,
        } as Menu)
      } catch (error: any) {
        console.error(`  ✗ 创建子菜单失败: ${subMenu.name}`, error.message)
      }
    }
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始同步菜单数据...\n')

    // 1. 登录
    await login()

    // 2. 同步权限
    const permissions = await syncPermissions()

    // 3. 同步菜单组
    const menuGroups = await syncMenuGroups()

    // 4. 同步菜单
    await syncMenus(permissions, menuGroups)

    // 5. 显示最终结果
    console.log('\n✅ 同步完成！')
    console.log('\n📊 最终数据：')
    const finalMenuTree = await getMenuTree()
    console.log(JSON.stringify(finalMenuTree, null, 2))

  } catch (error) {
    console.error('\n❌ 同步失败:', error)
    process.exit(1)
  }
}

// 运行主函数
main()
