/**
 * 修复菜单Icon和i18nKey脚本
 * 根据前端配置修复后端菜单数据中的icon和i18nKey
 */

const API_BASE_URL = 'http://localhost:5199/api'
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'NewPass@123'

let authToken = ''

interface Menu {
  id: string
  parentId?: string | null
  menuGroupId?: string | null
  name: string
  title: string
  i18nKey?: string | null
  path?: string | null
  icon?: string | null
  sortOrder: number
  menuType: string
  visible: boolean
  isActive: boolean
  [key: string]: any
}

interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[]
}

// 根据菜单name定义正确的icon映射
const ICON_MAPPING: Record<string, string> = {
  // 顶级菜单
  'Dashboard': 'LayoutDashboard',
  'FrameworkDemo': 'Layers',
  'ComponentExamples': 'Layers',

  // 用户管理模块
  'UserManagement': 'Users',       // 用户列表页面用Users图标
  'RoleManagement': 'ShieldCheck',  // 角色管理
  'PermissionManagement': 'Lock',   // 权限管理

  // 菜单管理模块
  'MenuManagement': 'Menu',
  'MenuGroupManagement': 'FolderTree',
  'MenuItemManagement': 'ListTree',

  // 设置模块
  'SystemSettings': 'Settings',
  'GeneralSettings': 'Settings',
  'ProfileSettings': 'User',
}

// 根据菜单name定义正确的i18nKey映射
const I18N_KEY_MAPPING: Record<string, string> = {
  // 顶级菜单
  'Dashboard': 'nav.dashboard',
  'FrameworkDemo': 'nav.frameworkDemo',
  'ComponentExamples': 'nav.frameworkDemo',  // 使用同一个key

  // 用户管理模块
  'UserManagement': 'nav.users.list',       // 用户列表
  'RoleManagement': 'nav.users.roles',      // 角色管理
  'PermissionManagement': 'nav.users.permissions',  // 权限管理

  // 菜单管理模块
  'MenuManagement': 'nav.menuManagement',
  'MenuGroupManagement': 'nav.menuGroups',
  'MenuItemManagement': 'nav.menuItems',

  // 设置模块
  'SystemSettings': 'nav.settings',
  'GeneralSettings': 'nav.settings',
  'ProfileSettings': 'nav.profile',
}

// Directory类型菜单的icon和i18nKey映射（按title匹配）
const DIRECTORY_MAPPING: Record<string, { icon: string; i18nKey: string }> = {
  '用户管理': { icon: 'Users', i18nKey: 'nav.userManagement' },
  'User Management': { icon: 'Users', i18nKey: 'nav.userManagement' },
  '菜单管理': { icon: 'Menu', i18nKey: 'nav.menuManagement' },
  'Menu Management': { icon: 'Menu', i18nKey: 'nav.menuManagement' },
  '设置': { icon: 'Settings', i18nKey: 'nav.settings' },
  'Settings': { icon: 'Settings', i18nKey: 'nav.settings' },
  '系统设置': { icon: 'Settings', i18nKey: 'nav.settings' },
  'System Settings': { icon: 'Settings', i18nKey: 'nav.settings' },
}

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
 * 获取所有菜单（树形）
 */
async function getAllMenus(): Promise<Menu[]> {
  const response = await fetch(`${API_BASE_URL}/menus/tree`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  })

  if (!response.ok) throw new Error(`获取菜单失败: ${response.statusText}`)

  const data = await response.json()
  if (data.success && data.data) {
    return flattenMenuTree(data.data)
  }
  return []
}

/**
 * 扁平化菜单树
 */
function flattenMenuTree(menus: MenuTreeNode[]): Menu[] {
  const result: Menu[] = []

  function traverse(nodes: MenuTreeNode[]) {
    nodes.forEach(node => {
      const { children, ...menu } = node
      result.push(menu)
      if (children) {
        traverse(children)
      }
    })
  }

  traverse(menus)
  return result
}

/**
 * 获取菜单详情
 */
async function getMenuDetail(menuId: string): Promise<Menu | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.success && data.data ? data.data : null
  } catch (error) {
    return null
  }
}

/**
 * 更新菜单
 */
