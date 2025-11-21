/**
 * 菜单路径验证和修正脚本
 * 检查数据库中的菜单路径是否与实际前端路由匹配
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
  permissionId?: string | null
}

interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[]
}

// 前端实际存在的路由路径映射
// key是菜单的name字段（后端数据库中的name）
const ACTUAL_ROUTES: Record<string, string> = {
  // 首页
  'Dashboard': '/',

  // 框架演示
  'FrameworkDemo': '/demo',

  // 用户管理模块
  'UserManagement': '/users',
  'RoleManagement': '/users/roles',
  'PermissionManagement': '/users/permissions',

  // 菜单管理模块
  'MenuManagement': '/menu',
  'MenuGroupManagement': '/menu/groups',
  'MenuItemManagement': '/menu/items',

  // 设置模块
  'SystemSettings': '/settings/general',
  'GeneralSettings': '/settings/general',  // 通用设置的另一个名称
  'ProfileSettings': '/settings/profile',

  // 组件示例
  'ComponentExamples': '/demo',  // 如果有单独的examples页面，需要创建路由
}

/**
 * 登录获取token
 */
async function login(): Promise<void> {
  console.log('🔐 正在登录...')

  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
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

  const data = await response.json()

  if (data.success && data.data?.token) {
    authToken = data.data.token
    console.log('✅ 登录成功\n')
  } else {
    throw new Error('登录失败: 未获取到token')
  }
}

/**
 * 获取所有菜单（树形结构）
 */
async function getAllMenus(): Promise<MenuTreeNode[]> {
  console.log('📋 正在获取菜单数据...')

  const response = await fetch(`${API_BASE_URL}/menus/tree`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`获取菜单失败: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.success && data.data) {
    console.log(`✅ 获取到 ${countMenus(data.data)} 个菜单项\n`)
    return data.data
  }

  return []
}

/**
 * 统计菜单数量（递归）
 */
function countMenus(menus: MenuTreeNode[]): number {
  let count = menus.length
  menus.forEach(menu => {
    if (menu.children) {
      count += countMenus(menu.children)
    }
  })
  return count
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
 * 验证菜单路径
 */
function verifyMenuPaths(menus: Menu[]): { correct: Menu[], incorrect: Menu[] } {
  const correct: Menu[] = []
  const incorrect: Menu[] = []

  console.log('🔍 正在验证菜单路径...\n')
  console.log('=' .repeat(80))
  console.log('菜单路径验证结果')
  console.log('='.repeat(80) + '\n')

  menus.forEach(menu => {
    // 只检查Menu类型（实际页面），跳过Directory和Action
    if (menu.menuType !== 'Menu') {
      return
    }

    // 根据name或i18nKey查找对应的实际路由
    const expectedPath = ACTUAL_ROUTES[menu.name] || null
    const currentPath = menu.path

    if (expectedPath === null) {
      // 未找到对应的路由映射
      console.log(`⚠️  ${menu.name}`)
      console.log(`   当前路径: ${currentPath || '(未设置)'}`)
      console.log(`   状态: 无法确定正确路径 (请手动检查)\n`)
      return
    }

    if (currentPath === expectedPath) {
      // 路径正确
      correct.push(menu)
      console.log(`✅ ${menu.title}`)
      console.log(`   名称: ${menu.name}`)
      console.log(`   路径: ${currentPath}`)
      console.log(`   状态: 正确\n`)
    } else {
      // 路径不正确
      incorrect.push(menu)
      console.log(`❌ ${menu.title}`)
      console.log(`   名称: ${menu.name}`)
      console.log(`   当前路径: ${currentPath || '(未设置)'}`)
      console.log(`   正确路径: ${expectedPath}`)
      console.log(`   状态: 需要修正\n`)
    }
  })

  return { correct, incorrect }
}

/**
 * 更新菜单路径
 */
async function updateMenuPath(menuId: string, menuName: string, newPath: string): Promise<boolean> {
  try {
    // 先获取完整的菜单信息
    const getResponse = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })

    if (!getResponse.ok) {
      throw new Error(`获取菜单详情失败: ${getResponse.statusText}`)
    }

    const getData = await getResponse.json()
    if (!getData.success || !getData.data) {
      throw new Error('获取菜单详情失败')
    }

    const menu = getData.data

    // 更新菜单
    const updateResponse = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...menu,
        path: newPath,
      }),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      throw new Error(`更新失败: ${updateResponse.statusText} - ${errorText}`)
    }

    const updateData = await updateResponse.json()

    if (updateData.success) {
      console.log(`   ✅ 成功更新: ${menuName} -> ${newPath}`)
      return true
    } else {
      console.log(`   ❌ 更新失败: ${menuName}`)
      return false
    }
  } catch (error: any) {
    console.log(`   ❌ 更新出错: ${menuName} - ${error.message}`)
    return false
  }
}

/**
 * 批量更新不正确的菜单路径
 */
async function fixIncorrectPaths(incorrectMenus: Menu[]): Promise<void> {
  if (incorrectMenus.length === 0) {
    console.log('\n✅ 所有菜单路径都正确，无需修正！\n')
    return
  }

  console.log('\n' + '='.repeat(80))
  console.log('开始修正不正确的菜单路径')
  console.log('='.repeat(80) + '\n')

  let successCount = 0
  let failCount = 0

  for (const menu of incorrectMenus) {
    const expectedPath = ACTUAL_ROUTES[menu.name]
    if (!expectedPath) continue

    console.log(`🔧 正在修正: ${menu.title} (${menu.name})`)
    const success = await updateMenuPath(menu.id, menu.name, expectedPath)

    if (success) {
      successCount++
    } else {
      failCount++
    }

    // 添加小延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n' + '='.repeat(80))
  console.log('修正完成统计')
  console.log('='.repeat(80))
  console.log(`✅ 成功: ${successCount}`)
  console.log(`❌ 失败: ${failCount}`)
  console.log(`📊 总计: ${incorrectMenus.length}`)
  console.log('='.repeat(80) + '\n')
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('菜单路径验证和修正工具')
    console.log('='.repeat(80) + '\n')

    // 1. 登录
    await login()

    // 2. 获取所有菜单
    const menuTree = await getAllMenus()
    const allMenus = flattenMenuTree(menuTree)

    // 3. 验证路径
    const { correct, incorrect } = verifyMenuPaths(allMenus)

    // 4. 显示统计
    console.log('='.repeat(80))
    console.log('验证统计')
    console.log('='.repeat(80))
    console.log(`✅ 路径正确: ${correct.length}`)
    console.log(`❌ 路径错误: ${incorrect.length}`)
    console.log(`📋 检查的Menu类型菜单: ${correct.length + incorrect.length}`)
    console.log(`📊 总菜单数: ${allMenus.length}`)
    console.log('='.repeat(80) + '\n')

    // 5. 修正错误的路径
    if (incorrect.length > 0) {
      await fixIncorrectPaths(incorrect)
    }

    console.log('✨ 完成！\n')
  } catch (error: any) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
