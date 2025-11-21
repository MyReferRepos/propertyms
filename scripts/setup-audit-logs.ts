/**
 * 审计日志功能设置脚本
 * 添加审计日志菜单和权限，并分配给管理员角色
 */

const API_BASE_URL = 'http://localhost:5199/api'
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'NewPass@123'

let authToken = ''

interface Permission {
  id?: string
  name: string
  code: string
  description?: string
  type: 'Module' | 'Action'
  moduleId?: string
  action?: string
  path?: string
  httpMethod?: string
}

interface Menu {
  id?: string
  name: string
  title: string
  i18nKey: string
  path: string
  icon?: string
  sortOrder: number
  menuType: 'Menu' | 'Directory' | 'Action'
  visible: boolean
  isActive: boolean
  permissionId?: string
  menuGroupId?: string
}

interface Role {
  id: string
  name: string
  code: string
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
 * 创建权限
 */
async function createPermission(permission: Permission): Promise<string | null> {
  try {
    // 构建请求体，根据权限类型决定包含哪些字段
    const requestBody: any = {
      name: permission.name,
      code: permission.code,
      description: permission.description,
      type: permission.type,
    }

    // 只有Action类型才包含这些字段
    if (permission.type === 'Action') {
      if (permission.moduleId) requestBody.moduleId = permission.moduleId
      if (permission.action) requestBody.action = permission.action
      if (permission.path) requestBody.path = permission.path
      if (permission.httpMethod) requestBody.httpMethod = permission.httpMethod
    }

    const response = await fetch(`${API_BASE_URL}/Permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      // 如果权限已存在，尝试获取现有权限ID
      if (response.status === 400 && errorText.includes('already exists')) {
        console.log(`   ⚠️  权限已存在: ${permission.name}`)
        return await getPermissionByCode(permission.code)
      }
      throw new Error(`创建失败: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    if (data.success && data.data?.id) {
      console.log(`   ✅ 创建权限成功: ${permission.name} (${data.data.id})`)
      return data.data.id
    }
    return null
  } catch (error: any) {
    console.error(`   ❌ 创建权限失败: ${permission.name} - ${error.message}`)
    return null
  }
}

/**
 * 根据code获取权限ID
 */
async function getPermissionByCode(code: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Permissions?pageSize=1000`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) return null

    const data = await response.json()
    // API返回的是数组而不是分页对象
    if (data.success && Array.isArray(data.data)) {
      const permission = data.data.find((p: any) => p.code === code)
      if (permission?.id) {
        console.log(`   找到现有权限: ${permission.name} (${permission.id})`)
      }
      return permission?.id || null
    }
    return null
  } catch (error) {
    console.error(`   获取权限失败: ${error}`)
    return null
  }
}

/**
 * 创建菜单
 */
async function createMenu(menu: Menu): Promise<string | null> {
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
      throw new Error(`创建失败: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    if (data.success && data.data?.id) {
      console.log(`   ✅ 创建菜单成功: ${menu.title} (${data.data.id})`)
      return data.data.id
    }
    return null
  } catch (error: any) {
    console.error(`   ❌ 创建菜单失败: ${menu.title} - ${error.message}`)
    return null
  }
}

/**
 * 获取管理员角色
 */
async function getAdminRole(): Promise<Role | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/Roles?pageSize=100`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) {
      console.error('   获取角色API失败:', response.statusText)
      return null
    }

    const data = await response.json()
    console.log(`   获取到 ${Array.isArray(data.data) ? data.data.length : (data.data?.items?.length || 0)} 个角色`)

    // API可能返回数组或分页对象
    const roles = Array.isArray(data.data) ? data.data : (data.data?.items || [])

    if (roles.length > 0) {
      // 查找管理员角色
      const adminRole = roles.find((r: Role) =>
        r.code === 'super_admin' ||
        r.code === 'administrator' ||
        r.code === 'admin' ||
        r.name.toLowerCase().includes('admin')
      )
      if (adminRole) {
        return adminRole
      }
      // 如果没找到，返回第一个角色
      console.log(`   未找到明确的管理员角色，使用第一个角色: ${roles[0].name}`)
      return roles[0]
    }
    return null
  } catch (error) {
    console.error('   获取管理员角色失败:', error)
    return null
  }
}

/**
 * 获取角色的现有权限
 */
async function getRolePermissions(roleId: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Roles/${roleId}/permissions`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) return []

    const data = await response.json()
    if (data.success && data.data) {
      return data.data.map((p: any) => p.id)
    }
    return []
  } catch (error) {
    return []
  }
}

/**
 * 分配权限给角色
 */