async function updateMenu(menuId: string, menuData: any): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`更新失败: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.success
  } catch (error: any) {
    console.error(`   ❌ 更新出错: ${error.message}`)
    return false
  }
}

/**
 * 分析需要修复的菜单
 */
function analyzeMenus(menus: Menu[]): {
  iconIssues: Menu[]
  i18nIssues: Menu[]
} {
  const iconIssues: Menu[] = []
  const i18nIssues: Menu[] = []

  menus.forEach(menu => {
    // 只处理Menu和Directory类型
    if (menu.menuType !== 'Menu' && menu.menuType !== 'Directory') {
      return
    }

    let hasIconIssue = false
    let hasI18nIssue = false

    if (menu.menuType === 'Menu') {
      // Menu类型：根据name查找正确的icon和i18nKey
      const expectedIcon = ICON_MAPPING[menu.name]
      const expectedI18nKey = I18N_KEY_MAPPING[menu.name]

      // 检查icon
      if (expectedIcon && menu.icon !== expectedIcon) {
        hasIconIssue = true
      } else if (!menu.icon && expectedIcon) {
        hasIconIssue = true
      }

      // 检查i18nKey
      if (expectedI18nKey && menu.i18nKey !== expectedI18nKey) {
        hasI18nIssue = true
      } else if (!menu.i18nKey && expectedI18nKey) {
        hasI18nIssue = true
      }
    } else if (menu.menuType === 'Directory') {
      // Directory类型：根据title查找正确的icon和i18nKey
      const mapping = DIRECTORY_MAPPING[menu.title]

      if (mapping) {
        // 检查icon
        if (menu.icon !== mapping.icon) {
          hasIconIssue = true
        } else if (!menu.icon) {
          hasIconIssue = true
        }

        // 检查i18nKey
        if (menu.i18nKey !== mapping.i18nKey) {
          hasI18nIssue = true
        } else if (!menu.i18nKey) {
          hasI18nIssue = true
        }
      }
    }

    if (hasIconIssue) iconIssues.push(menu)
    if (hasI18nIssue) i18nIssues.push(menu)
  })

  return { iconIssues, i18nIssues }
}

/**
 * 修复icon问题
 */
async function fixIconIssues(menus: Menu[]): Promise<void> {
  if (menus.length === 0) {
    console.log('\n✅ 所有菜单的icon都正确，无需修复！\n')
    return
  }

  console.log('\n' + '='.repeat(80))
  console.log(`开始修复 ${menus.length} 个菜单的Icon`)
  console.log('='.repeat(80) + '\n')

  let successCount = 0
  let failCount = 0

  for (const menu of menus) {
    // 获取期望的icon
    let expectedIcon: string | undefined

    if (menu.menuType === 'Menu') {
      expectedIcon = ICON_MAPPING[menu.name]
    } else if (menu.menuType === 'Directory') {
      const mapping = DIRECTORY_MAPPING[menu.title]
      expectedIcon = mapping?.icon
    }

    if (!expectedIcon) {
      console.log(`⚠️  跳过: ${menu.title} (${menu.name}) - 未找到映射`)
      continue
    }

    console.log(`🔧 正在修复: ${menu.title} (${menu.name})`)
    console.log(`   类型: ${menu.menuType}`)
    console.log(`   当前icon: ${menu.icon || '(无)'}`)
    console.log(`   目标icon: ${expectedIcon}`)

    // 获取完整菜单数据
    const fullMenu = await getMenuDetail(menu.id)
    if (!fullMenu) {
      console.log(`   ❌ 获取菜单详情失败`)
      failCount++
      continue
    }

    // 更新icon
    const success = await updateMenu(menu.id, {
      ...fullMenu,
      icon: expectedIcon,
    })

    if (success) {
      console.log(`   ✅ 修复成功\n`)
      successCount++
    } else {
      console.log(`   ❌ 修复失败\n`)
      failCount++
    }

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('='.repeat(80))
  console.log('Icon修复统计')
  console.log('='.repeat(80))
  console.log(`✅ 成功: ${successCount}`)
  console.log(`❌ 失败: ${failCount}`)
  console.log(`📊 总计: ${menus.length}`)
  console.log('='.repeat(80) + '\n')
}

/**
 * 修复i18nKey问题
 */
async function fixI18nKeyIssues(menus: Menu[]): Promise<void> {
  if (menus.length === 0) {
    console.log('\n✅ 所有菜单的i18nKey都正确，无需修复！\n')
    return
  }

  console.log('\n' + '='.repeat(80))
  console.log(`开始修复 ${menus.length} 个菜单的i18nKey`)
  console.log('='.repeat(80) + '\n')

  let successCount = 0
  let failCount = 0

  for (const menu of menus) {
    // 获取期望的i18nKey
    let expectedI18nKey: string | undefined

    if (menu.menuType === 'Menu') {
      expectedI18nKey = I18N_KEY_MAPPING[menu.name]
    } else if (menu.menuType === 'Directory') {
      const mapping = DIRECTORY_MAPPING[menu.title]
      expectedI18nKey = mapping?.i18nKey
    }

    if (!expectedI18nKey) {
      console.log(`⚠️  跳过: ${menu.title} (${menu.name}) - 未找到映射`)
      continue
    }

    console.log(`🔧 正在修复: ${menu.title} (${menu.name})`)
    console.log(`   类型: ${menu.menuType}`)
    console.log(`   当前i18nKey: ${menu.i18nKey || '(无)'}`)
    console.log(`   目标i18nKey: ${expectedI18nKey}`)

    // 获取完整菜单数据
    const fullMenu = await getMenuDetail(menu.id)
    if (!fullMenu) {
      console.log(`   ❌ 获取菜单详情失败`)
      failCount++
      continue
    }

    // 更新i18nKey
    const success = await updateMenu(menu.id, {
      ...fullMenu,
      i18nKey: expectedI18nKey,
    })

    if (success) {
      console.log(`   ✅ 修复成功\n`)
      successCount++
    } else {
      console.log(`   ❌ 修复失败\n`)
      failCount++
    }

    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('='.repeat(80))
  console.log('i18nKey修复统计')
  console.log('='.repeat(80))
  console.log(`✅ 成功: ${successCount}`)
  console.log(`❌ 失败: ${failCount}`)
  console.log(`📊 总计: ${menus.length}`)
  console.log('='.repeat(80) + '\n')
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('菜单Icon和i18nKey修复工具')
    console.log('='.repeat(80) + '\n')

    // 1. 登录
    await login()

    // 2. 获取所有菜单
    console.log('📋 正在获取菜单数据...')
    const menus = await getAllMenus()
    console.log(`✅ 获取到 ${menus.length} 个菜单项\n`)

    // 3. 分析问题
    console.log('🔍 正在分析菜单问题...\n')
    const { iconIssues, i18nIssues } = analyzeMenus(menus)

    console.log('='.repeat(80))
    console.log('分析结果')
    console.log('='.repeat(80))
    console.log(`🎨 Icon问题: ${iconIssues.length} 个`)
    console.log(`🌐 i18nKey问题: ${i18nIssues.length} 个`)
    console.log('='.repeat(80) + '\n')

    if (iconIssues.length === 0 && i18nIssues.length === 0) {
      console.log('🎉 所有菜单的icon和i18nKey都正确！\n')
      return
    }

    // 4. 显示问题详情
    if (iconIssues.length > 0) {
      console.log('📋 需要修复Icon的菜单:')
      iconIssues.forEach((menu, index) => {
        const expected = menu.menuType === 'Menu'
          ? ICON_MAPPING[menu.name]
          : DIRECTORY_MAPPING[menu.title]?.icon
        console.log(`   ${index + 1}. ${menu.title} (${menu.menuType})`)
        console.log(`      当前: ${menu.icon || '(无)'} -> 目标: ${expected}`)
      })
      console.log()
    }

    if (i18nIssues.length > 0) {
      console.log('📋 需要修复i18nKey的菜单:')
      i18nIssues.forEach((menu, index) => {
        const expected = menu.menuType === 'Menu'
          ? I18N_KEY_MAPPING[menu.name]
          : DIRECTORY_MAPPING[menu.title]?.i18nKey
        console.log(`   ${index + 1}. ${menu.title} (${menu.menuType})`)
        console.log(`      当前: ${menu.i18nKey || '(无)'} -> 目标: ${expected}`)
      })
      console.log()
    }

    // 5. 修复Icon问题
    await fixIconIssues(iconIssues)

    // 6. 修复i18nKey问题
    await fixI18nKeyIssues(i18nIssues)

    // 7. 最终总结
    console.log('='.repeat(80))
    console.log('修复完成')
    console.log('='.repeat(80))
    console.log(`🎨 Icon修复: ${iconIssues.length} 个`)
    console.log(`🌐 i18nKey修复: ${i18nIssues.length} 个`)
    console.log('='.repeat(80) + '\n')

    console.log('✨ 完成！\n')
  } catch (error: any) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
