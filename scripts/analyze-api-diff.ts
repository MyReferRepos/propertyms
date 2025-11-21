/**
 * API差异分析脚本
 * 比对Swagger文档与前端代码中的API调用
 */

import * as fs from 'fs'
import * as path from 'path'

interface SwaggerDoc {
  paths: Record<string, any>
  components: {
    schemas: Record<string, any>
  }
}

interface ApiEndpoint {
  path: string
  method: string
  tag: string
  requestBody?: any
  responses: any
  description?: string
}

interface ApiDifference {
  category: string
  endpoint: string
  issue: string
  frontendUsage?: string
  backendDefinition?: string
  severity: 'high' | 'medium' | 'low'
  recommendation: string
}

async function main() {
  console.log('🔍 开始分析API差异...\n')

  // 1. 读取Swagger文档
  const swaggerPath = '/tmp/swagger.json'
  const swaggerDoc: SwaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))

  console.log(`✅ Swagger文档加载完成`)
  console.log(`   - API端点数: ${Object.keys(swaggerDoc.paths).length}`)
  console.log(`   - 数据模型数: ${Object.keys(swaggerDoc.components.schemas).length}\n`)

  // 2. 提取所有API端点
  const apiEndpoints = extractEndpoints(swaggerDoc)

  // 3. 按功能模块分类
  const categorizedApis = categorizeApis(apiEndpoints)

  console.log('📋 API端点分类统计:')
  Object.entries(categorizedApis).forEach(([category, apis]) => {
    console.log(`   - ${category}: ${apis.length} 个端点`)
  })
  console.log()

  // 4. 分析各个模块
  const differences: ApiDifference[] = []

  // 分析认证模块
  differences.push(...await analyzeAuthApis(categorizedApis['Auth'] || [], swaggerDoc))

  // 分析用户模块
  differences.push(...await analyzeUserApis(categorizedApis['Users'] || [], swaggerDoc))

  // 分析角色模块
  differences.push(...await analyzeRoleApis(categorizedApis['Roles'] || [], swaggerDoc))

  // 分析权限模块
  differences.push(...await analyzePermissionApis(categorizedApis['Permissions'] || [], swaggerDoc))

  // 分析菜单组模块
  differences.push(...await analyzeMenuGroupApis(categorizedApis['MenuGroups'] || [], swaggerDoc))

  // 分析菜单项模块
  differences.push(...await analyzeMenuApis(categorizedApis['Menus'] || [], swaggerDoc))

  // 5. 生成报告
  generateReport(differences, categorizedApis, swaggerDoc)
}

function extractEndpoints(swaggerDoc: SwaggerDoc): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = []

  Object.entries(swaggerDoc.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]: [string, any]) => {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        endpoints.push({
          path,
          method: method.toUpperCase(),
          tag: details.tags?.[0] || 'Unknown',
          requestBody: details.requestBody,
          responses: details.responses,
          description: details.summary || details.description,
        })
      }
    })
  })

  return endpoints
}

function categorizeApis(endpoints: ApiEndpoint[]): Record<string, ApiEndpoint[]> {
  const categorized: Record<string, ApiEndpoint[]> = {}

  endpoints.forEach((endpoint) => {
    const category = endpoint.tag
    if (!categorized[category]) {
      categorized[category] = []
    }
    categorized[category].push(endpoint)
  })

  return categorized
}

async function analyzeAuthApis(
  apis: ApiEndpoint[],
  swaggerDoc: SwaggerDoc
): Promise<ApiDifference[]> {
  console.log('🔐 分析认证模块...')
  const differences: ApiDifference[] = []

  // 检查前端auth-service.ts
  const authServicePath = path.join(process.cwd(), 'src/lib/auth/auth-service.ts')
  const authServiceContent = fs.readFileSync(authServicePath, 'utf-8')

  // 检查登录API
  const loginEndpoint = apis.find((a) => a.path.includes('login'))
  if (loginEndpoint) {
    const loginResponseSchema = getResponseSchema(loginEndpoint, swaggerDoc)
    console.log(`   ✓ 登录端点: ${loginEndpoint.method} ${loginEndpoint.path}`)

    // 检查响应结构
    if (loginResponseSchema?.properties?.data?.properties) {
      const dataProps = Object.keys(loginResponseSchema.properties.data.properties)
      console.log(`     响应字段: ${dataProps.join(', ')}`)

      // 检查前端是否正确使用了这些字段
      if (dataProps.includes('token') && !authServiceContent.includes('token')) {
        differences.push({
          category: 'Auth',
          endpoint: 'POST /api/Auth/login',
          issue: '前端未使用响应中的token字段',
          severity: 'high',
          recommendation: '更新authService以使用正确的token字段',
        })
      }
    }
  }

  // 检查刷新令牌API
  const refreshEndpoint = apis.find((a) => a.path.includes('refresh'))
  if (refreshEndpoint) {
    console.log(`   ✓ 刷新令牌端点: ${refreshEndpoint.method} ${refreshEndpoint.path}`)
  }

  // 检查登出API
  const logoutEndpoint = apis.find((a) => a.path.includes('logout'))
  if (logoutEndpoint) {
    console.log(`   ✓ 登出端点: ${logoutEndpoint.method} ${logoutEndpoint.path}`)
  }

  console.log()
  return differences
}

