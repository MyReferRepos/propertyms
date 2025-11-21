/**
 * 完整的菜单同步脚本
 * 对比前端路由与后端菜单，添加缺失项，修正不匹配项
 */

const API_BASE_URL = 'http://localhost:5199/api'
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'NewPass@123'

let authToken = ''

interface Menu {
  id?: string
  parentId?: string | null
  menuGroupId?: string | null
  name: string
  title: string
  i18nKey?: string | null
  path?: string | null
  redirect?: string | null
  component?: string | null
  icon?: string | null
  sortOrder: number
  menuType: 'Directory' | 'Menu' | 'Action'
  visible: boolean
  isActive: boolean
  keepAlive?: boolean
  isExternal?: boolean
  hiddenInBreadcrumb?: boolean
  alwaysShow?: boolean
  badge?: string | null
  meta?: string | null
  remark?: string | null
  permissionId?: string | null
}

interface MenuGroup {
  id: string
  name: string
  i18nKey?: string | null
  sortOrder: number
  isActive: boolean
}

interface Permission {
  id: string
  name: string
  code: string
  type: string
}

// 定义前端所有实际存在的路由页面
const FRONTEND_ROUTES: Menu[] = [
  // 通用功能组
  {
    name: 'Dashboard',
    title: '仪表盘',
    i18nKey: 'nav.dashboard',
    path: '/',
    component: 'src/routes/_authenticated/index.tsx',
    icon: 'LayoutDashboard',
    sortOrder: 1,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null, // 所有人可访问
  },
  {
    name: 'FrameworkDemo',
    title: '框架演示',
    i18nKey: 'nav.frameworkDemo',
    path: '/demo',
    component: 'src/routes/_authenticated/demo.tsx',
    icon: 'Blocks',
    sortOrder: 2,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: false,
    isExternal: false,
    permissionId: null,
  },

  // 系统管理组 - 用户管理
  {
    name: 'UserManagement',
    title: '用户列表',
    i18nKey: 'nav.users.list',
    path: '/users',
    component: 'src/routes/_authenticated/users/index.tsx',
    icon: 'Users',
    sortOrder: 11,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null, // 需要关联 user:view 权限
  },
  {
    name: 'RoleManagement',
    title: '角色管理',
    i18nKey: 'nav.users.roles',
    path: '/users/roles',
    component: 'src/routes/_authenticated/users/roles.tsx',
    icon: 'Shield',
    sortOrder: 12,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null, // 需要关联 role:view 权限
  },
  {
    name: 'PermissionManagement',
    title: '权限管理',
    i18nKey: 'nav.users.permissions',
    path: '/users/permissions',
    component: 'src/routes/_authenticated/users/permissions.tsx',
    icon: 'Key',
    sortOrder: 13,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null, // 需要关联 permission:view 权限
  },

  // 系统管理组 - 菜单管理
  {
    name: 'MenuManagement',
    title: '菜单管理',
    i18nKey: 'nav.menuManagement',
    path: '/menu',
    component: 'src/routes/_authenticated/menu/index.tsx',
    icon: 'Menu',
    sortOrder: 21,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null,
  },
  {
    name: 'MenuGroupManagement',
    title: '菜单组',
    i18nKey: 'nav.menuGroups',
    path: '/menu/groups',
    component: 'src/routes/_authenticated/menu/groups.tsx',
    icon: 'FolderTree',
    sortOrder: 22,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null,
  },
  {
    name: 'MenuItemManagement',
    title: '菜单项',
    i18nKey: 'nav.menuItems',
    path: '/menu/items',
    component: 'src/routes/_authenticated/menu/items.tsx',
    icon: 'ListTree',
    sortOrder: 23,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: true,
    isExternal: false,
    permissionId: null,
  },

  // 系统管理组 - 设置
  {
    name: 'GeneralSettings',
    title: '通用设置',
    i18nKey: 'nav.settings.general',
    path: '/settings/general',
    component: 'src/routes/_authenticated/settings/general.tsx',
    icon: 'Settings',
    sortOrder: 31,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: false,
    isExternal: false,
    permissionId: null,
  },
  {
    name: 'ProfileSettings',
    title: '个人资料',
    i18nKey: 'nav.settings.profile',
    path: '/settings/profile',
    component: 'src/routes/_authenticated/settings/profile.tsx',
    icon: 'UserCog',
    sortOrder: 32,
    menuType: 'Menu',
    visible: true,
    isActive: true,
    keepAlive: false,
    isExternal: false,
    permissionId: null,
  },
]