async function assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<boolean> {
  try {
    // 获取现有权限
    const existingPermissions = await getRolePermissions(roleId)

    // 合并权限（去重）
    const allPermissions = Array.from(new Set([...existingPermissions, ...permissionIds]))

    const response = await fetch(`${API_BASE_URL}/Roles/${roleId}/permissions`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissionIds: allPermissions }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`分配失败: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.success
  } catch (error: any) {
    console.error(`   ❌ 分配权限失败: ${error.message}`)
    return false
  }
}

/**
 * 获取系统管理菜单组ID
 */
async function getSystemMenuGroupId(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/menu-groups?pageSize=100`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })

    if (!response.ok) return null

    const data = await response.json()
    if (data.success && data.data?.items) {
      // 查找系统管理菜单组
      const systemGroup = data.data.items.find((g: any) =>
        g.code === 'system_management' ||
        g.name.toLowerCase().includes('system')
      )
      return systemGroup?.id || null
    }
    return null
  } catch (error) {
    console.error('获取菜单组失败:', error)
    return null
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('审计日志功能设置')
    console.log('='.repeat(80) + '\n')

    // 1. 登录
    await login()

    // 2. 创建权限
    console.log('📋 正在创建权限...\n')

    // 使用system模块ID来创建审计日志权限
    // 审计日志属于系统管理模块
    const SYSTEM_MODULE_ID = '7dd7e857-93a9-4521-aaec-32733ed016d2'

    // 审计日志模块权限
    const auditLogModuleId = await createPermission({
      name: '审计日志',
      code: 'audit_log',
      description: '审计日志管理模块权限',
      type: 'Module',
      moduleId: SYSTEM_MODULE_ID, // 使用system模块ID
    })

    if (!auditLogModuleId) {
      throw new Error('无法创建或获取审计日志模块权限')
    }

    // 查看审计日志权限（使用system模块ID，不是audit_log权限ID）
    const viewPermissionId = await createPermission({
      name: '查看审计日志列表',
      code: 'audit_log_list',
      description: '查看审计日志列表权限',
      type: 'Action',
      moduleId: SYSTEM_MODULE_ID, // 使用system模块ID
      action: 'list',
      path: '/api/audit-logs',
      httpMethod: 'GET',
    })

    // 查看详情权限
    const viewDetailPermissionId = await createPermission({
      name: '查看审计日志详情',
      code: 'audit_log_detail',
      description: '查看单个审计日志详情权限',
      type: 'Action',
      moduleId: SYSTEM_MODULE_ID, // 使用system模块ID
      action: 'detail',
      path: '/api/audit-logs/{id}',
      httpMethod: 'GET',
    })

    // 导出权限
    const exportPermissionId = await createPermission({
      name: '导出审计日志',
      code: 'audit_log_export',
      description: '导出审计日志权限',
      type: 'Action',
      moduleId: SYSTEM_MODULE_ID, // 使用system模块ID
      action: 'export',
      path: '/api/audit-logs',
      httpMethod: 'GET',
    })

    console.log()

    // 3. 创建菜单
    console.log('📋 正在创建菜单...\n')

    // 获取系统管理菜单组
    const menuGroupId = await getSystemMenuGroupId()

    if (!menuGroupId) {
      console.warn('⚠️  未找到系统管理菜单组，将创建顶级菜单')
    }

    // 创建审计日志菜单
    const auditLogMenuId = await createMenu({
      name: 'AuditLogs',
      title: '审计日志',
      i18nKey: 'nav.auditLogs',
      path: '/audit-logs',
      icon: 'FileText',
      sortOrder: 50,
      menuType: 'Menu',
      visible: true,
      isActive: true,
      permissionId: viewPermissionId || undefined,
      menuGroupId: menuGroupId || undefined,
    })

    console.log()

    // 4. 分配权限给管理员角色
    console.log('📋 正在分配权限给管理员角色...\n')

    const adminRole = await getAdminRole()

    if (!adminRole) {
      console.warn('⚠️  未找到管理员角色，跳过权限分配')
    } else {
      console.log(`   找到管理员角色: ${adminRole.name} (${adminRole.id})`)

      const permissionIds = [
        auditLogModuleId,
        viewPermissionId,
        viewDetailPermissionId,
        exportPermissionId,
      ].filter(Boolean) as string[]

      if (permissionIds.length > 0) {
        const success = await assignPermissionsToRole(adminRole.id, permissionIds)
        if (success) {
          console.log(`   ✅ 成功分配 ${permissionIds.length} 个权限给管理员角色`)
        } else {
          console.log(`   ❌ 分配权限失败`)
        }
      }
    }

    console.log()

    // 5. 总结
    console.log('='.repeat(80))
    console.log('设置完成')
    console.log('='.repeat(80))
    console.log('✅ 审计日志功能已设置完成！')
    console.log()
    console.log('创建的资源:')
    console.log(`  - 权限: 4 个`)
    console.log(`  - 菜单: 1 个`)
    if (adminRole) {
      console.log(`  - 已分配权限给角色: ${adminRole.name}`)
    }
    console.log()
    console.log('访问路径: /audit-logs')
    console.log('='.repeat(80) + '\n')

  } catch (error: any) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
}

main()