async function analyzeUserApis(
  apis: ApiEndpoint[],
  swaggerDoc: SwaggerDoc
): Promise<ApiDifference[]> {
  console.log('👥 分析用户管理模块...')
  const differences: ApiDifference[] = []

  // 检查用户API服务
  const userApiPath = path.join(process.cwd(), 'src/features/users/api/user-api.ts')
  if (fs.existsSync(userApiPath)) {
    const userApiContent = fs.readFileSync(userApiPath, 'utf-8')

    apis.forEach((endpoint) => {
      console.log(`   ✓ ${endpoint.method} ${endpoint.path}`)

      // 检查请求/响应DTO
      if (endpoint.requestBody) {
        const requestSchema = getRequestSchema(endpoint, swaggerDoc)
        if (requestSchema) {
          const schemaName = getSchemaName(endpoint.requestBody)
          console.log(`     请求: ${schemaName}`)
        }
      }

      const responseSchema = getResponseSchema(endpoint, swaggerDoc)
      if (responseSchema) {
        const schemaName = getResponseSchemaName(endpoint)
        console.log(`     响应: ${schemaName}`)
      }
    })
  }

  console.log()
  return differences
}

async function analyzeRoleApis(
  apis: ApiEndpoint[],
  swaggerDoc: SwaggerDoc
): Promise<ApiDifference[]> {
  console.log('🎭 分析角色管理模块...')
  const differences: ApiDifference[] = []

  apis.forEach((endpoint) => {
    console.log(`   ✓ ${endpoint.method} ${endpoint.path}`)
  })

  console.log()
  return differences
}

async function analyzePermissionApis(
  apis: ApiEndpoint[],
  swaggerDoc: SwaggerDoc
): Promise<ApiDifference[]> {
  console.log('🔑 分析权限管理模块...')
  const differences: ApiDifference[] = []

  // 检查权限API
  const permissionApiPath = path.join(process.cwd(), 'src/features/users/api/permission-api.ts')
  if (fs.existsSync(permissionApiPath)) {
    const permissionApiContent = fs.readFileSync(permissionApiPath, 'utf-8')

    apis.forEach((endpoint) => {
      console.log(`   ✓ ${endpoint.method} ${endpoint.path}`)

      // 特别检查权限数据结构
      const responseSchema = getResponseSchema(endpoint, swaggerDoc)
      if (responseSchema && endpoint.path.includes('tree')) {
        console.log(`     🌳 树形结构端点`)
      }
    })

    // 检查PermissionType枚举
    const permissionTypesPath = path.join(process.cwd(), 'src/features/users/types.ts')
    if (fs.existsSync(permissionTypesPath)) {
      const typesContent = fs.readFileSync(permissionTypesPath, 'utf-8')

      // 从Swagger中获取PermissionType枚举
      const permissionTypeSchema = swaggerDoc.components.schemas['PermissionType']
      if (permissionTypeSchema?.enum) {
        console.log(`   📋 后端权限类型: ${permissionTypeSchema.enum.join(', ')}`)

        // 检查前端是否匹配
        permissionTypeSchema.enum.forEach((type: string) => {
          if (!typesContent.includes(`'${type}'`) && !typesContent.includes(`"${type}"`)) {
            differences.push({
              category: 'Permissions',
              endpoint: 'PermissionType Enum',
              issue: `前端缺少权限类型: ${type}`,
              backendDefinition: JSON.stringify(permissionTypeSchema.enum),
              severity: 'high',
              recommendation: `在types.ts中添加 ${type} 权限类型`,
            })
          }
        })
      }
    }
  }

  console.log()
  return differences
}