/**
 * 登录
 */
async function login(): Promise<void> {
  console.log('🔐 正在登录...')

  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!response.ok) throw new Error(`登录失败: ${response.statusText}`)

  const data = await response.json()
  if (data.success && data.data?.token) {
    authToken = data.data.token
    console.log('✅ 登录成功\n')
  } else {
    throw new Error('登录失败: 未获取到token')
  }
}

/**
 * 获取所有菜单组
 */
async function getMenuGroups(): Promise<MenuGroup[]> {
  const response = await fetch(`${API_BASE_URL}/menu-groups`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  })

  if (!response.ok) throw new Error(`获取菜单组失败: ${response.statusText}`)

  const data = await response.json()
  return data.success && data.data?.items ? data.data.items : []
}

/**
 * 获取所有菜单
 */
async function getAllMenus(): Promise<Menu[]> {
  const response = await fetch(`${API_BASE_URL}/menus?pageSize=1000`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  })

  if (!response.ok) throw new Error(`获取菜单失败: ${response.statusText}`)

  const data = await response.json()
  return data.success && data.data?.items ? data.data.items : []
}

/**
 * 获取所有权限
 */
async function getAllPermissions(): Promise<Permission[]> {
  const response = await fetch(`${API_BASE_URL}/Permissions?pageSize=1000`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  })

  if (!response.ok) throw new Error(`获取权限失败: ${response.statusText}`)

  const data = await response.json()
  return data.success && data.data?.items ? data.data.items : []
}

/**
 * 创建菜单
 */
async function createMenu(menu: Menu): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.success && data.data ? data.data : null
  } catch (error: any) {
    console.error(`   ❌ 创建失败: ${error.message}`)
    return null
  }
}

/**
 * 更新菜单
 */
