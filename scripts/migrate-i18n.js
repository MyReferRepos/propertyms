/**
 * i18n Migration Script
 * 将单一大文件翻译拆分为模块化翻译结构
 *
 * 使用方法：
 * node scripts/migrate-i18n.js
 *
 * 或者指定配置文件：
 * node scripts/migrate-i18n.js --config migration-config.json
 */

const fs = require('fs')
const path = require('path')

/**
 * 迁移配置
 * 定义哪些键应该放到哪个模块
 */
const defaultConfig = {
  // 全局模块 - 放在 src/locales/{locale}/{module}.json
  global: {
    common: ['common'],
    auth: ['auth'],
    nav: ['nav'],
    breadcrumb: ['breadcrumb'],
    user: ['user'],
  },
  // 功能模块 - 放在 src/features/{module}/locales/{locale}.json
  features: {
    users: ['users', 'userManagement'],
    roles: ['roles', 'roleManagement'],
    permissions: ['permissions', 'permissionManagement'],
    dashboard: ['dashboard'],
    demo: ['demo'],
    settings: ['settings'],
    profile: ['profile'],
  }
}

/**
 * 读取 JSON 文件
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message)
    return null
  }
}

/**
 * 写入 JSON 文件
 */
function writeJsonFile(filePath, data) {
  try {
    // 确保目录存在
    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })

    // 写入文件，格式化为 2 空格缩进
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
    return true
  } catch (error) {
    console.error(`Failed to write ${filePath}:`, error.message)
    return false
  }
}

/**
 * 拆分翻译到全局模块
 */
function splitGlobalModules(translations, config, locale, outputDir) {
  const results = []

  for (const [moduleName, keys] of Object.entries(config)) {
    const moduleData = {}
    let keyCount = 0

    for (const key of keys) {
      if (translations[key]) {
        moduleData[key] = translations[key]
        keyCount++
      }
    }

    if (keyCount > 0) {
      const outputPath = path.join(outputDir, 'locales', locale, `${moduleName}.json`)
      const success = writeJsonFile(outputPath, moduleData)
      results.push({
        module: moduleName,
        type: 'global',
        path: outputPath,
        keys: keyCount,
        success
      })
    }
  }

  return results
}

/**
 * 拆分翻译到功能模块
 */
function splitFeatureModules(translations, config, locale, outputDir) {
  const results = []

  for (const [moduleName, keys] of Object.entries(config)) {
    const moduleData = {}
    let keyCount = 0

    for (const key of keys) {
      if (translations[key]) {
        moduleData[key] = translations[key]
        keyCount++
      }
    }

    if (keyCount > 0) {
      const outputPath = path.join(outputDir, 'features', moduleName, 'locales', `${locale}.json`)
      const success = writeJsonFile(outputPath, moduleData)
      results.push({
        module: moduleName,
        type: 'feature',
        path: outputPath,
        keys: keyCount,
        success
      })
    }
  }

  return results
}

/**
 * 检查未分配的键
 */
function findUnassignedKeys(translations, config) {
  const assignedKeys = new Set()

  // 收集所有已分配的键
  for (const keys of Object.values(config.global)) {
    keys.forEach(key => assignedKeys.add(key))
  }
  for (const keys of Object.values(config.features)) {
    keys.forEach(key => assignedKeys.add(key))
  }

  // 找出未分配的键
  const unassignedKeys = []
  for (const key of Object.keys(translations)) {
    if (!assignedKeys.has(key)) {
      unassignedKeys.push(key)
    }
  }

  return unassignedKeys
}

/**
 * 主迁移函数
 */
function migrate(options = {}) {
  const {
    config = defaultConfig,
    locales = ['en', 'zh-CN'],
    inputDir = path.join(__dirname, '..', 'src'),
    outputDir = path.join(__dirname, '..', 'src'),
    dryRun = false
  } = options

  console.log('🚀 Starting i18n migration...\n')

  const report = {
    locales: [],
    totalFiles: 0,
    totalKeys: 0,
    unassignedKeys: {}
  }

  for (const locale of locales) {
    console.log(`📦 Processing locale: ${locale}`)

    // 读取源文件
    const inputFile = path.join(inputDir, 'locales', `${locale}.json`)
    const translations = readJsonFile(inputFile)

    if (!translations) {
      console.log(`  ⚠️  Skipped: file not found\n`)
      continue
    }

    const localeReport = {
      locale,
      inputFile,
      modules: [],
      totalKeys: Object.keys(translations).length
    }

    // 检查未分配的键
    const unassignedKeys = findUnassignedKeys(translations, config)
    if (unassignedKeys.length > 0) {
      console.log(`  ⚠️  Found ${unassignedKeys.length} unassigned keys:`)
      console.log(`     ${unassignedKeys.join(', ')}\n`)
      report.unassignedKeys[locale] = unassignedKeys
    }

    if (!dryRun) {
      // 拆分到全局模块
      const globalResults = splitGlobalModules(translations, config.global, locale, outputDir)
      localeReport.modules.push(...globalResults)

      // 拆分到功能模块
      const featureResults = splitFeatureModules(translations, config.features, locale, outputDir)
      localeReport.modules.push(...featureResults)

      // 打印结果
      console.log('  ✅ Global modules:')
      globalResults.forEach(r => {
        console.log(`     ${r.module}: ${r.keys} keys → ${path.relative(process.cwd(), r.path)}`)
      })

      console.log('  ✅ Feature modules:')
      featureResults.forEach(r => {
        console.log(`     ${r.module}: ${r.keys} keys → ${path.relative(process.cwd(), r.path)}`)
      })

      report.totalFiles += globalResults.length + featureResults.length
      report.totalKeys += globalResults.reduce((sum, r) => sum + r.keys, 0) +
                         featureResults.reduce((sum, r) => sum + r.keys, 0)
    }

    report.locales.push(localeReport)
    console.log('')
  }

  // 打印总结
  console.log('📊 Migration Summary:')
  console.log(`  Total locales: ${report.locales.length}`)
  console.log(`  Total files created: ${report.totalFiles}`)
  console.log(`  Total keys migrated: ${report.totalKeys}`)

  if (Object.keys(report.unassignedKeys).length > 0) {
    console.log(`\n⚠️  Warning: Some keys were not assigned to any module.`)
    console.log(`  Please update the migration config or create new modules for these keys.`)
  }

  if (dryRun) {
    console.log(`\n🔍 Dry run completed. No files were created.`)
    console.log(`  Remove --dry-run flag to perform actual migration.`)
  } else {
    console.log(`\n✅ Migration completed successfully!`)
  }

  return report
}

/**
 * CLI 入口
 */
if (require.main === module) {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  migrate({ dryRun })
}

module.exports = { migrate, defaultConfig }