async function analyzeMenuGroupApis(
  apis: ApiEndpoint[],
  swaggerDoc: SwaggerDoc
): Promise<ApiDifference[]> {
  console.log('📁 分析菜单组模块...')
  const differences: ApiDifference[] = []

  // 检查MenuGroup DTO
  const menuGroupSchema = swaggerDoc.components.schemas['MenuGroupDto']
  if (menuGroupSchema) {
    console.log(`   📋 MenuGroupDto 字段:`)
    const props = Object.keys(menuGroupSchema.properties || {})
    props.forEach((prop) => {
      console.log(`      - ${prop}`)
    })

    // 检查前端类型定义
    const menuTypesPath = path.join(process.cwd(), 'src/features/menu/types.ts')
    if (fs.existsSync(menuTypesPath)) {
      const typesContent = fs.readFileSync(menuTypesPath, 'utf-8')

      // 检查是否还有code字段引用
      if (typesContent.includes('code:') || typesContent.includes('code?:')) {
        differences.push({
          category: 'MenuGroups',
          endpoint: 'MenuGroup Type',
          issue: '前端MenuGroup类型定义中可能仍包含code字段',
          severity: 'medium',
          recommendation: '确认前端types.ts中完全移除了code字段',
        })
      }

      // 检查后端是否还有code字段
      if (props.includes('code')) {
        differences.push({
          category: 'MenuGroups',
          endpoint: 'MenuGroupDto',
          issue: '后端MenuGroupDto仍包含code字段',
          backendDefinition: JSON.stringify(props),
          severity: 'high',
          recommendation: '后端需要移除MenuGroupDto中的code字段',
        })
      }
    }
  }

  apis.forEach((endpoint) => {
    console.log(`   ✓ ${endpoint.method} ${endpoint.path}`)
  })

  console.log()
  return differences
}

async function analyzeMenuApis(
  apis: ApiEndpoint[],
  swaggerDoc: SwaggerDoc
): Promise<ApiDifference[]> {
  console.log('🍔 分析菜单项模块...')
  const differences: ApiDifference[] = []

  // 检查Menu DTO
  const menuSchema = swaggerDoc.components.schemas['MenuDto']
  if (menuSchema) {
    console.log(`   📋 MenuDto 字段:`)
    const props = Object.keys(menuSchema.properties || {})
    props.forEach((prop) => {
      console.log(`      - ${prop}`)
    })

    // 检查关键字段
    const frontendTypesPath = path.join(process.cwd(), 'src/features/menu/types.ts')
    if (fs.existsSync(frontendTypesPath)) {
      const typesContent = fs.readFileSync(frontendTypesPath, 'utf-8')

      // 检查permissionId vs permissionIds
      if (props.includes('permissionId') && typesContent.includes('permissionIds')) {
        differences.push({
          category: 'Menus',
          endpoint: 'Menu Type',
          issue: '前端使用permissionIds（数组），后端使用permissionId（单个）',
          backendDefinition: 'permissionId: string | null',
          frontendUsage: 'permissionIds: string[]',
          severity: 'high',
          recommendation: '前端需要将permissionIds改为permissionId以匹配后端',
        })
      }

      // 检查alwaysShow字段
      if (props.includes('alwaysShow') && !typesContent.includes('alwaysShow')) {
        differences.push({
          category: 'Menus',
          endpoint: 'Menu Type',
          issue: '前端缺少alwaysShow字段',
          severity: 'medium',
          recommendation: '前端Menu类型需要添加alwaysShow字段',
        })
      }
    }
  }

  // 检查MenuType枚举
  const menuTypeSchema = swaggerDoc.components.schemas['MenuType']
  if (menuTypeSchema?.enum) {
    console.log(`   📋 MenuType 枚举: ${menuTypeSchema.enum.join(', ')}`)
  }

  apis.forEach((endpoint) => {
    console.log(`   ✓ ${endpoint.method} ${endpoint.path}`)
  })

  console.log()
  return differences
}

function getRequestSchema(endpoint: ApiEndpoint, swaggerDoc: SwaggerDoc): any {
  if (!endpoint.requestBody?.content?.['application/json']?.schema) {
    return null
  }

  const schemaRef = endpoint.requestBody.content['application/json'].schema.$ref
  if (schemaRef) {
    const schemaName = schemaRef.split('/').pop()
    return swaggerDoc.components.schemas[schemaName]
  }

  return endpoint.requestBody.content['application/json'].schema
}