async function updateMenu(id: string, menu: Partial<Menu>): Promise<boolean> {
  try {
    // 先获取完整菜单信息
    const getResponse = await fetch(`${API_BASE_URL}/menus/${id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!getResponse.ok) throw new Error('获取菜单详情失败')

    const getData = await getResponse.json()
    if (!getData.success || !getData.data) throw new Error('获取菜单详情失败')

    const existingMenu = getData.data

    // 更新菜单
    const updateResponse = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...existingMenu,
        ...menu,
      }),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      throw new Error(`${updateResponse.statusText} - ${errorText}`)
    }

    const updateData = await updateResponse.json()
    return updateData.success
  } catch (error: any) {
    console.error(`   ❌ 更新失败: ${error.message}`)
    return false
  }
}

/**
 * 删除菜单
 */
async function deleteMenu(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) throw new Error(`删除失败: ${response.statusText}`)

    const data = await response.json()
    return data.success
  } catch (error: any) {
    console.error(`   ❌ 删除失败: ${error.message}`)
    return false
  }
}

/**
 * 对比前端路由和后端菜单
 */
function compareMenus(frontendRoutes: Menu[], backendMenus: Menu[]): {
  missing: Menu[]
  duplicates: Map<string, Menu[]>
  pathMismatches: Array<{ backend: Menu; expected: Menu }>
} {
  const missing: Menu[] = []
  const duplicates = new Map<string, Menu[]>()
  const pathMismatches: Array<{ backend: Menu; expected: Menu }> = []

  // 创建后端菜单映射
  const backendByName = new Map<string, Menu[]>()
  const backendByPath = new Map<string, Menu[]>()

  backendMenus.forEach(menu => {
    // 只处理Menu类型
    if (menu.menuType !== 'Menu') return

    // 按name分组
    if (!backendByName.has(menu.name)) {
      backendByName.set(menu.name, [])
    }
    backendByName.get(menu.name)!.push(menu)

    // 按path分组
    if (menu.path) {
      if (!backendByPath.has(menu.path)) {
        backendByPath.set(menu.path, [])
      }
      backendByPath.get(menu.path)!.push(menu)
    }
  })

  // 检查缺失和不匹配
  frontendRoutes.forEach(frontendRoute => {
    const backendMenusWithSameName = backendByName.get(frontendRoute.name) || []

    if (backendMenusWithSameName.length === 0) {
      // 缺失的菜单
      missing.push(frontendRoute)
    } else if (backendMenusWithSameName.length > 1) {
      // 重复的菜单
      duplicates.set(frontendRoute.name, backendMenusWithSameName)
    } else {
      // 检查路径是否匹配
      const backendMenu = backendMenusWithSameName[0]
      if (backendMenu.path !== frontendRoute.path) {
        pathMismatches.push({
          backend: backendMenu,
          expected: frontendRoute,
        })
      }
    }
  })

  return { missing, duplicates, pathMismatches }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('完整的菜单同步工具')
    console.log('='.repeat(80) + '\n')

    // 1. 登录
    await login()

    // 2. 获取数据
    console.log('📋 正在获取数据...')
    const [menuGroups, backendMenus, permissions] = await Promise.all([
      getMenuGroups(),
      getAllMenus(),
      getAllPermissions(),
    ])

    console.log(`   - 菜单组: ${menuGroups.length}`)
    console.log(`   - 后端菜单: ${backendMenus.length}`)
    console.log(`   - 权限: ${permissions.length}\n`)

    // 3. 对比分析
    console.log('🔍 正在分析差异...\n')
    const { missing, duplicates, pathMismatches } = compareMenus(FRONTEND_ROUTES, backendMenus)

    // 4. 显示分析结果
    console.log('='.repeat(80))
    console.log('分析结果')
    console.log('='.repeat(80) + '\n')

    console.log(`✅ 前端路由总数: ${FRONTEND_ROUTES.length}`)
    console.log(`📋 后端Menu类型菜单: ${backendMenus.filter(m => m.menuType === 'Menu').length}`)
    console.log(`❌ 缺失的菜单: ${missing.length}`)
    console.log(`⚠️  重复的菜单: ${duplicates.size}`)
    console.log(`🔧 路径不匹配: ${pathMismatches.length}\n`)

    // 5. 处理缺失的菜单
    if (missing.length > 0) {
      console.log('='.repeat(80))
      console.log('添加缺失的菜单')
      console.log('='.repeat(80) + '\n')

      // 获取菜单组ID
      const generalGroup = menuGroups.find(g => g.name === 'General')
      const systemGroup = menuGroups.find(g => g.name === 'System Management')

      let addedCount = 0

      for (const menu of missing) {
        console.log(`📝 添加菜单: ${menu.title} (${menu.name})`)
        console.log(`   路径: ${menu.path}`)

        // 确定菜单组
        let menuGroupId = null
        if (['Dashboard', 'FrameworkDemo'].includes(menu.name)) {
          menuGroupId = generalGroup?.id || null
        } else {
          menuGroupId = systemGroup?.id || null
        }

        const created = await createMenu({
          ...menu,
          menuGroupId,
        })

        if (created) {
          console.log(`   ✅ 添加成功\n`)
          addedCount++
        } else {
          console.log(`   ❌ 添加失败\n`)
        }

        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log(`\n📊 添加统计: ${addedCount}/${missing.length} 成功\n`)
    }

    // 6. 处理重复的菜单
    if (duplicates.size > 0) {
      console.log('='.repeat(80))
      console.log('处理重复的菜单')
      console.log('='.repeat(80) + '\n')

      for (const [name, menus] of duplicates) {
        console.log(`⚠️  发现重复: ${name}`)
        menus.forEach((menu, index) => {
          console.log(`   ${index + 1}. ID: ${menu.id}, Path: ${menu.path}`)
        })

        // 保留第一个，删除其他
        for (let i = 1; i < menus.length; i++) {
          console.log(`   🗑️  删除重复项: ${menus[i].id}`)
          await deleteMenu(menus[i].id!)
        }
        console.log()
      }
    }

    // 7. 修正路径不匹配
    if (pathMismatches.length > 0) {
      console.log('='.repeat(80))
      console.log('修正路径不匹配')
      console.log('='.repeat(80) + '\n')

      let fixedCount = 0

      for (const { backend, expected } of pathMismatches) {
        console.log(`🔧 修正: ${backend.title}`)
        console.log(`   当前: ${backend.path}`)
        console.log(`   正确: ${expected.path}`)

        const success = await updateMenu(backend.id!, { path: expected.path })

        if (success) {
          console.log(`   ✅ 修正成功\n`)
          fixedCount++
        } else {
          console.log(`   ❌ 修正失败\n`)
        }

        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log(`\n📊 修正统计: ${fixedCount}/${pathMismatches.length} 成功\n`)
    }

    console.log('='.repeat(80))
    console.log('✨ 同步完成！')
    console.log('='.repeat(80) + '\n')
  } catch (error: any) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
