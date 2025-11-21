/**
 * 清理重复菜单脚本
 * 识别并删除重复的菜单项，保留最新或配置最完整的
 */

const API_BASE_URL = 'http://localhost:5199/api'
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'NewPass@123'

let authToken = ''

interface Menu {
  id: string
  name: string
  title: string
  path?: string | null
  menuType: string
  sortOrder: number
  createdAt: string
  updatedAt: string
  menuGroupId?: string | null
  permissionId?: string | null
}

interface MenuTreeNode extends Menu {
  children?: MenuTreeNode[]
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
 * 删除菜单
 */
async function deleteMenu(id: string, name: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) throw new Error(`删除失败: ${response.statusText}`)

    const data = await response.json()
    if (data.success) {
      console.log(`   ✅ 删除成功: ${name} (ID: ${id})`)
      return true
    }
    return false
  } catch (error: any) {
    console.error(`   ❌ 删除失败: ${name} - ${error.message}`)
    return false
  }
}

/**
 * 查找重复菜单
 */
function findDuplicates(menus: Menu[]): Map<string, Menu[]> {
  const duplicates = new Map<string, Menu[]>()

  // 只处理Menu类型的菜单
  const menuTypeItems = menus.filter(m => m.menuType === 'Menu')

  // 按name分组
  const grouped = new Map<string, Menu[]>()
  menuTypeItems.forEach(menu => {
    if (!grouped.has(menu.name)) {
      grouped.set(menu.name, [])
    }
    grouped.get(menu.name)!.push(menu)
  })

  // 找出重复项（超过1个的）
  grouped.forEach((items, name) => {
    if (items.length > 1) {
      duplicates.set(name, items)
    }
  })

  return duplicates
}

/**
 * 选择要保留的菜单（保留配置最完整的）
 */
function selectMenuToKeep(menus: Menu[]): { keep: Menu; remove: Menu[] } {
  // 评分规则：
  // - 有menuGroupId: +10分
  // - 有permissionId: +10分
  // - 更新时间越晚: +时间戳差值的权重

  const scored = menus.map(menu => {
    let score = 0

    // 有菜单组
    if (menu.menuGroupId) score += 10

    // 有权限
    if (menu.permissionId) score += 10

    // 更新时间（转换为分数）
    const updatedTime = new Date(menu.updatedAt).getTime()
    score += updatedTime / 1000000000 // 缩小时间戳

    return { menu, score }
  })

  // 按分数排序，保留最高分的
  scored.sort((a, b) => b.score - a.score)

  return {
    keep: scored[0].menu,
    remove: scored.slice(1).map(s => s.menu),
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('清理重复菜单工具')
    console.log('='.repeat(80) + '\n')

    // 1. 登录
    await login()

    // 2. 获取所有菜单
    console.log('📋 正在获取菜单数据...')
    const menus = await getAllMenus()
    console.log(`✅ 获取到 ${menus.length} 个菜单项\n`)

    // 3. 查找重复
    console.log('🔍 正在查找重复菜单...\n')
    const duplicates = findDuplicates(menus)

    if (duplicates.size === 0) {
      console.log('✅ 未发现重复菜单！\n')
      return
    }

    console.log('='.repeat(80))
    console.log(`发现 ${duplicates.size} 组重复菜单`)
    console.log('='.repeat(80) + '\n')

    // 4. 显示并处理每组重复
    let totalRemoved = 0

    for (const [name, items] of duplicates) {
      console.log(`📦 菜单名称: ${name} (${items.length} 个重复项)`)
      console.log('-'.repeat(80))

      // 显示所有重复项
      items.forEach((menu, index) => {
        console.log(`   ${index + 1}. ${menu.title}`)
        console.log(`      ID: ${menu.id}`)
        console.log(`      Path: ${menu.path || '(无)'}`)
        console.log(`      MenuGroup: ${menu.menuGroupId || '(无)'}`)
        console.log(`      Permission: ${menu.permissionId || '(无)'}`)
        console.log(`      Created: ${menu.createdAt}`)
        console.log(`      Updated: ${menu.updatedAt}`)
        console.log()
      })

      // 选择保留哪个
      const { keep, remove } = selectMenuToKeep(items)

      console.log(`   ✅ 保留: ${keep.title} (ID: ${keep.id})`)
      console.log(`      理由: 配置最完整或最新\n`)

      // 删除其他的
      console.log(`   🗑️  删除 ${remove.length} 个重复项:`)
      for (const menu of remove) {
        const success = await deleteMenu(menu.id, menu.title)
        if (success) {
          totalRemoved++
        }
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      console.log('\n' + '='.repeat(80) + '\n')
    }

    // 5. 总结
    console.log('='.repeat(80))
    console.log('清理完成')
    console.log('='.repeat(80))
    console.log(`📊 发现重复组: ${duplicates.size}`)
    console.log(`🗑️  删除菜单项: ${totalRemoved}`)
    console.log(`✅ 保留菜单项: ${duplicates.size}`)
    console.log('='.repeat(80) + '\n')

  } catch (error: any) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