function getResponseSchema(endpoint: ApiEndpoint, swaggerDoc: SwaggerDoc): any {
  const response200 = endpoint.responses['200']
  if (!response200?.content?.['application/json']?.schema) {
    return null
  }

  const schemaRef = response200.content['application/json'].schema.$ref
  if (schemaRef) {
    const schemaName = schemaRef.split('/').pop()
    return swaggerDoc.components.schemas[schemaName]
  }

  return response200.content['application/json'].schema
}

function getSchemaName(requestBody: any): string {
  const schemaRef = requestBody?.content?.['application/json']?.schema?.$ref
  if (schemaRef) {
    return schemaRef.split('/').pop()
  }
  return 'Unknown'
}

function getResponseSchemaName(endpoint: ApiEndpoint): string {
  const response200 = endpoint.responses['200']
  const schemaRef = response200?.content?.['application/json']?.schema?.$ref
  if (schemaRef) {
    return schemaRef.split('/').pop()
  }
  return 'Unknown'
}

function generateReport(
  differences: ApiDifference[],
  categorizedApis: Record<string, ApiEndpoint[]>,
  swaggerDoc: SwaggerDoc
) {
  console.log('\n' + '='.repeat(80))
  console.log('📊 API差异分析报告')
  console.log('='.repeat(80) + '\n')

  // 统计信息
  console.log('📈 统计信息:')
  console.log(`   - 总端点数: ${Object.values(categorizedApis).flat().length}`)
  console.log(`   - 发现差异数: ${differences.length}`)
  console.log(`   - 高优先级: ${differences.filter((d) => d.severity === 'high').length}`)
  console.log(`   - 中优先级: ${differences.filter((d) => d.severity === 'medium').length}`)
  console.log(`   - 低优先级: ${differences.filter((d) => d.severity === 'low').length}`)
  console.log()

  // 按类别分组差异
  const diffsByCategory = differences.reduce(
    (acc, diff) => {
      if (!acc[diff.category]) {
        acc[diff.category] = []
      }
      acc[diff.category].push(diff)
      return acc
    },
    {} as Record<string, ApiDifference[]>
  )

  // 输出详细差异
  Object.entries(diffsByCategory).forEach(([category, diffs]) => {
    console.log(`\n${'─'.repeat(80)}`)
    console.log(`📦 ${category} 模块差异 (${diffs.length}项)`)
    console.log('─'.repeat(80))

    diffs.forEach((diff, index) => {
      const severityIcon =
        diff.severity === 'high' ? '🔴' : diff.severity === 'medium' ? '🟡' : '🟢'
      console.log(`\n${index + 1}. ${severityIcon} ${diff.endpoint}`)
      console.log(`   问题: ${diff.issue}`)
      if (diff.frontendUsage) {
        console.log(`   前端: ${diff.frontendUsage}`)
      }
      if (diff.backendDefinition) {
        console.log(`   后端: ${diff.backendDefinition}`)
      }
      console.log(`   建议: ${diff.recommendation}`)
    })
  })

  // 生成调整方案
  console.log('\n' + '='.repeat(80))
  console.log('🛠️  调整方案')
  console.log('='.repeat(80) + '\n')

  const highPriorityDiffs = differences.filter((d) => d.severity === 'high')
  if (highPriorityDiffs.length > 0) {
    console.log('🔴 高优先级调整 (必须立即处理):\n')
    highPriorityDiffs.forEach((diff, index) => {
      console.log(`${index + 1}. [${diff.category}] ${diff.endpoint}`)
      console.log(`   ${diff.recommendation}\n`)
    })
  }

  const mediumPriorityDiffs = differences.filter((d) => d.severity === 'medium')
  if (mediumPriorityDiffs.length > 0) {
    console.log('🟡 中优先级调整 (建议尽快处理):\n')
    mediumPriorityDiffs.forEach((diff, index) => {
      console.log(`${index + 1}. [${diff.category}] ${diff.endpoint}`)
      console.log(`   ${diff.recommendation}\n`)
    })
  }

  // 保存详细报告到文件
  const reportPath = path.join(process.cwd(), 'API_DIFF_REPORT.md')
  const markdownReport = generateMarkdownReport(differences, categorizedApis, swaggerDoc)
  fs.writeFileSync(reportPath, markdownReport, 'utf-8')
  console.log(`\n✅ 详细报告已保存到: ${reportPath}\n`)
}

function generateMarkdownReport(
  differences: ApiDifference[],
  categorizedApis: Record<string, ApiEndpoint[]>,
  swaggerDoc: SwaggerDoc
): string {
  const now = new Date().toISOString()

  let md = `# API差异分析报告\n\n`
  md += `**生成时间**: ${now}\n\n`
  md += `---\n\n`

  // 摘要
  md += `## 📋 摘要\n\n`
  md += `- **总端点数**: ${Object.values(categorizedApis).flat().length}\n`
  md += `- **发现差异数**: ${differences.length}\n`
  md += `- **高优先级**: ${differences.filter((d) => d.severity === 'high').length}\n`
  md += `- **中优先级**: ${differences.filter((d) => d.severity === 'medium').length}\n`
  md += `- **低优先级**: ${differences.filter((d) => d.severity === 'low').length}\n\n`

  // API端点列表
  md += `## 🔗 API端点列表\n\n`
  Object.entries(categorizedApis).forEach(([category, apis]) => {
    md += `### ${category}\n\n`
    apis.forEach((api) => {
      md += `- \`${api.method} ${api.path}\`\n`
      if (api.description) {
        md += `  - ${api.description}\n`
      }
    })
    md += `\n`
  })

  // 差异详情
  md += `## ⚠️ 发现的差异\n\n`

  const diffsByCategory = differences.reduce(
    (acc, diff) => {
      if (!acc[diff.category]) {
        acc[diff.category] = []
      }
      acc[diff.category].push(diff)
      return acc
    },
    {} as Record<string, ApiDifference[]>
  )

  Object.entries(diffsByCategory).forEach(([category, diffs]) => {
    md += `### ${category}\n\n`
    diffs.forEach((diff) => {
      const severityBadge =
        diff.severity === 'high'
          ? '🔴 **HIGH**'
          : diff.severity === 'medium'
            ? '🟡 **MEDIUM**'
            : '🟢 **LOW**'

      md += `#### ${diff.endpoint} ${severityBadge}\n\n`
      md += `**问题**: ${diff.issue}\n\n`
      if (diff.frontendUsage) {
        md += `**前端使用**:\n\`\`\`\n${diff.frontendUsage}\n\`\`\`\n\n`
      }
      if (diff.backendDefinition) {
        md += `**后端定义**:\n\`\`\`\n${diff.backendDefinition}\n\`\`\`\n\n`
      }
      md += `**建议**: ${diff.recommendation}\n\n`
      md += `---\n\n`
    })
  })

  // 调整方案
  md += `## 🛠️ 调整方案\n\n`

  const highPriorityDiffs = differences.filter((d) => d.severity === 'high')
  if (highPriorityDiffs.length > 0) {
    md += `### 🔴 高优先级 (必须立即处理)\n\n`
    highPriorityDiffs.forEach((diff, index) => {
      md += `${index + 1}. **[${diff.category}] ${diff.endpoint}**\n`
      md += `   - ${diff.recommendation}\n\n`
    })
  }

  const mediumPriorityDiffs = differences.filter((d) => d.severity === 'medium')
  if (mediumPriorityDiffs.length > 0) {
    md += `### 🟡 中优先级 (建议尽快处理)\n\n`
    mediumPriorityDiffs.forEach((diff, index) => {
      md += `${index + 1}. **[${diff.category}] ${diff.endpoint}**\n`
      md += `   - ${diff.recommendation}\n\n`
    })
  }

  // 关键数据模型
  md += `## 📊 关键数据模型\n\n`

  const keySchemas = [
    'MenuGroupDto',
    'MenuDto',
    'PermissionDto',
    'RoleDto',
    'UserDto',
    'PermissionType',
    'MenuType',
  ]

  keySchemas.forEach((schemaName) => {
    const schema = swaggerDoc.components.schemas[schemaName]
    if (schema) {
      md += `### ${schemaName}\n\n`
      if (schema.enum) {
        md += `**枚举值**: ${schema.enum.join(', ')}\n\n`
      } else if (schema.properties) {
        md += `**字段**:\n`
        Object.entries(schema.properties).forEach(([key, value]: [string, any]) => {
          const type = value.type || value.$ref?.split('/').pop() || 'unknown'
          const required = schema.required?.includes(key) ? '**required**' : 'optional'
          md += `- \`${key}\`: ${type} (${required})\n`
        })
        md += `\n`
      }
    }
  })

  return md
}

main().catch(console.error)
